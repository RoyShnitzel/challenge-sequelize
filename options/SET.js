function SET(fields) {
    const newDetailsKeys = Object.keys(fields);
    const SetStatment = newDetailsKeys.reduce((statment, key, index) => {
        if (index === newDetailsKeys.length - 1) {
            return statment += `${key} = '${fields[key]}'`
        } else {
            return statment += `${key} = '${fields[key]}', `
        }
    }, '')

    return SetStatment
}

module.exports = { SET };
