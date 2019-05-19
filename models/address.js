/* jslint node: true */
module.exports = (sequelize, { STRING, INTEGER }) => {
  const Address = sequelize.define('Address', {
    country: STRING,
    fullName: STRING,
    mobileNum: INTEGER,
    pinCode: INTEGER,
    streetAddress: STRING,
    city: STRING,
    state: STRING
  })

  Address.associate = ({ User }) => {
    Address.belongsTo(User, { constraints: true, foreignKeyConstraint: true })
  }

  return Address
}
