function ATTRIBUTES(colums) {

    const attributes = colums.reduce((statment, value, index) => {
        let attribute = ''
        if (Array.isArray(value)) {
            attribute = value[0] + ' AS ' + value[1]
        } else {
            attribute = value
        }

        if (index < colums.length - 1) {
            attribute += ', '
        }

        return statment += attribute

    }, '')

    return attributes;

}

module.exports = { ATTRIBUTES }