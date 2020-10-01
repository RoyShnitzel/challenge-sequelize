const { MySequelize } = require("./mySequelize");
const mysql = require("mysql2/promise");

let mysqlCon;

describe("first test", () => {

  beforeAll(async () => {
    mysqlCon = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "O16s12@96",
      database: "music_app_dev",
      multipleStatements: true,
    });
  });

  afterAll(async () => {
    await connection.end();
  });

  describe('test', () => {

    test("findAll test", async () => {
      const Song = new MySequelize(mysqlCon, "songs");
      const myResults = await Song.findAll();

      const results = await mysqlCon.query(`SELECT * FROM songs`)

      expect(myResults.length).toBe(results.length)
    });
  })

});


