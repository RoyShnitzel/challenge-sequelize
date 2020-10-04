const { getDate, getConfig, getAttributes } = require("./helpers/helpers");
const config = require("./options/options");
const { SET } = require("./options/SET");





class MySequelize {
  constructor(connect, tableName) {
    this.connection = connect;
    this.table = tableName;
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

    return result[0]
  }

  async bulkCreate(arr) {
    let columns = Object.keys(arr[0]);
    let values = arr.map((obj) => {
      let arrOfValues = Object.values(obj);
      return `(${arrOfValues.map((value) => typeof (value) === 'boolean' ? value : `\'${value}\'`).toString()})`;
    });
    columns = `(${columns.toString()})`;
    values = `${values.toString()}`;
    console.log(values)
    const result = await this.connection.query(
      `INSERT INTO ${this.table} ${columns} VALUES ${values}`
    );
  }

  async findAll(options) {


    let query = `SELECT ${(options && options.attributes) ? getAttributes(options.attributes) : '*'} 
    FROM ${this.table} 
    ${getConfig(options)}`;

    query = query.toString()

    let results = await this.connection.query(query)

    if (options && options.include) {
      return await config.include(results[0], options.include, this.connection)
    } else {
      return results[0]
    }
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

  async destroy({ force, ...options }) {

    if (options) {

      if (force) {
        const query = `DELETE FROM ${this.table} ${getConfig(options)}`
        const results = await this.connection.query(query);
        return results;
      } else {
        const date = getDate()
        const query = `UPDATE users SET deleted_at=${`\"${date}\"`} ${getConfig(options)}`
        const results = await this.connection.query(query);
        return results;
      }
    }
  }

  async restore(options) {

    const query = `UPDATE ${this.table} SET deleted_at= null ${getConfig(options)}`;
    const results = await this.connection.query(query);
    return results;
  }
}


module.exports = { MySequelize };

