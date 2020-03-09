const Discord = require('discord.js')
const client = new Discord.Client()
require('dotenv').config()
const fs = require('fs')

// This file references the files in the events folder. no changes should be made here.
//

fs.readdir('./events/', (err, files) => {
    files.forEach(file => {
      const eventHandler = require(`./events/${file}`)
      const eventName = file.split('.')[0]
      client.on(eventName, (...args) => eventHandler(client, ...args))
    })
  })


client.login(process.env.BOT_TOKEN)