/* eslint-disable complexity */

//import commands
const roll = require('../commands/roll')
const localPrefix = require('../commands/prefix')
const dictionary = require('../commands/dictionary')
const accessibilityWF = require('../commands/accessibility')
const {
  join,
  leave,
  play,
  pause,
  skip,
  add,
  clear,
  resume,
  queueCommand,
} = require('../commands/music')
const { rogueWave, rwLeaderboards } = require('../commands/wave')
const { reddit } = require('../commands/reddit')
const dog = require('../commands/dog')

// custom prefix
let customPrefix = '+'

module.exports = (client, msg) => {
  // This is the response for any message spot in this function.
  if (msg.author.bot) return
  if (
    msg.content.startsWith('@AnythingBot help') ||
    msg.content.startsWith('+help')
  ) {
    msg.reply(
      `Here are a list of my commands.\nMy default Prefix is +,\n${
        customPrefix != '+' ? `my custom prefix is ${customPrefix}\n` : ''
      }+roll - rolls dice (1d6 4d10 etc) \n+prefix - alters prefix \n+dict - Urban Dictionary lookup`
    )
    return
  }

  if (msg.content.startsWith(customPrefix) || msg.content.startsWith('+')) {
    const command = msg.content
      .split(' ')[0]
      .slice(msg.content.startsWith(customPrefix) ? customPrefix.length : 1)
    const args = msg.content.split(' ').slice(1)
    switch (command) {
      // prefix change tool
      case 'prefix':
        customPrefix = localPrefix(args, msg, customPrefix)
        break

      // roll dice in D&D fashion
      case 'roll':
        return roll(args, msg)

      // Urban dictionary word lookup
      case 'dict':
        return dictionary(args.join(' '), msg)

      // Rogue wave command
      case 'rogue-wave':
        return rogueWave(args, msg)
      case 'rw-leaderboard':
        return rwLeaderboards(args, msg)

      // reddit command
      case 'reddit':
        return reddit(args, msg)

      // doggo command
      case 'dog':
        return dog(args, msg)

      // Music player commands
      case 'join':
        return join(args, msg)
      case 'leave':
        return leave(args, msg)
      case 'play':
        return play(args, msg)
      case 'pause':
        return pause(msg)
      case 'skip':
        return skip(msg)
      case 'add':
        return add(args, msg)
      case 'clear':
        return clear(msg)
      case 'resume':
        return resume(msg)
      case 'queue':
        return queueCommand(msg)
      case 'a11y':
        return accessibilityWF(args, msg)
      default:
        msg.channel.send(
          'Command not recognized, refer to +help for a list of commands'
        )
    }
  }
}
