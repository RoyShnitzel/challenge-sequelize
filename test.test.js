const { MySequelize } = require("./mySequelize");
const mysql = require("mysql2/promise");

let mysqlCon;

describe("first test", () => {
  beforeAll(async () => {
    mysqlCon = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Injector1337",
      database: "challenge_sequelize",
      multipleStatements: true,
    });

  });

  afterAll(async (done) => {
    await mysqlCon.end()
    done()
  })

  describe("Destroy() and Restore() test", () => {
    beforeEach(async () => {
      const insertUser = await mysqlCon.query(
        `INSERT INTO users (id, name, password, email) VALUES 
        (1, 'gtrodel',12345678, 'gtrodel@gmail.com'), (2, 'rshnitzer',12345678, 'rshnitzer@gmail.com'), (3, 'osimhi', 12345678, 'osimhi@gmail.com'), (4, 'gmoshko', 666666, 'gmoshko@gmail.com')`
      );

    });

    afterEach(async () => {
      await mysqlCon.query(`DELETE FROM users`);
    });
    test("destroy() test", async () => {
      const Users = new MySequelize(mysqlCon, "users");
      const results = await mysqlCon.query(`SELECT * FROM users WHERE id = 1`);

      expect(results[0][0].deleted_at).toBe(null);
      await Users.delete({
        where: {
          id: 1
        }
      });

      const deletedUser = await mysqlCon.query(
        `SELECT * FROM users WHERE id = 1`
      );

      expect(deletedUser[0][0].deleted_at).not.toBe(null);
    });

    test("hard delete() test", async () => {
      
      const Users = new MySequelize(mysqlCon, "users");
      const results = await mysqlCon.query(`SELECT * FROM users WHERE id = 1`);
      expect(results[0][0]).not.toBe(undefined);
      await Users.delete({
        where: {
          id: 1
        },
        force: true
      });
      const deletedUser = await mysqlCon.query(
        `SELECT * FROM users WHERE id = 1`
      );

      expect(deletedUser[0][0]).toBe(undefined);
    });

    test("restore() test", async () => {
      const Users = new MySequelize(mysqlCon, "users");

      await Users.delete(
        {where:{
          id: 1
        }}
      );

      const deletedUser = await mysqlCon.query(
        `SELECT * FROM users WHERE id = 1`
      );

      expect(deletedUser[0][0].deleted_at).not.toBe(null);
      await Users.restore();

      const restoredUser = await mysqlCon.query(
        `SELECT * FROM users WHERE id = 1`
      );
      const secondRestoredUser = await mysqlCon.query(
        `SELECT * FROM users WHERE id = 2`
      );

      expect(restoredUser[0][0].deleted_at).toBe(null);
      expect(secondRestoredUser[0][0].deleted_at).toBe(null);
    });
  });

  describe("findAll() test", () => {
    beforeAll(async () => {
      await mysqlCon.query("TRUNCATE TABLE `playlists`");
      await mysqlCon.query("DELETE FROM `users` WHERE id < 10000");

      await mysqlCon.query(`INSERT INTO users (name, email, password, is_admin)
          VALUES ('Dani', 'dani@gmail.com', '123456789', false),
          ('Yoni', 'yoni@gmail.com', '987654321', false),
          ('Ron', 'ron@gmail.com', '192837465', false),
          ('Dana', 'dana@gmail.com', '918273645', True),
          ('Yuval', 'yuval@gmail.com', '65748493021', false);`);
    });

    afterAll(async () => {
      await mysqlCon.query("TRUNCATE TABLE `playlists`");
      await mysqlCon.query("DELETE FROM `users`");
    });

    test("no conditions test", async () => {
      const User = new MySequelize(mysqlCon, "users");
      const myResults = await User.findAll();

      const results = await mysqlCon.query(`SELECT * FROM users`);

      expect(myResults.length).toBe(results[0].length);

      expect(myResults[0].name).toBe("Dani");
      expect(myResults[4].name).toBe("Yuval");

      expect(myResults[1].password).toBe("987654321");
      expect(myResults[3].password).toBe("918273645");
    });

    test("only WHERE test", async () => {
      const User = new MySequelize(mysqlCon, "users");
      const myResults = await User.findAll({
        where: {
          name: "Yoni",
        },
      });

      const results = await mysqlCon.query(
        `SELECT * FROM users WHERE name = 'Yoni'`
      );

      expect(myResults[0].id).toBe(results[0][0].id);
      expect(myResults[0].name).toBe("Yoni");
    });

    test("WHERE and ORDER BY test", async () => {
      const User = new MySequelize(mysqlCon, "users");
      const myResults = await User.findAll({
        where: {
          is_admin: false,
        },
        order: ["id", "DESC"],
      });

      const results = await mysqlCon.query(
        `SELECT * FROM users WHERE is_admin = false ORDER BY id DESC`
      );

      expect(myResults.length).toBe(results[0].length);
      expect(myResults[0].id).toBe(results[0][0].id);

      // expect(myResults[0].id).toBe(5)
      // expect(myResults[myResults.length - 1].id).toBe(1)

      expect(Boolean(myResults[2].is_admin)).toBe(false);
      expect(Boolean(myResults[3].is_admin)).toBe(false);
    });

    test("LIMIT and ATTRIBUTES test", async () => {
      const User = new MySequelize(mysqlCon, "users");
      const myResults = await User.findAll({
        attributes: ["name", ["id", "user_id"]],
        limit: 2,
      });

      const results = await mysqlCon.query(
        `SELECT name, id AS user_id FROM users LIMIT 2;`
      );

      expect(myResults[0].user_id).toBe(results[0][0].user_id);
      expect(myResults[1].email).toBe(undefined);
      expect(myResults.length).toBe(2);
    });

    test("INCLUDE test", async () => {
      const results = await mysqlCon.query(`SELECT * FROM users`);

      await mysqlCon.query(`INSERT INTO playlists (name, creator)
          VALUES ('playlist1', ${results[0][0].id}),
          ('playlist2', ${results[0][2].id}),
          ('playlist3', ${results[0][2].id}),
          ('playlist4', ${results[0][2].id}),
          ('playlist5', ${results[0][4].id});`);

      const User = new MySequelize(mysqlCon, "users");
      const myResults = await User.findAll({
        include: [
          {
            table: "playlists",
            sourceColumn: "id",
            tableColumn: "creator",
          },
        ],
      });



      expect(myResults[0].id).toBe(results[0][0].id);
      expect(myResults[0].playlists[0].creator).toBe(results[0][0].id);
      expect(myResults[2].playlists.length).toBe(3);
      expect(myResults[4].playlists[0].name).toBe("playlist5");
    });
  });

  describe("update() test", () => {
    beforeAll(async () => {
      await mysqlCon.query("TRUNCATE TABLE `playlists`");
      await mysqlCon.query("DELETE FROM `users` WHERE id < 10000");

      await mysqlCon.query(`INSERT INTO users (name, email, password, is_admin)
          VALUES ('Dani', 'dani@gmail.com', '123456789', false),
          ('Yoni', 'yoni@gmail.com', '987654321', false),
          ('Ron', 'ron@gmail.com', '192837465', false),
          ('Dana', 'dana@gmail.com', '918273645', True),
          ('Yuval', 'yuval@gmail.com', '65748493021', false);`);
    });

    afterAll(async () => {
      await mysqlCon.query("TRUNCATE TABLE `playlists`");
      await mysqlCon.query("DELETE FROM `users` WHERE id < 10000");
    });

    test("only WHERE test", async () => {
      const allUsers = await mysqlCon.query(`SELECT * FROM users`);

      expect(allUsers[0][0].name).toBe("Dani");
      expect(allUsers[0][0].email).toBe("dani@gmail.com");

      const User = new MySequelize(mysqlCon, "users");
      await User.update(
        { name: "Yoav", email: "yoav@gmail.com" },
        {
          where: {
            id: allUsers[0][0].id,
          },
        }
      );

      const user = await mysqlCon.query(
        `SELECT * FROM users WHERE id = ${allUsers[0][0].id}`
      );

      expect(user[0][0].name).toBe("Yoav");
      expect(user[0][0].email).toBe("yoav@gmail.com");
    });

    // test('WHERE and LIMIT test', async () => {
    //   const allUsers = await mysqlCon.query(`SELECT * FROM users`)

    //   expect(allUsers[0][0].name).toBe('Yoav')
    //   expect(allUsers[0][0].email).toBe('yoav@gmail.com')

    //   const User = new MySequelize(mysqlCon, 'users');
    //   await User.update({ name: 'Yoav', email: 'yoav@gmail.com' }, {
    //     where: {
    //       id: allUsers[0][0].id
    //     },
    //     limit: 2
    //   })

    //   const user = await mysqlCon.query(`SELECT * FROM users WHERE id = ${allUsers[0][0].id}`)

    //   expect(user[0][0].name).toBe('Yoav')
    //   expect(user[0][0].email).toBe('yoav@gmail.com')

    // })
  });

  describe("Insert() test", () => {

    afterEach(async () => {
      await mysqlCon.query('DELETE FROM users')
    })
    test("create test", async () => {
      const User = new MySequelize(mysqlCon, "users");
      await User.create({
        id: 21,
        name: "test",
        email: 'test@gmail.com',
        password: '123456789',
        is_admin: false
      });

      const results = await mysqlCon.query(`SELECT * FROM users WHERE id = 21`);

      expect(results[0][0].name).toBe("test");
    });

    test("bulkCreate test", async () => {
      const User = new MySequelize(mysqlCon, "users");
      await User.bulkCreate([
        {
          id: 22,
          name: "test2",
          email: 'test2@gmail.com',
          password: '123456789',
          is_admin: false
        },
        {
          id: 23,
          name: "test3",
          email: 'test3@gmail.com',
          password: '123456789',
          is_admin: false
        },
      ]);

      const results = await mysqlCon.query(`SELECT * FROM users WHERE id = 22`);
      const results2 = await mysqlCon.query(`SELECT * FROM users WHERE id = 23`);

      expect(results[0][0].name).toBe("test2");
      expect(results2[0][0].name).toBe("test3");
    });
  });

  describe("FindOne() and FindByPk()", () => {

    beforeAll(async () => {
      await mysqlCon.query("TRUNCATE TABLE `playlists`");
      await mysqlCon.query("DELETE FROM `users` WHERE id < 10000");

      await mysqlCon.query(`INSERT INTO users (name, email, password, is_admin)
          VALUES ('Dani', 'dani@gmail.com', '123456789', false),
          ('Yoni', 'yoni@gmail.com', '987654321', false),
          ('Ron', 'ron@gmail.com', '192837465', false),
          ('Dana', 'dana@gmail.com', '918273645', True),
          ('Yuval', 'yuval@gmail.com', '65748493021', false);`);
    });

    afterAll(async () => {
      await mysqlCon.query("TRUNCATE TABLE `playlists`");
      await mysqlCon.query("DELETE FROM `users`");
    });

    test("findOne no condition test", async () => {
      const User = new MySequelize(mysqlCon, "users");
      const myResults = await User.findOne();

      expect(myResults.length).toBe(1);
      expect(myResults[0].name).toBe('Dani');
    })

    test("findOne with conditions test", async () => {
      const User = new MySequelize(mysqlCon, "users");
      const myResults = await User.findOne({
        where: { name: 'dani', password: '123456789' },
        attributes: ['name', ['email', 'user_email']],
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
  })

});