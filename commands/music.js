const ytdl = require("ytdl-core")


// This file contains all of the functions for music control.
const queueMap = new Map()
let voiceChannel = null

function join(args,msg){
    if(args.length){
        // take args and compare to available voice channels in this guild
        // if matching - join that channel and return
        // else do the rest of the function
        return
    }
    // get user who asked for join
    voiceChannel = msg.member.voice.channel
    // connect to the correct channel
    console.log(voiceChannel)
    voiceChannel.join()
}

function leave(args,msg){
    voiceChannel.leave()
    voiceChannel = null
}

function play(){}

function pause(){}

function add(){}

function skip(){}

function clear(){}


module.exports = {join,leave,play,pause,add,skip,clear}