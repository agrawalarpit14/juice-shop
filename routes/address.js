const models = require('../models/index')

module.exports.getAddress = function getAddress () {
  return (req, res, next) => {
    models.Address.findAll({ where: { UserId: req.body.UserId } }).then((addresses) => {
      res.status(200).json({ status: 'success', data: addresses })
    }).catch(error => {
      next(error)
    })
  }
}

module.exports.getAddressById = function getAddressById () {
  return (req, res, next) => {
    models.Address.findOne({ where: { id: req.params.id, UserId: req.body.UserId } }).then((address) => {
      if (address) {
        res.status(200).json({ status: 'success', data: address.dataValues })
      } else {
        res.status(400).json({ status: 'error', data: 'Malicious activity detected.' })
      }
    }).catch(error => {
      next(error)
    })
  }
}
