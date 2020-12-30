const baseCommand = require('../../registry/structures/baseCommand')
const { loadImage, createCanvas} = require('canvas')
const { MessageAttachment } = require('discord.js')

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

require('canvas-extras')

module.exports = new baseCommand('xp',[],async (cmd,argz,message, { xpMap, db } ) => {

    const userID = res = argz.match(/(?=<@!?)[0,9]+>?/) ? res[0] : message.author.id
    const { xp, level } = xpMap.get(userID)
    const obj = db.prepare(`select * from xpCardConfig where memberID = ${userID}`)
    const a = createCanvas(w,h)
    const c = a.getContext("2d")
    const xpForNextLevel = 5*(level**2) + 50*level + 100
    const rank = xpMap.values.filter(a => `${a.level}.${a.xp}` >= `${a.level}.${a.xp}`).length + 1

    //background
    bg = await loadImage(obj.imageURL ?? '~/.config/awesome/pics/wallpaper.jpg')
    c.drawImage(bg,0,0,w,h)

    //overlay
    c.beginPath()
    c.fillStyle = obj.overlayBG
    c.roundRect(ox, oy, w - 2*ox, h - 2*oy, 25)
    c.fill()
    c.closePath()

    //line
    c.strokeStyle = obj.lineColor
    c.beginPath()
    c.moveTo(lx, ly)
    c.lineTo(lx2, ly)
    c.stroke()
    c.closePath()

    //bar
    c.beginPath()
    c.progressBar( obj.xp , xpForNextLevel, lx, py, lx2 - lx, 20, obj.pbFG, obj.pbBG, obj.pbBorder)
    c.closePath()

    //text

    //name
    c.fillStyle = obj.textColor
    c.font = `${Math.max(lx2 - lx,c.measureText(message.member.displayName + rank).width)/10}px sans-serif`
    c.fillText(message.member.displayName + rank, lx, ly - 10, lx2 - lx)

    //leveling info
    c.font = `${py - ly - 10}px serif`
    c.textBaseline = 'middle'
    c.fillText(`level : ${obj.level}`, lx, ( py + ly )/2)
    c.textAlign = "right"
    c.fillText(`${obj.xp}/${xpForNextLevel}`, lx2,  ( py + ly )/2)

    //circle profile
    c.strokeStyle = obj.pfpBorder
    c.lineWidth = 5 //the width of border
    c.save()
    c.beginPath()
    c.arc(cx, cy, r, 0, Math.PI*2)
    c.closePath()
    c.stroke()
    c.clip()
    c.drawImage(loadImage(message.author.displayAvatarURL,{ format : 'jpg'}), cx -r, cy - r, 2 * r, 2 * r)
    c.restore()

    message.channel.send('',new MessageAttachment(a.toBuffer()))

})