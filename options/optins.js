const { WHERE } = require('./WHERE');
const { ORDER } = require('./ORDER')
const { LIMIT } = require('./LIMIT')
const { ATTRIBUTES } = require('./ATTRIBUTES')
const { INCLUDE } = require('./JOIN')

const config = {
    where: WHERE,
    order: ORDER,
    limit: LIMIT,
    attributes: ATTRIBUTES,
    include: INCLUDE
}

module.exports = config