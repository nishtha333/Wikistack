const app = require("app");
const db = require("./db");

db.sync();
db.seed();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));