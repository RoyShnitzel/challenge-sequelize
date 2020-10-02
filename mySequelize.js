const { SET } = require('./options/SET');
const { WHERE } = require('./options/WHERE');

class MySequelize {
  constructor(connect, tableName) {
    this.connection = connect;
    this.table = tableName;
  }


  async findAll() {
    const results = await this.connection.query(`SELECT * FROM ${this.table}`)
    return results[0]
  }



  async update(newDetsils, { where, ...restOptions }) {
    if (!newDetsils) {
      throw 'Must sumbit colums and values to update'
    }
    if (!where) {
      throw `Must sumbit at list one 'where' conditon in the options object`
    }

    const SET_Statment = SET(newDetsils)
    const WHERE_Statment = WHERE(where)

    const restStatments = '';

    if (restOptions.order) {
      //oder option
    }
    if (restOptions.limit) {
      //limit optins
    }

    // console.log(SET_Statment, WHERE_Statment)

    const newObjects = await this.connection.query(`UPDATE ${this.table} SET ${SET_Statment} WHERE ${WHERE_Statment}`)

    // console.log(newObjects)

    return newObjects
  }
}


module.exports = { MySequelize };


