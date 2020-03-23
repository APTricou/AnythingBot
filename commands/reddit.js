const axios = require('axios')
const Discord = require('discord.js')

const reddit = (sub, msg) => {
  axios
    .get(`http://api.reddit.com/r/${sub[0]}/top`)
    .then(res => {
      console.log(res.data.data.children[0].data)
      const post = res.data.data.children[0].data
      msg.channel.send(
        new Discord.MessageEmbed()
          .setTitle(post.title)
          .setImage(post.url)
          .setURL(`http://reddit.com${post.permalink}`)
      )
    })
    .catch(error => {
      console.error(error)
      msg.reply(`Sorry, it appears that ${sub[0]} is not a valid subreddit.`)
    })
}

module.exports = {
  reddit,
}
