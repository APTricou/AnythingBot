const roll = require('../commands/roll')

module.exports = (client,msg) => {
      // This is the response for any message spot in this function. We can split functionality by creating
      // sub files with sub functions.
      if (msg.content.startsWith("+roll")) {
          roll(msg)
      }
    }