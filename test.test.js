const { MySequelize } = require("./mySequelize");
const mysql = require("mysql2/promise");

let mysqlCon;

describe("first test", () => {
  beforeAll(async () => {
    mysqlCon = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "yalla007",
      database: "music-app",
      multipleStatements: true,
    });
  });

  afterAll(async () => {
    await connection.end();
  });

  describe("test", () => {
    test("findAll test", async () => {
      const Song = new MySequelize(mysqlCon, "songs");
      const myResults = await Song.findAll();

      const results = await mysqlCon.query(`SELECT * FROM songs`);

      expect(myResults.length).toBe(results.length);
    });

    test("create test", async () => {
      const Album = new MySequelize(mysqlCon, "albums");
      await Album.create({
        id: 21,
        name: "test",
        cover_img: "jdhhf.jpeg",
        created_at: "2020-10-10",
        upload_at: "2020-10-10",
      });

      const results = await mysqlCon.query(
        `SELECT * FROM albums WHERE id = 21`
      );

      expect(results[0][0].name).toBe("test");
    });

    test("bulkCreate test", async () => {
      const Album = new MySequelize(mysqlCon, "albums");
      await Album.bulkCreate([
        {
          id: 22,
          name: "test2",
          cover_img: "jdhhf2.jpeg",
          created_at: "2020-10-10",
          upload_at: "2020-10-10",
        },
        {
          id: 23,
          name: "test3",
          cover_img: "jdhhf3.jpeg",
          created_at: "2020-10-10",
          upload_at: "2020-10-10",
        },
      ]);

      const results = await mysqlCon.query(
        `SELECT * FROM albums WHERE id = 22`
      );
      const results2 = await mysqlCon.query(
        `SELECT * FROM albums WHERE id = 23`
      );

      expect(results[0][0].name).toBe("test2");
      expect(results2[0][0].name).toBe("test3");
    });
  });
});
