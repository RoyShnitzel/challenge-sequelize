const { MySequelize } = require("./mySequelize");
const mysql = require("mysql2/promise");

let mysqlCon;

describe("first test", () => {

  beforeAll(async () => {
    mysqlCon = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "G15162411t",
      database: "challenge_sequelize",
      multipleStatements: true,
    });
  });

  afterAll(async () => {
    await connection.end();
  });



  describe('findAll(),findOne(),findByPk() test', () => {

    beforeAll(async () => {
      await mysqlCon.query('TRUNCATE TABLE `playlists`')
      await mysqlCon.query('DELETE FROM `users` WHERE id < 10000')

      await mysqlCon.query(`INSERT INTO users (name, email, password, is_admin)
          VALUES ('Dani', 'dani@gmail.com', '123456789', false),
          ('Yoni', 'yoni@gmail.com', '987654321', false),
          ('Ron', 'ron@gmail.com', '192837465', false),
          ('Dana', 'dana@gmail.com', '918273645', True),
          ('Yuval', 'yuval@gmail.com', '65748493021', false);`)

      await mysqlCon.query(`INSERT INTO playlists (name, creator)
          VALUES ('playlist1', '1'),
          ('playlist2', '1'),
          ('playlist3', '1'),
          ('playlist4', '2'),
          ('playlist5', '2'),
          ('playlist6', '3'),
          ('playlist7', '4'),
          ('playlist8', '5');`)
        
    });

    afterAll(async () => {
      await mysqlCon.query('TRUNCATE TABLE `playlists`')
      await mysqlCon.query('DELETE FROM `users` WHERE id < 10000')
    })

    test("findAll no conditions test", async () => {
      const User = new MySequelize(mysqlCon, "users");
      const myResults = await User.findAll();

      const results = await mysqlCon.query(`SELECT * FROM users`)

      expect(myResults.length).toBe(results[0].length)

      expect(myResults[0].name).toBe('Dani');
      expect(myResults[4].name).toBe('Yuval');

      expect(myResults[1].password).toBe('987654321');
      expect(myResults[3].password).toBe('918273645');

    });

    test("findAll only WHERE test", async () => {

      const User = new MySequelize(mysqlCon, "users");
      const myResults = await User.findAll({
        where: {
          name: 'Yoni'
        }
      });

      const results = await mysqlCon.query(`SELECT * FROM users WHERE name = 'Yoni'`)

      expect(myResults[0].id).toBe(results[0][0].id)
      expect(myResults[0].name).toBe("Yoni")

    });

    test('findAll WHERE and ORDER BY test', async () => {

      const User = new MySequelize(mysqlCon, "users");
      const myResults = await User.findAll({
        where: {
          is_admin: false
        },
        order: ['id', 'DESC']
      });

      const results = await mysqlCon.query(`SELECT * FROM users WHERE is_admin = false ORDER BY id DESC`)

      expect(myResults.length).toBe(results[0].length)
      expect(myResults[0].id).toBe(results[0][0].id)

      // expect(myResults[0].id).toBe(5)
      // expect(myResults[myResults.length - 1].id).toBe(1)

      expect(Boolean(myResults[2].is_admin)).toBe(false)
      expect(Boolean(myResults[3].is_admin)).toBe(false)


    });

    test("findAll LIMIT and ATTRIBUTES test", async () => {

      const User = new MySequelize(mysqlCon, "users");
      const myResults = await User.findAll({
        attributes: ['name', ['id', 'user_id']],
        limit: 2
      });

      const results = await mysqlCon.query(`SELECT name, id AS user_id FROM users LIMIT 2;`)

      expect(myResults[0].user_id).toBe(results[0][0].user_id)
      expect(myResults[1].email).toBe(undefined)
      expect(myResults.length).toBe(2)

    });

    test("findOne no condition test", async () =>{
      const User = new MySequelize(mysqlCon, "users");
      const myResults = await User.findOne();

      expect(myResults.length).toBe(1);
      expect(myResults[0].name).toBe('Dani');
    })

    test("findOne with conditions test", async () => {
      const User = new MySequelize(mysqlCon, "users");
      const myResults = await User.findOne({
        where: { name: 'dani', password: '123456789'},
        attributes: ['name',['email' ,'user_email']],
      });

      expect(myResults.length).toBe(1);
      expect(myResults[0].name).toBe('Dani');
      expect(myResults[0].user_email).toBe('dani@gmail.com');
    })

    test("findByPk test", async () => {
      const User = new MySequelize(mysqlCon, "users");
      const results = await mysqlCon.query(`SELECT * FROM users`);
      const myResults = await User.findByPk(results[0][2].id);

      expect(myResults.length).toBe(1);
      expect(myResults[0].id).toBe(results[0][2].id);
      expect(myResults[0].name).toBe('Ron');
    })

    // test("findAll INCLUDE test", async () => { // need to silve overriding

      // const results = await mysqlCon.query(`SELECT * FROM users`)

      // await mysqlCon.query(`INSERT INTO playlists (name, creator)
      //     VALUES ('playlist1', ${results[0][0].id}),
      //     ('playlist2', ${results[0][2].id}),
      //     ('playlist3', ${results[0][2].id}),
      //     ('playlist4', ${results[0][2].id}),
      //     ('playlist5', ${results[0][4].id});`)

      // const User = new MySequelize(mysqlCon, "users");
      // const myResults = await User.findAll({
      //   include: [
      //     {
      //       table: 'playlists',
      //       sourceColumn: ['users', 'id'],
      //       tableColumn: 'creator'
      //     }
      //   ]
      // });

      // const joinResults = await mysqlCon.query(`SELECT * FROM users LEFT JOIN playlists ON users.id = playlists.creator;`)

      // console.log(myResults, '1')

      // console.log(joinResults[0], '2')

      // expect(myResults[0].user_id).toBe(results[0][0].user_id)
      // expect(myResults[1].email).toBe(undefined)
      // expect(myResults.length).toBe(2)

    // });


  });





  // describe('update() test', () => {

  //   beforeAll(async () => {
  //     await mysqlCon.query('TRUNCATE TABLE `playlists`')
  //     await mysqlCon.query('DELETE FROM `users` WHERE id < 10000')

  //     await mysqlCon.query(`INSERT INTO users (name, email, password, is_admin)
  //         VALUES ('Dani', 'dani@gmail.com', '123456789', false),
  //         ('Yoni', 'yoni@gmail.com', '987654321', false),
  //         ('Ron', 'ron@gmail.com', '192837465', false),
  //         ('Dana', 'dana@gmail.com', '918273645', True),
  //         ('Yuval', 'yuval@gmail.com', '65748493021', false);`)
  //   });

  //   afterAll(async () => {
  //     await mysqlCon.query('TRUNCATE TABLE `playlists`')
  //     await mysqlCon.query('DELETE FROM `users` WHERE id < 10000')
  //   })

  //   test('only WHERE test', async () => {

  //     const allUsers = await mysqlCon.query(`SELECT * FROM users`)

  //     expect(allUsers[0][0].name).toBe('Dani')
  //     expect(allUsers[0][0].email).toBe('dani@gmail.com')

  //     const User = new MySequelize(mysqlCon, 'users');
  //     await User.update({ name: 'Yoav', email: 'yoav@gmail.com' }, {
  //       where: {
  //         id: allUsers[0][0].id
  //       }
  //     })

  //     const user = await mysqlCon.query(`SELECT * FROM users WHERE id = ${allUsers[0][0].id}`)

  //     expect(user[0][0].name).toBe('Yoav')
  //     expect(user[0][0].email).toBe('yoav@gmail.com')

  //   })

  //   test('')
  // })


})







