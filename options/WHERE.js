const { operations } = require("../Op/index");

function WHERE(conditions) {
  const conditiosKeys = Object.keys(conditions);
  let WhereStatment = conditiosKeys.reduce((statment, key, index) => {
    if (
      index === conditiosKeys.length - 1 &&
      Object.getOwnPropertySymbols(conditions).length === 0
    ) {
      return (statment += `${key} = '${conditions[key]}'`);
    } else {
      return (statment += `${key} = '${conditions[key]}' AND `);
    }
  }, "");

  if (Object.getOwnPropertySymbols(conditions).length > 0) {
    const symbolsKeys = Object.getOwnPropertySymbols(conditions);
    WhereStatment = symbolsKeys.reduce((statment, key, index) => {
      if (index === Object.getOwnPropertySymbols(conditions).length - 1) {
        return (statment += `${operations[key.toString().slice(7, -1)](
          conditions[key]
        )}`);
      } else {
        return (statment += `${operations[key.toString().slice(7, -1)](
          conditions[key]
        )} AND `);
      }
    }, WhereStatment);
  }

  return "WHERE " + WhereStatment;
}

module.exports = { WHERE };
