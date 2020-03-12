const roll = require('../commands/roll')
const localPrefix = require('../commands/prefix')
const dictionary = require('../commands/dictionary')
const {join,leave,play,pause,skip,add,clear} = require('../commands/music')
let customPrefix = "+"

module.exports = (client,msg) => {
      // This is the response for any message spot in this function. We can split functionality by creating
      // sub files with sub functions.
      if(msg.author.bot) return
      if(msg.content.startsWith("@AnythingBot help") || msg.content.startsWith("+help")){
          msg.reply(`Here are a list of my commands. \n
          My default Prefix is +, \n
          ${customPrefix != "+" ? `my custom prefix is ${customPrefix}` : "\n"}
          +roll - rolls dice (1d6 4d10 etc) \n
          +prefix - alters prefix \n
          +dict - Urban Dictionary lookup`)
      }
      
      if(msg.content.startsWith(customPrefix) || msg.content.startsWith("+")){
        const command = msg.content.split(" ")[0]
                        .slice(msg.content.startsWith(customPrefix) ? 
                        customPrefix.length : 1)
        const args = msg.content.split(" ").slice(1)
        
        
        switch(command){
            
            // prefix change tool
            case "prefix":
                customPrefix = localPrefix(args,msg,customPrefix);
                break
            
            // roll dice in D&D fashion
            case "roll":
                roll(args,msg);
                break

            // Urban dictionary word lookup    
            case "dict":
                dictionary(args.join(" "),msg);
                break

            // Music player commands    
            case "join":
                return join(args,msg)
            case "leave":
                return leave(args,msg)
            case "play":
                return
            case "pause":
                return
            case "skip":
                return
            case "add":
                //add to queue
                return
            case "clear":
                // clear queue and stop music
                return
            default:
                msg.channel.send("Command not recognized, refer to +help for a list of commands")
            
        }
        

      }

    }