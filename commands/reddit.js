const axios = require('axios')
const Discord = require('discord.js')

const reddit = (sub, msg) => {
  axios
    .get(`http://api.reddit.com/r/${sub[0]}/top`)
    .then(async res => {
      const post = res.data.data.children[0].data

      const embed = new Discord.MessageEmbed()
        .setTitle(post.title)
        .setImage(post.url)
        .setURL(`http://reddit.com${post.permalink}`)

      if (!post.over_18) {
        msg.channel.send(embed)
      } else {
        const filter = m => {
          return m.author.id === msg.author.id && m.content.includes('ok')
        }

        let caution = await msg.channel.send(
          'This link is nsfw, type OK to proceed.'
        )
        const collector = msg.channel.createMessageCollector(filter, {
          time: 15000,
        })

        collector.on('collect', m => {
          caution.edit('', embed)
        })
      }
    })
    .catch(error => {
      console.error(error)
      msg.reply(`Sorry, it appears that ${sub[0]} is not a valid subreddit.`)
    })
}

module.exports = {
  reddit,
}
