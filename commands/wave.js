const Discord = require('discord.js')
const callTracking = {}

const rogueWave = (args, msg) => {
  callTracking[msg.author.id] = {
    called: callTracking[msg.author.id]
      ? callTracking[msg.author.id].called + 1
      : 1,
    username: msg.author.username,
    summoned: callTracking[msg.author.id]
      ? callTracking[msg.author.id].summoned
      : 0,
  }

  const calm = new Discord.MessageEmbed()
    .setTitle(
      `${msg.author.username} has attempted to summon the almighty rogue wave ${
        callTracking[msg.author.id].called
      } times!`
    )
    .setImage('https://i.ytimg.com/vi/Cf-JYWyvUOk/maxresdefault.jpg')

  const notCalm = new Discord.MessageEmbed()
    .setImage(
      'https://todayinhistorydotblog.files.wordpress.com/2018/01/rogue-wave-final.jpg'
    )
    .setTitle(
      `Great, ${
        msg.author.username
      } has doomed us all this time, and it only took them ${
        callTracking[msg.author.id].called
      } times! to do it. I hope you're happy.`
    )

  const chance = Math.floor(Math.random() * Math.floor(5)) + 1
  //rogue wave appears
  if (chance === 1 || args[0] === '~') {
    msg.channel.send(notCalm)
    callTracking[msg.author.id].summoned += 1
    console.log(callTracking[msg.author.id].summoned)
    callTracking[msg.author.id].called = 0
    //calm ocean
  } else {
    msg.channel.send(calm)
  }
}

const rwLeaderboards = (args, msg) => {
  msg.channel.send(
    Object.keys(callTracking)
      .sort((a, b) => {
        if (a.called > b.called) {
          return 1
        }
        if (a.value < b.value) {
          return -1
        }
        return 0
      })
      .map((user, idx) => {
        return `${idx + 1}: ${callTracking[user].username} - ${
          callTracking[user].summoned
        }`
      })
  )
}

module.exports = {
  rwLeaderboards,
  rogueWave,
}