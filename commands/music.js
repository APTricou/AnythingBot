const ytdl = require('ytdl-core')

// This file contains all of the functions for music control.
const queueMap = new Map()
let voiceChannel = null

async function join(args, msg) {
  if (args && args.length) {
    // take args and compare to available voice channels in this guild
    const channel = msg.guild.channels.cache.find(
      vc => vc.name === args[0] && vc.type === 'voice'
    )
    // if matching - join that channel and return
    if (channel) {
      voiceChannel = channel
      await channel.join()
      return
    }
    // else do the rest of the function
  }
  // get user and subsequent channel who asked for join
  voiceChannel = msg.member.voice.channel
  // connect to the correct channel
  if (!voiceChannel) {
    msg.reply('you need to be in a voice channel or specify a channel')
    return
  }
  return voiceChannel.join()
}

function leave(args, msg) {
  msg.guild
  voiceChannel.leave()
  voiceChannel = null
}

async function play(args, msg) {
  let connection
  try {
    connection = await join([], msg)
  } catch (err) {
    console.error(err)
    msg.channel.send('Failed to connect to your channel')
  }
  try {
    const songInfo = await ytdl.getInfo(args[0])
    const song = {
      title: songInfo.title,
      url: songInfo.video_url,
    }
    const queue = queueMap.get(msg.guild.id)
    if (!queue) {
      // create Queue
      const queueObject = {
        textChannel: msg.channel,
        voiceChannel: voiceChannel,
        connection: connection,
        dispatcher: null,
        songs: [song],
        volume: 10,
        playing: true,
      }

      queueMap.set(msg.guild.id, queueObject)

      playSong(msg.guild.id, queueObject.songs[0])
      console.error(err)
      queueMap.delete(msg.guild.id)
      return msg.channel.send(err)
    } else {
      queue.dispatcher.end()
      queue.songs.unshift(song)
      playSong(msg.guild.id, song)
    }
  } catch (error) {
    console.error(error)
    msg.channel.send(error)
  }
}

function playSong(guildId, song) {
  // song is object with title, url keys
  // guildId is the key to the queueMap that returns our construct
  const queue = queueMap.get(guildId)

  if (!song) {
    queue.voiceChannel.leave()
    voiceChannel = null
    queueMap.delete(guildId)
    return
  }

  const dispatcher = queue.connection
    .play(ytdl(song.url, { filter: 'audioonly', quality: 'highest' }))
    .on('end', () => {
      queue.songs.shift()
      playSong(guildId, queue.songs[0])
    })
    .on('error', error => {
      console.log(error)
      queue.textChannel.send('error during playback, skipping song')
      skip(msg)
    })
  dispatcher.setVolumeLogarithmic(queue.volume / 5)
  queue.dispatcher = dispatcher
}

function pause(msg) {
  queue = queueMap.get(msg.guild.id)
  if (!queue) return msg.channel.send('No songs in the queue')
  queue.dispatcher.pause()
}

function resume(msg) {
  queue = queueMap.get(msg.guild.id)
  if (!queue) return msg.channel.send('No songs in the queue')
  queue.dispatcher.resume()
}

async function add(args, msg) {
  queue = queueMap.get(msg.guild.id)
  if (!queue) return play(args, msg)
  const songInfo = await ytdl.getInfo(args[0])
  const song = {
    title: songInfo.title,
    url: songInfo.video_url,
  }
  queue.songs.push(song)
  queue.textChannel.send(`added ${song.title} to the queue`)
}

function skip(msg) {
  // check if users are in a voice channel
  if (!msg.member.voice.channelID)
    return msg.channel.send(
      'You must be in a voice channel to use music bot commands'
    )
  // check if there are songs in the queue
  const queue = queueMap.get(msg.member.guild.id)
  if (!queue) return msg.channel.send('no songs in the queue')
  // end current song
  msg.channel.send(`Skipping ${queue.songs[0].title}`)
  queue.connection.dispatcher.end()
}

function clear(msg) {
  const queue = queueMap.get(msg.guild.id)
  queue.songs = []
  queue.dispatcher.end()
  queueMap.delete(msg.guild.id)
  msg.channel.send('The queue has been cleared.')
}

function queueCommand(msg) {
  const queue = queueMap.get(msg.guild.id)
  console.log(queue.songs)
  return queue.songs.length > 0
    ? msg.channel.send(
        'songs: \n' +
          queue.songs.map((song, i) => `${i + 1}. ${song.title}`).join('\n')
      )
    : msg.channel.send('There are no songs in the queue')
}

module.exports = {
  join,
  leave,
  play,
  pause,
  add,
  skip,
  clear,
  resume,
  queueCommand,
}
