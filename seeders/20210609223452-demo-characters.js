'use strict';
const axios = require('axios')

async function swapiNames(){
    const names = []
    let swapi = {data: { next: 'https://swapi.dev/api/people' } }
    do {
        swapi = await axios.get(swapi.data.next)
        swapi.data.results.forEach(character => {
        names.push(character.name)
        })
    } while(swapi.data.next)
    return names
}

async function getNewCharacter(name){
  try {
      let newChar = { name: name }
      // find the correct wiki page
      const search = await axios.get(`https://starwars.fandom.com/api.php?action=query&list=search&format=json&srsearch=${name}`)
      const page = search.data.query.search[0].pageid
      // get the name of the correct image on the page
      const images = await axios.get(`https://starwars.fandom.com/api.php?action=parse&pageid=${page}&prop=images&format=json`)
      const imageName = images.data.parse.images[0]
      // get the url of the image
      const imageUrlSearch = await axios.get(`https://starwars.fandom.com/api.php?action=query&format=json&prop=imageinfo&iiprop=url&titles=File:${imageName}`)
      // do string stuff if necessary
      let url = ""
      for(let page in imageUrlSearch.data.query.pages){
          url = imageUrlSearch.data.query.pages[page].imageinfo[0].url
          break
      }
      const newUrl = url.split(imageName)[0] + imageName
      newChar.rank = Math.ceil(Math.random()*10)
      newChar.image = newUrl
      newChar.page = page
      newChar.createdAt = new Date()
      newChar.updatedAt = new Date()
      return newChar
  } catch(error){
      console.log(error)
  }
}


module.exports = {
  up: async (queryInterface, Sequelize) => {
    const newNames = await swapiNames()
    console.log("names: " + newNames.length)
    
    const seedArr = []
    for(let i = 0; i < newNames.length; i++){
      const newChar = await getNewCharacter(newNames[i])
      seedArr.push(newChar)
    }

    console.log('chars: ' + seedArr.length)
    return queryInterface.bulkInsert('characters', seedArr)
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('characters', null, {})
  }
};
