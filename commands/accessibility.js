const axios = require('axios')

module.exports = async (args, msg) => {
  try {
    const strings = await Promise.all(args.map(x => findNumeronyms(x)))
    return msg.channel.send(strings.join('\n\n'))
  } catch (err) {
    msg.channel.send(err)
    console.error(err)
  }
}

async function findNumeronyms(numer, msg) {
  if (!/\w\d+\w/i.test(numer)) {
    return msg.channel.send(
      "That ain't right. Your numeronym has to be in the form of {letter} {number} {letter}"
    )
  }
  const offset = 0
  const limit = 16000
  const letter = numer[0]
  const lastLetter = numer.slice(-1)
  const length = numer.slice(1, -1)
  const re = new RegExp(`^${letter}\\w{${length}}${lastLetter}$`, 'i')

  try {
    const {
      data: { data },
    } = await axios.get(
      `https://api-portal.dictionary.com/dcom/list/${letter}?offset=${offset}&limit=${limit}`
    )
    const res = data
      .filter(({ displayForm }) => re.test(displayForm))
      .map(({ displayForm }) => displayForm)
      .join(', ')
    if (res.length === 0) {
      return 'There are no numeronyms that match that string'
    } else {
      return `Numeronyms matching **${numer}** are : \n` + res
    }
  } catch (err) {
    msg.channel.send(err)
    console.err
  }
}
