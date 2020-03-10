const roll = require('../commands/roll')
const localPrefix = require('../commands/prefix')
const dictionary = require('../commands/dictionary')
let customPrefix = "+"

module.exports = (client,msg) => {
      // This is the response for any message spot in this function. We can split functionality by creating
      // sub files with sub functions.

      if(msg.content.startsWith("@AnythingBot help") || msg.content.startsWith("+help")){
          msg.reply(`Here are a list of my commands. /n
                    My default Prefix is +, /n
                    ${customPrefix === "+" ? `my custom prefix is ${customPrefix}` : "/n"}
                    +roll - rolls dice (1d6 4d10 etc) /n
                    +prefix - alters prefix /n
                    `)
      }
      
      if(msg.content.startsWith(customPrefix) || msg.content.startsWith("+")){
        const command = msg.content.split(" ")[0]
                        .slice(msg.content.startsWith(customPrefix) ? 
                        customPrefix.length : 1)
        const args = msg.content.split(" ").slice(1)
        // prefix  change tool
        if(command ==="prefix") {
            customPrefix = localPrefix(args,msg,customPrefix)
        }
        // roll dice in D&D fashion
        if(command==="roll") {
            roll(args,msg)
        }
        // Urban dictionary lookup
        if(command==="dict") {
            dictionary(args.join(" "),msg)
        }

      }

    }