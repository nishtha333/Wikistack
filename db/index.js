const Sequelize = require("sequelize");
const db = new Sequelize(process.env.DATABASE_URL);

const sync = () => {

};

const seed = () => {

};


module.exports = {
    sync,
    seed,
    models : {
        
    }
};