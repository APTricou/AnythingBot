const axios = require('axios')
module.exports = (word, msg) => {
  axios
    .get(`http://api.urbandictionary.com/v0/define?term=${word}`)
    .then(res => {
      const message =
        '\n Here are the top three results from Urban Dictionary' +
        res.data.list
          .slice(0, 3) // limit because discord message limit is 2000 characters
          .map(
            entry =>
              `\`\`\`${entry.word.trim()} - ${entry.definition
                .replace(/[\[\]\n]/g, '')
                .trim()}\n${entry.example
                .replace(/[\[\]]/g, '')
                .trim()}\n${entry.author.trim()}\`\`\``
          )
          .join('')
      msg.channel.send(message)
    })
    .catch(error => {
      console.error(error)
    })
}
