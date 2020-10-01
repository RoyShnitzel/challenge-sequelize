// const mysql = require("mysql2");

// let mysqlCon = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "O16s12@96",
//   database: "music_app_dev",
//   multipleStatements: true,
// });

// // mysqlCon.connect((err) => {
// //   if (err) throw err;
// //   console.log("Connected!");
// // });

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
}
// setTimeout(async () => {
//   const Song = new MySequelize(mysqlCon, "songs");
//   const results = await Song.findAll();
// }, 1000);

module.exports = { MySequelize };


