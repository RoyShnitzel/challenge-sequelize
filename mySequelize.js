class MySequelize {
  constructor(connect, tableName) {
    this.connection = connect;
    this.table = tableName;
  }

  async findAll() {
    console.log("started");
    const results = await this.connection.query(`SELECT * FROM ${this.table}`)
    return results
  }
}


module.exports = { MySequelize };


