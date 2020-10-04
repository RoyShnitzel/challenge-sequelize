class MySequelize {
    constructor(connect, tableName) {
        this.connection = connect;
        this.table = tableName;
    }

    async create(obj) {

        /*
           Model.create({
               name: 'test',
               email: 'test@gmail.com',
               password: '123456789',
               is_admin: false
           })
        */
    }

    async bulkCreate(arr) {

        /*
           Model.bulkCreate([
               {
               name: 'test',
               email: 'test@gmail.com',
               password: '123456789',
               is_admin: false
           },
           {
               name: 'test1',
               email: 'test1@gmail.com',
               password: '123456789',
               is_admin: false
           },
           {
               name: 'test2',
               email: 'test2@gmail.com',
               password: '123456789',
               is_admin: true
           },
        ])
        */
    }

    async findAll(options) {

        /*
        Model.findAll({
            where: {
                is_admin: false
            },
            order: ['id', 'DESC'],
            limit 2
        })
        */

        /*
        Model.findAll({
            include:[
                {
                    table: playlists,             // table yo want to join
                    tableForeignKey: "creator",   // column reference in the table yo want to join
                    sourceForeignKey: "id",       // base table column reference
                }
            ] 
        })
        */

        /*
        Model.findAll({
            where: {
                [Op.gt]: {
                    id: 10
                },                // both [Op.gt] and [Op.lt] need to work so you can pass the tests
                [Op.lt]: {        
                    id: 20
                }
        })
        */
    }

    async findByPk(id) {
        /*
            Model.findByPk(id)
        */
    }

    async findOne(options) {
        /*
            Model.findOne({
                where: {
                    is_admin: true
                }
            })
        */
    }

    async update(newDetsils, options) {
        /*
            Model.update( { name: 'test6', email: 'test6@gmail.com' } , {
                where: {                                                      // first object containing details to update
                    is_admin: true                                            // second object containing condotion for the query
                }
            })
        */
    }

    async destroy({ force, ...options }) {
        /*
            Model.destroy({
                where: {                                                      
                    is_admin: true                                            
                },
                force: true      // will cause hard delete
            })
        */

        /*
           Model.destroy({
               where: {                                                      
                   id: 10                                           
               },
               force: false      // will cause soft delete
           })
       */
        /*
           Model.destroy({
               where: {                                                      
                   id: 10                                           
               },  // will cause soft delete
           })
       */

    }

    async restore(options) {
        /*
           Model.restore({
               where: {                                                      
                   id: 12                                          
               }
           })
       */
    }

}

module.exports = { MySequelize };