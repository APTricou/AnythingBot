const axios = require('axios')
const Discord = require('discord.js')

const reddit = async (sub, msg) => {
  try {
    const res = await axios.get(`http://api.reddit.com/r/${sub[0]}/top`)
    const post = res.data.data.children[0].data
    console.log(post.domain)
    const embed = new Discord.MessageEmbed()
      .setTitle(post.title)
      .setImage(post.url)
      .setURL(`http://reddit.com${post.permalink}`)
      .setAuthor(
        post.author,
        'https://www.pinclipart.com/picdir/big/8-82428_profile-clipart-generic-user-gender-neutral-head-icon.png',
        `https://www.reddit.com/user/${post.author}/`
      )
      .setDescription(post.selftext)
      .setFooter(`Top post of r/${sub[0]} today`)
      .addField('Upvotes', post.ups, true)
    const videoDomains = ['gfycat.com', 'v.redd.it', 'youtube.com']

    if (videoDomains.includes(post.domain)) {
      await msg.channel.send(post.url)
      embed.setImage(null)
      return msg.channel.send(embed)
    }
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
        time: 10000,
      })

      collector.on('collect', m => {
        caution.edit('', embed)
      })
    }
  } catch (err) {
    console.error(err)
    msg.channel.send(
      `Sorry, it appears that ${sub[0]} is not a valid subreddit.`
    )
  }
}

module.exports = {
  reddit,
}
