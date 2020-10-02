const config = require('./options/optins')

class MySequelize {
  constructor(connect, tableName) {
    this.connection = connect;
    this.table = tableName;
  }


  async findAll(options) {
    let optionsStatment = {}

    if (options) {

      const conditions = Object.keys(options)

      optionsStatment = conditions.reduce((statment, condition) => {
        statment[condition] = config[condition](options[condition])
        return statment
      }, {})

    }

    const results = await this.connection.query(`
    SELECT ${optionsStatment.attributes ? optionsStatment.attributes : '*'} 
    FROM ${this.table} 
    ${optionsStatment.include ? optionsStatment.include : ''}
    ${optionsStatment.where ? optionsStatment.where : ''} 
    ${optionsStatment.order ? optionsStatment.order : ''} 
    ${optionsStatment.limit ? optionsStatment.limit : ''}`)

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
    console.log(`UPDATE ${this.table} ${SET_Statment} ${WHERE_Statment}`)
    const newObjects = await this.connection.query(`UPDATE ${this.table} ${SET_Statment} ${WHERE_Statment}`)

    // console.log(newObjects)

    return newObjects
  }
}


module.exports = { MySequelize };


