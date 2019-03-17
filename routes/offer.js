const utils = require('../lib/utils')
const models = require('../models/index')

module.exports = function offerProducts () {
  return (req, res, next) => {
    models.sequelize.query('SELECT * FROM Products WHERE (deletedAt IS NULL AND on_offer = True) ORDER BY name')
      .then(([products]) => {
        res.json(utils.queryResultToJson(products))
      }).catch(error => {
        next(error)
      })
  }
}
