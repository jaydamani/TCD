const message = require('../../Events/xp/message')
const baseCommand = require('../../registry/structures/baseCommand')
const { loadImage, createCanvas} = require('canvas')
const { MessageAttachment } = require('discord.js')
const xpMap = client.xpMap
const w = 766		//width of canvas
const h = 230		//height of canvas
const ox = 20		//x position of overlay
const oy = 20		//y position of overlay
const r = 78		//radius of the circular profile
const cy = h/2		//x of center of circle
const cx = ox + 33 + r 	//y of center of circle
const lx = cx + r + 20	//x of line
const ly = h/2 		//y of line
const lx2 = w - ox - 20//x of end of line
const py = cy + r/2	//y of progress bar
const g = 5		//gap between fonts and line

require('canvas-extras')

module.exports = new baseCommand('xp',[],async (cmd,argz,message) => {

    let bg = /https?:\/\/(\w+\.)+\w+/.test(argz[0]) ? argz.shift() : message.attachments.first()?.proxyURL 
    const xp =client.xpMap.get(message.author.id)
    const a = createCanvas(w,h)
    const c = a.getContext("2d")
    const av = await loadImage('' || message.author.displayAvatarURL({format : 'jpg', size : 4096})) 

    c.shadowBlur = 100
    //background
    bg = await loadImage(bg ?? '/home/jay/.config/awesome/pics/wallpaper.jpg')
    await c.drawImage(bg,0,0,w,h)

    //overlay
    c.beginPath()
    c.fillStyle = '#0000005A'
    c.roundRect(ox,oy,a.width - 2*ox,a.height - 2*oy, 25)
    //c.roundRect(20,30, 710, 140, 25)
    c.fill()
    c.closePath()

    //line
    c.strokeStyle = '#FFFFFF'
    c.beginPath()
    c.moveTo(lx, ly)
    c.lineTo(lx2, ly)
    c.stroke()
    c.closePath()

    //bar
    c.beginPath()
    c.progressBar(5, 10, lx, py, lx2 - lx, 20, '#FFA500', '#00000000','#FFFFFF')
    c.closePath()

    //name
    c.fillStyle = '#FFFFFF'
    c.font = `${Math.max(lx2 - lx,c.measureText(message.member.displayName + '#1').width)/10}px sans-serif`
    c.fillText(message.member.displayName + '#1', lx, ly - 10, lx2 - lx)

    //leveling info
    c.font = `${py - ly - 2*g}px serif`
    c.textBaseline = 'middle'
    c.fillText(`level : ${xp.lvl}`, lx, ( py + ly )/2)
    c.textAlign = "right"
    c.fillText(`${xp.xp}/${5*(xp.lvl**2 + 50*xp.lvl + 100)}`, lx2,  ( py + ly )/2)

    //circle profile
    c.strokeStyle = '#FFFFFF00'
    c.lineWidth = 5
    c.save()
    c.beginPath()
    c.arc(cx, cy, r, 0, Math.PI*2)
    c.closePath()
    c.stroke()
    c.clip()
    await c.drawImage(av, cx -r, cy - r, 2 * r, 2 * r)
    await c.restore()

    message.channel.send('',new MessageAttachment(a.toBuffer()))

})
