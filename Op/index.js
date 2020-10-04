const { gt } = require("./gt");
const { lt } = require("./lt");
const or = require("./or");
const and = require("./and");
const like = require("./like");
const includes = require("./includes");

const operations = {
  ">": gt,
  "<": lt,
  or,
  and,
  like,
};

module.exports = { operations };
