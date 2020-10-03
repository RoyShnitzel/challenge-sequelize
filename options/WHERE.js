function WHERE(conditions) {


    // for (const [key, value] of Object.entries(conditions)) {
    //     // console.log(key === Symbol.for('>'));
    //     if (typeof value === 'object') {
    //         console.log(typeof key)
    //         console.log(key)
    //     }

    // }


    const conditiosKeys = Object.keys(conditions);
    const WhereStatment = conditiosKeys.reduce((statment, key, index) => {

        if (index === conditiosKeys.length - 1) {
            return statment += `${key} = '${conditions[key]}'`
        } else {
            return statment += `${key} = '${conditions[key]}' AND `
        }

    }, '')

    return 'WHERE ' + WhereStatment
}

module.exports = { WHERE }
