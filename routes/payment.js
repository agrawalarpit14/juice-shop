const models = require('../models/index')

module.exports.getPaymentMethods = function getPaymentMethods () {
  return (req, res, next) => {
    models.Card.findAll({ where: { UserId: req.body.UserId } }).then((cards) => {
      res.status(200).json({ status: 'success', data: cards })
    }).catch(error => {
      next(error)
    })
  }
}

module.exports.getPaymentMethodsById = function getPaymentMethodsById () {
  return (req, res, next) => {
    models.Card.findOne({ where: { id: req.params.id, UserId: req.body.UserId } }).then((card) => {
      if (card) {
        res.status(200).json({ status: 'success', data: card })
      } else {
        res.status(400).json({ status: 'error', data: 'Malicious activity detected' })
      }
    }).catch(error => {
      next(error)
    })
  }
}
