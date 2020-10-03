const mysql = require("mysql2");
const softDelete = require("./sqlQueries/softDelete");
const getDate = require("./helpers/getDate");
const config = require("./options/optins");
const { SET } = require("./options/SET");
const hardDelete = require("./sqlQueries/hardDelete");


function getConfig(options) {
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

  return `${optionsStatment.where ? optionsStatment.where : ''} 
${optionsStatment.order ? optionsStatment.order : ''} 
${optionsStatment.limit ? optionsStatment.limit : ''}`
}

function getAttributes(attributes) {
  return config.attributes(attributes)
}

class MySequelize {
  constructor(connect, tableName) {
    this.connection = connect;
    this.table = tableName;
  }
  async destroy(options) {
    if (options) {
      let id = options.where.id
      const conditions = Object.keys(options);


      if (conditions.includes("force") && options["force"] === true) {
        const query = hardDelete(id);
        const results = await this.connection.query(query);
        return results;
      } else {
        const date = getDate();
        console.log(`\"${date}\"`);
        const query = softDelete(`\"${date}\"`, id);
        const results = await this.connection.query(query);
        return results;
      }
    }
  }

  async restore(options) {

    let id = options ? options.where.id : null
    const query = softDelete(null, id);
    const results = await this.connection.query(query);
    console.log(`User ID: ${id} Has Been Resotred`);
    return results;
  }

  async findAll(options) {

    let results = await this.connection.query(`
    SELECT ${(options && options.attributes) ? getAttributes(options.attributes) : '*'} 
    FROM ${this.table} 
    ${getConfig(options)}`)

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

    const SET_Statment = SET(newDetsils)

    const newObjects = await this.connection.query(`UPDATE ${this.table} 
    ${SET_Statment}
    ${getConfig(options)}`)

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

    const results = await this.connection.query(`SELECT 
    ${(options && options.attributes) ? getAttributes(options.attributes) : '*'} 
    FROM ${this.table}
    ${getConfig(options)}
    LIMIT 1`)
    return results[0]
  }
}

module.exports = { MySequelize };


