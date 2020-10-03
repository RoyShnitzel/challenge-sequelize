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
    const results = await this.connection.query(`SELECT * FROM ${this.table}`);
    return results;
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
// setTimeout(async () => {
//   const Song = new MySequelize(mysqlCon, "songs");
//   const results = await Song.findAll();
// }, 1000);

module.exports = { MySequelize };
