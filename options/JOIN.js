function INCLUDE(tables) {

    const join = tables.reduce((statment, table) => {
        return statment += `LEFT JOIN ${table.table} 
        ON ${table.sourceColumn[0]}.${table.sourceColumn[1]} = ${table.table}.${table.tableColumn}`
    }, '')

    console.log(join)

    return join
}

module.exports = { INCLUDE }