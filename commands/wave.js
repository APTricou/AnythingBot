const callTracking = {}
const Discord = require('discord.js')

const rogueWave = (args, msg) => {
  let callTracker = callTracking[msg.author.id]

  if (!callTracker) {
    callTracking[msg.author.id] = {
      called: 0,
      username: msg.author.username,
      summoned: 0,
    }
    callTracker = callTracking[msg.author.id]
  }

  const embed = new Discord.MessageEmbed()

  // true or false value
  const summon = Math.ceil(5 * Math.random()) === 5

  if (args[0] === '~' || summon) {
    ++callTracker.summoned
    embed
      .setImage(
        'https://todayinhistorydotblog.files.wordpress.com/2018/01/rogue-wave-final.jpg'
      )
      .setTitle(
        `Great, ${
          msg.author.username
        } has doomed us all this time, and it only took them ${callTracker.called +
          1} times! to do it. I hope you're happy.`
      )
    callTracker.called = 0
  } else {
    ++callTracker.called
    embed
      .setTitle(
        `${msg.author.username} has attempted to summon the almighty rogue wave ${callTracker.called} times!`
      )
      .setImage('https://i.ytimg.com/vi/Cf-JYWyvUOk/maxresdefault.jpg')
  }
  msg.channel.send(embed)
}

const rwLeaderboards = (args, msg) => {
  const leaderboard = Object.keys(callTracking)
    .sort((a, b) => a.called > b.called)
    .map(
      (u, i) =>
        `${i + 1}: ${callTracking[u].username} - ${callTracking[u].summoned}`
    )
  msg.channel.send(leaderboard)
}

module.exports = {
  rwLeaderboards,
  rogueWave,
}
