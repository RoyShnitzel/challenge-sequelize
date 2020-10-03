const config = require('../options/options')

function getConfig(options) {
    let optionsStatment = {}

    if (options) {
        const conditions = Object.keys(options)
        optionsStatment = conditions.reduce((statment, condition) => {
            if (condition === 'include' || condition === 'force') {
                return statment
            }
            statment[condition] = config[condition](options[condition])
            return statment
        }, {})

    }

    return `${optionsStatment.where ? optionsStatment.where : ''} 
  ${optionsStatment.order ? optionsStatment.order : ''} 
  ${optionsStatment.limit ? optionsStatment.limit : ''}`
}

function getAttributes(attributes) {
    return config.attributes(attributes)
}

const getDate = () => new Date().toISOString().slice(0, 19).replace('T', ' ');

module.exports = {
    getConfig,
    getDate,
    getAttributes
}