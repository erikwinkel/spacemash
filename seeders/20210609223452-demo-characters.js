'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('characters', [{
      name: "Luke Skywalker",
      rank: 0,
      image: "https://static.wikia.nocookie.net/starwars/images/d/d9/Luke-rotjpromo.jpg",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "Han Solo",
      rank: 0,
      image: "https://static.wikia.nocookie.net/starwars/images/0/01/Hansoloprofile.jpg",
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('characters', null, {})
  }
};
