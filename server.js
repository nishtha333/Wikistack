const app = require("./app");
const db = require("./models");

//If Postegres is not running, Sequelize throws an error and need to do the following
//db.authenticate().then(() => console.log('connected to the database'));
const PORT = process.env.PORT || 3000;

db.sync().then(() => db.seed())
         .then(() => console.log("DB sync'ed and seeded"))
         .then(() => {
             app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));
         });