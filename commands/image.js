const Discord = require('discord.js')
const imagesMap = new Map()

// msg in format '+img name url' to add a pic to database, can add names and urls in pairs as many as you want
// msg in format '+img name' to recall img
// msg in format '+img random' to recall random img
// msg in format '+img list' to get a list of stored images
// msg in format '+img clear' to clear all stored images
// msg in format '+img remove name' to remove a specific entry

function getOrCreateImageBank(msg) {
  let images = imagesMap.get(msg.guild.id)
  if (!images) {
    return imagesMap.set(msg.guild.id, { clearCount: 0 }).get(msg.guild.id)
  }
  return images
}

function add(args, msg) {
  const images = getOrCreateImageBank(msg)
  if (Object.keys(images).length < 50) {
    for (let i = 0; i < args.length; i += 2) {
      images[args[i]] = {
        nick: args[i],
        url: args[i + 1],
        author: msg.author.username,
      }
    }
    msg.channel.send(`added ${args.length / 2} images to the image bank`)
  } else {
    msg.channel.send(
      'adding new image failed, list is too long, or your format was incorrect.'
    )
  }
}

function get(args, msg) {
  const images = getOrCreateImageBank(msg)
  const image = images[args[0]]
  if (image) {
    const embed = new Discord.MessageEmbed()
    embed
      .setImage(image.url)
      .setAuthor(image.author)
      .setTitle(image.nick)
    msg.channel.send(embed)
  } else {
    msg.channel.send(
      "that picture is not in the bank. Do command '+img list' for a list of all pictures available."
    )
  }
}

function addOrGet(args, msg) {
  if (args.length > 1) {
    add(args, msg)
  } else {
    get(args, msg)
  }
}

function random(args, msg) {
  const images = getOrCreateImageBank(msg)
  const list = Object.keys(images).filter(x => x != 'clearCount')
  const image = images[list[Math.floor(Math.random() * list.length)]]
  const embed = new Discord.MessageEmbed()
  embed
    .setImage(image.url)
    .setAuthor(image.author)
    .setTitle(image.nick)
  msg.channel.send(embed)
}

function list(msg) {
  const images = getOrCreateImageBank(msg)
  const list = Object.keys(images).filter(x => x != 'clearCount')
  const message = 'Available images : \n' + list.join('\n')
  msg.channel.send(message)
}

function clear(msg) {
  const images = imagesMap.get(msg.guild.id)
  if (!images) return msg.channel.send('no stored image bank to delete')
  images.clearCount += 1
  if (images.clearCount < 1) {
    return msg.channel.send(
      `Are you sure? Do +img clear ${2 -
        images.clearCount} more times to confirm`
    )
  }
  imagesMap.delete(msg.guild.id)
  msg.channel.send('Image Bank successfully cleared.')
}

function remove(args, msg) {
  const images = getOrCreateImageBank(msg)
  const image = images[args[1]]
  if (image) {
    delete images[args[0]]
    msg.channel.send(`image nicknamed ${args[1]} deleted.`)
  } else {
    msg.channel.send('No image by that nickname in the bank.')
  }
}

module.exports = (args, msg) => {
  try {
    switch (args[0]) {
      case 'random':
        return random(args, msg)
      case 'list':
        return list(msg)
      case 'clear':
        return clear(msg)
      case 'remove':
        return remove(args, msg)
      default:
        return addOrGet(args, msg)
    }
  } catch (err) {
    console.error(err)
  }
}
