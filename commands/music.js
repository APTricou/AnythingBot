const ytdl = require('ytdl-core')

// This file contains all of the functions for music control.

// this map contains all of the unique guild queues information
const queueMap = new Map()
let voiceChannel = null

/**************
 HELPER FUNCTIONS
 ***************/
function createQueue(msg, voiceChannel, connection, songs) {
  const queueObject = {
    textChannel: msg.channel,
    voiceChannel: voiceChannel,
    connection: connection,
    dispatcher: null,
    songs: songs,
    volume: 10,
  }
  queueMap.set(msg.guildId)
  return queueObject
}

async function join(args, msg) {
  // Option to specify which channel to join
  if (args && args.length) {
    const channel = msg.guild.channels.cache.find(
      vc => vc.name === args[0] && vc.type === 'voice'
    )
    if (channel) {
      return channel.join()
    }
  }
  if (!msg.member.voice.channel) {
    msg.reply('you need to be in a voice channel or specify a channel')
    return
  }
  return msg.member.voice.channel.join()
}

function leave(args, msg) {
  queue = queueMap.get(msg.guild.id)
  queue.dispatcher.end()
  queue.voiceChannel.leave()
  queueMap.delete(msg.guild.id)
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
      const queueObject = createQueue(
        msg,
        msg.member.voice.channel,
        connection,
        [song]
      )
      playSong(guildId, queueObject.songs[0])
    } else {
      // this bot takes the new song and places it at the beginning of the queue
      queue.dispatcher.end()
      queue.songs.unshift(song)
      playSong(guildId, song)
    }
  } catch (error) {
    console.error(error)
    msg.channel.send(error)
  }
}

function playSong(guildId, song) {
  const queue = queueMap.get(guildId)
  if (!song) {
    queue.voiceChannel.leave()
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
      skip(null, guildId)
    })
  dispatcher.setVolumeLogarithmic(queue.volume / 5)
  queue.dispatcher = dispatcher
}

function pause(msg) {
  queue = queueMap.get(msg.guild.id)
  if (queue && queue.dispatcher) return queue.dispatcher.pause()
  else return msg.channel.send('No song playing')
}

function resume(msg) {
  queue = queueMap.get(msg.guild.id)
  if (queue && queue.dispatcher) return queue.dispatcher.resume()
  else return msg.channel.send('No song playing')
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

function skip(msg, guildId = null) {
  const guildId = guildId || msg.guild.id
  const queue = queueMap.get(guildId)
  if (!queue) return msg.channel.send('no songs in the queue')
  // end current song
  queue.textChannel.send(`Skipping ${queue.songs[0].title}`)
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
  if (!queue) return msg.channel.send('There are no songs in the queue')
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
