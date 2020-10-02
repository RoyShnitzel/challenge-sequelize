const { MySequelize } = require("./mySequelize");
const mysql = require("mysql2/promise");

let mysqlCon;

describe("first test", () => {

  beforeAll(async () => {
    mysqlCon = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "O16s12@96",
      database: "challenge_sequelize",
      multipleStatements: true,
    });
  });

  afterAll(async () => {
    await connection.end();
  });



  describe('findAll() test', () => {

    beforeAll(async () => {
      await mysqlCon.query('TRUNCATE TABLE `users`')

      await mysqlCon.query(`INSERT INTO users (name, email, password, is_admin)
          VALUES ('Dani', 'dani@gmail.com', '123456789', false),
          ('Yoni', 'yoni@gmail.com', '987654321', false),
          ('Ron', 'ron@gmail.com', '192837465', false),
          ('Dana', 'dana@gmail.com', '918273645', True),
          ('Yuval', 'yuval@gmail.com', '65748493021', false);`)
    });

    afterAll(async () => {
      await mysqlCon.query('TRUNCATE TABLE `users`')
    })

    test("no conditions test", async () => {
      const User = new MySequelize(mysqlCon, "users");
      const myResults = await User.findAll();

      const results = await mysqlCon.query(`SELECT * FROM users`)

      expect(myResults.length).toBe(results[0].length)

      expect(myResults[0].name).toBe('Dani');
      expect(myResults[4].name).toBe('Yuval');

      expect(myResults[1].password).toBe('987654321');
      expect(myResults[3].password).toBe('918273645');

    });

    // test("only WHERE test", async () => {

    //   const User = new MySequelize(mysqlCon, "users");
    //   const myResults = await User.findAll({
    //     where: {
    //       name: 'Yoni'
    //     }
    //   });

    //   const results = await mysqlCon.query(`SELECT * FROM songs`)

    //   expect(myResults.length).toBe(results.length)
    // });


  })


  describe('update() test', () => {

    beforeAll(async () => {
      await mysqlCon.query('TRUNCATE TABLE `users`')

      await mysqlCon.query(`INSERT INTO users (name, email, password, is_admin)
          VALUES ('Dani', 'dani@gmail.com', '123456789', false),
          ('Yoni', 'yoni@gmail.com', '987654321', false),
          ('Ron', 'ron@gmail.com', '192837465', false),
          ('Dana', 'dana@gmail.com', '918273645', True),
          ('Yuval', 'yuval@gmail.com', '65748493021', false);`)
    });

    afterAll(async () => {
      await mysqlCon.query('TRUNCATE TABLE `users`')
    })



    test('update test', async () => {

      const allUsers = await mysqlCon.query(`SELECT * FROM users`)

      expect(allUsers[0][0].name).toBe('Dani')
      expect(allUsers[0][0].email).toBe('dani@gmail.com')

      const User = new MySequelize(mysqlCon, 'users');
      await User.update({ name: 'Yoav', email: 'yoav@gmail.com' }, {
        where: {
          id: allUsers[0][0].id
        }
      })

      const user = await mysqlCon.query(`SELECT * FROM users WHERE id = ${allUsers[0][0].id}`)

      expect(user[0][0].name).toBe('Yoav')
      expect(user[0][0].email).toBe('yoav@gmail.com')

    })
  })


})





