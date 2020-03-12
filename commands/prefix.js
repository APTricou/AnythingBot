module.exports = (args,msg,customPrefix) => {
    
    // prefix altering command. returns the new prefix or false if not a valid command.
    // if no args provided, returns a string showing all valid prefixes

    if(args.length===0){
        msg.channel.send(`Current prefixes for this bot include + (the default) ${customPrefix === "+" ? "" : `and ${customPrefix}`}`)
        return customPrefix
    }
    else if(args.length>1){
        msg.channel.send("To use the prefix command, supply a character or set of characters after the command. **No spaces allowed**.")
        return false
    }
    else{
        msg.reply(`New prefix set **(${args[0]})**`)
        return args[0]
    }
}