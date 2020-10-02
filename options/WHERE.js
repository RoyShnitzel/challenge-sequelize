function WHERE(conditions) {
    const conditiosKeys = Object.keys(conditions);
    const WhereStatment = conditiosKeys.reduce((statment, key, index) => {
        if (index === conditiosKeys.length - 1) {
            return statment += `${key} = '${conditions[key]}'`
        } else {
            return statment += `${key} = '${conditions[key]}' AND `
        }
    }, '')

    return WhereStatment
}

module.exports = { WHERE }