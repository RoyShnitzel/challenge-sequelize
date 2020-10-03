function ORDER(conditions) {

    const order = `ORDER BY ${conditions[0]} ${conditions[1] ? conditions[1] : ''}`

    return order
}

module.exports = { ORDER }
