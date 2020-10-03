const mysql = require("mysql2");
const softDelete = require('./sqlQueries/softDelete');
const getDate = require("./helpers/getDate");

let mysqlCon = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Injector1337",
  database: "challenge_sequelize",
  multipleStatements: true,
});

mysqlCon.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
});

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
  // async restore(id) {
  //   console.log("Restore Function Started");
  //   const results = await this.connection.query(`UPDATE ${this.table} SET deleted_at=null WHERE ${id ? `id =${id}` : `deleted_at IS Not Null`}`);
  //   console.log(`User ID: ${id} Has Been Resotred`)
  //   return results
  // }
  async restore(id) {
    console.log("Restore Function Started");
    const query = softDelete(null, id)
    const results = await this.connection.query(query);
    console.log(`User ID: ${id} Has Been Resotred`)
    return results
  }
}


module.exports = { MySequelize };


