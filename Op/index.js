// const gt = require('./gt')
// const lt = require('./lt')
// const or = require('./or')
// const and = require('./and')
// const like = require('./like')
// const includes = require('./includes')

const gt = Symbol('>')

const Op = {
    gt,
    // lt,
    // or,
    // and,
    // like,
    // includes
}

module.exports = { Op }  
