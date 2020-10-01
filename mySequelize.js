const mysql = require("mysql");

let mysqlCon = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "yalla007",
  database: "music-app",
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

  async findAll() {
    console.log("started");
    const query = new Promise((resolve, reject) => {
      this.connection.query(`SELECT * FROM ${this.table}`, function (
        error,
        results,
        fields
      ) {
        if (error) reject(error);
        resolve(results);
      });
    });
    try {
      const myResults = await query;
      return myResults;
    } catch (err) {
      console.log(err);
    }
  }
}
setTimeout(async () => {
  const Song = new MySequelize(mysqlCon, "songs");
  const results = await Song.findAll();
  console.log(results);
}, 1000);

module.exports = { MySequelize };
