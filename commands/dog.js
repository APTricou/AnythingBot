const axios = require('axios')
const Discord = require('discord.js')

module.exports = async (args, msg) => {
  const embed = new Discord.MessageEmbed()
  embed.setFooter('Brought to you by the DogCEO').setURL('https://dog.ceo')
  if (args.length > 0) {
    try {
      const { data } = await axios.get(
        `https://dog.ceo/api/breed/${args[0]}/images/random`
      )
      embed.setImage(data.message).setTitle(`One beautiful ${args[0]}`)
      msg.channel.send(embed)
    } catch (error) {
      msg.channel.send(
        'error in getting a picture. Make sure your format is +dog {breed}'
      )
    }
  } else {
    try {
      const { data } = await axios.get(
        'https://dog.ceo/api/breeds/image/random'
      )
      embed.setImage(data.message).setTitle(`One beautiful doggo`)
      msg.channel.send(embed)
    } catch (error) {
      msg.channel.send('error in getting a pic. Try again in a minute.')
    }
  }
}
