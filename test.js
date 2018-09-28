const app = require("./index");

const method = process.argv[2];
const args = Array.prototype.slice.call(process.argv, 3);
console.log(method, args);

if (!app[method]) throw new Error("Bad method");

app[method].apply(null, args)
  .then(console.log)
  .catch(console.error)
