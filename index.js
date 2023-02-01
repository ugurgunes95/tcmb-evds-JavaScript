const Evds = require("./Evds");

const evds = new Evds();

evds
  .getData()
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
