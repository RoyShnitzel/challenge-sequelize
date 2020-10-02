const { MySequelize } = require("./mySequelize");
const mysql = require("mysql2/promise");

let mysqlCon;

describe("first test", () => {

  beforeAll(async () => {
    mysqlCon = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "G15162411t",
      database:  "strudel_music",
      multipleStatements: true,
    });
  });

  afterAll(async () => {
    await connection.end();
  });

  describe('test', () => {

    // test("findAll test", async () => {
    //   const Song = new MySequelize(mysqlCon, "songs");
    //   const myResults = await Song.findAll();
    //   const results = await mysqlCon.query(`SELECT * FROM songs`)

    //   expect(myResults.length).toBe(results.length)
    // });
    test("findByPk test", async () => {
      const Users = new MySequelize(mysqlCon, "users");
      const myResults = await Users.findByPk(1);
      const results = await mysqlCon.query(`SELECT * FROM users WHERE id = 1`)

      expect(myResults.length).toBe(results[0].length)
      expect(myResults[0].name).toBe(results[0][0].name)
    });
    test("findOne test", async () => {
      const Users = new MySequelize(mysqlCon, "users");
      const myResults = await Users.findOne();
      const results = await mysqlCon.query(`SELECT * FROM users LIMIT 1`)

      expect(myResults.length).toBe(results[0].length);
      expect(myResults[0].name).toBe(results[0][0].name)
    });

  })

});


