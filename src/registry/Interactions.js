module.exports = client => 
client.api.interactions(interaction.id, interaction.token).callback.post(interaction => {

    const respond = client.api.interactions(interaction.id, interaction.token).callback.post

    if(interaction.type == 1) return reply({ "type" : "pong" })

    const newInteraction = { ...interaction, client, respond }
    newInteraction.guild = client.guilds.cache.get(interaction.guild_id),
    newInteraction.channel = client.guild.cache.get(interaction.channel_id)
    client.emit('interaction',newInteraction)

})