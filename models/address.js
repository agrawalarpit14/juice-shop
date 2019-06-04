/* jslint node: true */
module.exports = (sequelize, { STRING, INTEGER }) => {
  const Address = sequelize.define('Address', {
    fullName: STRING,
    mobileNum: INTEGER,
    pinCode: STRING,
    streetAddress: STRING,
    city: STRING,
    state: STRING,
    country: STRING
  })

  Address.associate = ({ User }) => {
    Address.belongsTo(User, { constraints: true, foreignKeyConstraint: true })
  }

  return Address
}
