const axios = require('axios')
module.exports = (word, msg) => {
    axios.get(`http://api.urbandictionary.com/v0/define?term=${word}`)
    .then(res=>{
        console.log(res.data)
        const message = res.data.list
        .slice(0,3) // limit because discord message limit is 2000 characters
        .map(entry=>`${entry.word.trim()} - 
                    ${entry.definition.replace(/[\[\]\n]/g,'').trim()}\n
                    ${entry.example.replace(/[\[\]]/g,'').trim()}\n
                    ${entry.author.trim()}\n`).join("")
        msg.reply(message)
    })
    .catch(error=>{
        console.error(error)
    })
}