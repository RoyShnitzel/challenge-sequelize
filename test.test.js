const { MySequelize } = require("./mySequelize");
const mysql = require("mysql2/promise");
const getDate = require("./helpers/getDate");
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
	beforeEach(async () => {
		const insertUser = await mysqlCon.query(
			`INSERT INTO users (id, username, password, email, created_at, deleted_at) VALUES 
        (1, 'gtrodel',12345678, 'gtrodel@gmail.com', ${getDate()}, null), (2, 'rshnitzer',12345678, 'rshnitzer@gmail.com', ${getDate()}, null), (3, 'osimhi', 12345678, 'osimhi@gmail.com', ${getDate()}, null), (4, 'gmoshko', 666666, 'gmoshko@gmail.com', ${getDate()}, null)`
		);
		console.log(insertUser);
	});

	afterEach(async () => {
		await mysqlCon.query(`DELETE FROM users`);
	});
	afterAll(async () => {
		await connection.end();
	});

	describe("test", () => {
		test("soft delete test", async () => {
			const Users = new MySequelize(mysqlCon, "users");
			const results = await mysqlCon.query(`SELECT * FROM users WHERE id = 1`);
			console.log("Result2", results[0][0].deleted_at);
			expect(results[0][0].deleted_at).toBe(null);

			await Users.delete(1);
			const deletedUser = await mysqlCon.query(
				`SELECT * FROM users WHERE id = 1`
			);

			expect(deletedUser[0][0].deleted_at).not.toBe(null);
		});
		test("restore test", async () => {
			const Users = new MySequelize(mysqlCon, "users");

			await Users.delete(1);
			await Users.delete(2);
			const deletedUser = await mysqlCon.query(
				`SELECT * FROM users WHERE id = 1`
			);

			expect(deletedUser[0][0].deleted_at).not.toBe(null);
			await Users.restore();
			console.log(`User has Been Restored`);
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
});

//   test("restore test", async () => {
//     const Users = new MySequelize(mysqlCon, "users");
//     const myResults = await Users.findOne();
//     const results = await mysqlCon.query(`SELECT * FROM users LIMIT 1`)

//     expect(myResults.length).toBe(results[0].length);
//     expect(myResults[0].name).toBe(results[0][0].name)
//   });
// })

// });
