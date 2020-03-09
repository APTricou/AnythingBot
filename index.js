const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!')
  }
})

client.login('Njg2NjczOTcxMTQ3NDQwMjEx.Xmargw.5v9meQN9m-IkYdXWJJgG6XM5oGQ')