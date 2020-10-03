const softDelete = require('./sqlQueries/softDelete');
const getDate = require("./helpers/getDate");
const config = require('./options/optins')
const { SET } = require('./options/SET')


class MySequelize {
  constructor(connect, tableName) {
    this.connection = connect;
    this.table = tableName;
  }

  async destroy(id) {
    const date = getDate()
    const query = softDelete(`\"${date}\"`, id)
    const results = await this.connection.query(query);

    return results
  }

  async restore(id) {
    const query = softDelete(null, id)
    const results = await this.connection.query(query);
    return results
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

    if (options && options.include) {
      return await config.include(results[0], options.include, this.connection)
    } else {
      return results[0]
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
      if (condition === 'include') {
        return statment
      }
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

  async create(obj) {

    let columns = [];
    let values = [];
    for (const [key, value] of Object.entries(obj)) {
      columns.push(key);
      if (typeof (value) === 'boolean') {
        values.push(value)
      } else {
        values.push(`\'${value}\'`);
      }

    }
    columns = `(${columns.toString()})`;
    values = `(${values.toString()})`;
    const result = await this.connection.query(
      `INSERT INTO ${this.table} ${columns} VALUES ${values}`
    );
  }

  async bulkCreate(arr) {
    let columns = Object.keys(arr[0]);
    let values = arr.map((obj) => {
      let arrOfValues = Object.values(obj);
      return `(${arrOfValues.map((value) => typeof (value) === 'boolean' ? value : `\'${value}\'`).toString()})`;
    });
    columns = `(${columns.toString()})`;
    values = `${values.toString()}`;
    const result = await this.connection.query(
      `INSERT INTO ${this.table} ${columns} VALUES ${values}`
    );
  }

  async findByPk(id) {
    const results = await this.connection.query(`SELECT * FROM ${this.table} WHERE id = ${id}`);
    return results[0]
  }

  async findOne(options) {
    let optionsStatment = {};

    if (options) {
      const conditions = Object.keys(options)
      optionsStatment = conditions.reduce((statment, condition) => {
        statment[condition] = config[condition](options[condition])
        return statment
      }, {})

    }

    const results = await this.connection.query(`SELECT 
    ${optionsStatment.attributes ? optionsStatment.attributes : '*'} 
    FROM ${this.table}
    ${optionsStatment.where ? optionsStatment.where : ''} 
    ${optionsStatment.order ? optionsStatment.order : ''} 
    ${optionsStatment.limit ? optionsStatment.limit : ''}
    LIMIT 1`)
    return results[0]
  }
}


module.exports = { MySequelize };


