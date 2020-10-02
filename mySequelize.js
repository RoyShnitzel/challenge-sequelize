const mysql = require("mysql2/promise");

let mysqlCon = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "G15162411t",
  database: "strudel_music",
  multipleStatements: true,
});

// mysqlCon.connect((err) => {
//   if (err) throw err;
//   console.log("Connected!");
// });

class MySequelize {
  constructor(connect, tableName) {
    this.connection = connect;
    this.table = tableName;
  }

  async findAll() {
    console.log("started");
    const results = await this.connection.query(`SELECT * FROM ${this.table}`)
    return results
  }
  async findByPk(id) {
    console.log("started");
    const results = await this.connection.query(`SELECT * FROM ${this.table} WHERE id = ${id}`);
    return results[0]
  }
  async findOne(){
    console.log("started");
    const results = await this.connection.query(`SELECT * FROM ${this.table} LIMIT 1`)
    return results[0]
  }
}
// setTimeout(async () => {
//   const Song = new MySequelize(mysqlCon, "songs");
//   const results = await Song.findByPk(1);
//   console.log(results);
// }, 2000);

module.exports = { MySequelize };


