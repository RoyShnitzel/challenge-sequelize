const mysql = require("mysql2");
const softDelete = require('./sqlQueries/softDelete');
const getDate = require("./helpers/getDate");
const config = require('./options/optins')
const { SET } = require('./options/SET')


class MySequelize {
  constructor(connect, tableName) {
    this.connection = connect;
    this.table = tableName;
  }

  async delete(id) {
    console.log("Delete Function Started");
    const query = softDelete(getDate(), id)
    const results = await this.connection.query(query);
    console.log(`${id} Has Been Soft Deleted`)
    return results
  }
 
  async restore(id) {
    console.log("Restore Function Started");
    const query = softDelete(null, id)
    const results = await this.connection.query(query);
    console.log(`User ID: ${id} Has Been Resotred`)
    return results
  }
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
  
  async create(obj) {
    console.log("started create");
    let columns = [];
    let values = [];
    for (const [key, value] of Object.entries(obj)) {
      columns.push(key);
      values.push(`\'${value}\'`);
    }
    columns = `(${columns.toString()})`;
    values = `(${values.toString()})`;
    const result = await this.connection.query(
      `INSERT INTO ${this.table} ${columns} VALUES ${values}`
    );
  }

  async bulkCreate(arr) {
    console.log("started create");
    let columns = Object.keys(arr[0]);
    let values = arr.map((obj) => {
      let arrOfValues = Object.values(obj);
      return `(${arrOfValues.map((value) => `\'${value}\'`).toString()})`;
    });

    columns = `(${columns.toString()})`;
    values = `${values.toString()}`;
    console.log(columns);
    console.log(values);
    const result = await this.connection.query(
      `INSERT INTO ${this.table} ${columns} VALUES ${values}`
    );
  }
}


module.exports = { MySequelize };
