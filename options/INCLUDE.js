const config = require('./options')

async function INCLUDE(base, models, connection) {
    const newResults = await models.reduce(async (newBase, model) => {
        newBase = await JOIN(base, model, connection)
        return newBase
    }, base);
    return newResults
}

async function JOIN(base, { table, sourceForeignKey, tableForeignKey, ...options }, connection) {

    let optionsStatment = {}

    if (options) {
        const conditions = Object.keys(options)
        optionsStatment = conditions.reduce((statment, condition) => {
            statment[condition] = config[condition](options[condition])
            return statment
        }, {})

    }

    let results = await connection.query(`
    SELECT ${optionsStatment.attributes ? optionsStatment.attributes : '*'} 
    FROM ${table} 
    ${optionsStatment.where ? optionsStatment.where : ''} 
    ${optionsStatment.order ? optionsStatment.order : ''} 
    ${optionsStatment.limit ? optionsStatment.limit : ''}`)

    results = results[0]

    base = base.map(baseRow => {
        results.forEach(joinRow => {
            if (baseRow[sourceForeignKey] === joinRow[tableForeignKey]) {
                if (!baseRow[table]) {
                    baseRow[table] = []
                }
                baseRow[table].push(joinRow);

            }
        });
        return baseRow;
    })

    if (options && options.include) {
        return await INCLUDE(base, options.include, connection)
    } else {
        return base
    }

}

module.exports = { INCLUDE }