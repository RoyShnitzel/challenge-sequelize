// const gt = require('./gt')
// const lt = require('./lt')
// const or = require('./or')
// const and = require('./and')
// const like = require('./like')
// const includes = require('./includes')



const Op = {
    gt: Symbol.for('>'),
    lt: Symbol.for('<'),
    or: Symbol.for('OR'),
    and: Symbol.for('AND'),
    like: Symbol.for('LIKE'),
    // includes: Symbol('')
}

module.exports = { Op }  
