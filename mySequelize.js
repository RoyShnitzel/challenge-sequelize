const config = require('./options/optins')
const { SET } = require('./options/SET')

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
        if (condition === 'include') {
          return statment
        }
        statment[condition] = config[condition](options[condition])
        return statment
      }, {})

    }

    let results = await this.connection.query(`
    SELECT ${optionsStatment.attributes ? optionsStatment.attributes : '*'} 
    FROM ${this.table} 
    ${optionsStatment.where ? optionsStatment.where : ''} 
    ${optionsStatment.order ? optionsStatment.order : ''} 
    ${optionsStatment.limit ? optionsStatment.limit : ''}`)

    results = results[0]

    if (options && options.include) {
      return await config.include(results, options.include, this.connection)
    } else {
      return results
    }
  }



  async update(newDetsils, options) {

    if (!newDetsils) {
      throw 'Must sumbit colums and values to update'
    }
    if (!options.where) {
      throw `Must sumbit at list one 'where' conditon in the options object`
    }

    const conditions = Object.keys(options)
    const optionsStatment = conditions.reduce((statment, condition) => {
      statment[condition] = config[condition](options[condition])
      return statment
    }, {})

    const SET_Statment = SET(newDetsils)

    const newObjects = await this.connection.query(`UPDATE ${this.table} 
    ${SET_Statment}
    ${optionsStatment.where}
    ${optionsStatment.order ? optionsStatment.order : ''}
    ${optionsStatment.limit ? optionsStatment.limit : ''}`)

    return newObjects
  }
}


module.exports = { MySequelize };


