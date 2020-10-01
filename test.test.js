const { mySequelize } = require("./mySequelize");
const mysql = require("mysql");
const { describe } = require("yargs");

describe("first test", () => {
  beforeAll(async () => {
    let mysqlCon = await mysql.createConnection({
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
  });

  it("findAll test", async () => {
    const Song = new MySequelize(mysqlCon, "songs");
    const myResults = await Song.findAll();
    mysqlCon.query(`SELECT * FROM songs`, function (error, results, fields) {
      if (error) throw error;
      expect(myResults.length).toBe(results.length);
    });
  });
});
