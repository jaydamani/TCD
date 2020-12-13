const message = require('../../Events/xp/message')
const baseCommand = require('../../registry/structures/baseCommand')
const { loadImage, createCanvas} = require('canvas')
const { MessageAttachment } = require('discord.js')
module.exports = new baseCommand('xp',[],async (cmd,argz,message) => {

    const a = createCanvas(767,192)
    console.log('a')
    //let b = await loadImage('/home/jay/Media/wallpaper.jpg')
    const c = a.getContext("2d")
    c.fillStyle = '#FFFFFF'
    await c.fillRect(0,0,767,192)
    c.fillStyle = 'rgba(0,0,256,1)'
    c.font = '30px Impact'
    await c.fillText('test jghjg',100,100)
    c.strokeStyle = '#000000'
    await c.stroke()
    await c.strokeRect(100,150,500,10)

    message.channel.send('',new MessageAttachment(a.toBuffer()))

})