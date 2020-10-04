function lt(object) {
  const GTstatment = Object.keys(object).reduce((statment, key, index) => {
    if (index === Object.keys(object).length - 1) {
      return (statment += `${key} < ${object[key]}`);
    } else {
      return (statment += `${key} < ${object[key]} AND `);
    }
  }, "");

  console.log(GTstatment);
  return GTstatment;
}

module.exports = { lt };
