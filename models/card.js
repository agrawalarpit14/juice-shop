/* jslint node: true */
module.exports = (sequelize, { STRING, INTEGER }) => {
  const Card = sequelize.define('Card', {
    fullName: STRING,
    cardNum: {
      type: INTEGER,
      validate: {
        isInt: true,
        min: 0,
        max: 9999999999999999
      }
    },
    expMonth: {
      type: INTEGER,
      validate: {
        isInt: true,
        min: 1,
        max: 12
      }
    },
    expYear: {
      type: INTEGER,
      validate: {
        isInt: true,
        min: new Date().getFullYear(),
        max: 9999
      }
    },
    cvv: {
      type: INTEGER,
      validate: {
        isInt: true,
        min: 0,
        max: 999
      }
    }
  })

  Card.associate = ({ User }) => {
    Card.belongsTo(User, { constraints: true, foreignKeyConstraint: true })
  }

  return Card
}
