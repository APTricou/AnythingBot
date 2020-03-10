module.exports = (args,msg) => {
    
    // split the individual dice rolls up from the command. accepts command +roll 1d6 4d5
    // runs under premise that dice start at 1 and end at target number
    
    // initializes total
    let total = 0

    if(args.length===0){
        msg.reply("roll command should follow the format +roll 1d6 or +roll (x)d(y) up to 100d100")
        return
    }

    //loops over each dice roll
    for(let i=0;i<args.length;i++){
        
        //
        const nums = args[i].split("d").map(x=>{
            if(x === '') return 1
            else return parseInt(x)
        })
        if(nums.length<2 
            || nums[0]>100 
            || nums[1]>100
            || typeof(nums[0])!='number'
            || typeof(nums[1])!='number'
            ){msg.reply("Format for this command should be 1d6 or (x)d(y) up to 100d100")}
        else{
            for(let j=0;j<nums[0];j++){
            total += Math.ceil(Math.random()*nums[1])
            }
        }

    }
    msg.reply(`You rolled a ${total}`)
  }