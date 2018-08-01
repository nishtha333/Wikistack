const Sequelize = require("sequelize");
const db = new Sequelize(process.env.DATABASE_URL, {logging: false});

const User = db.define('user', {
    name:   {type: Sequelize.STRING, allowNull: false},
    email:  {type: Sequelize.STRING, allowNull: false, validate: {isEmail: true}}
});

const Page = db.define('page', {
    title:  {type: Sequelize.STRING, allowNull: false},
    slug:   {type: Sequelize.STRING, allowNull: false},
    content:{type: Sequelize.TEXT, allowNull: false},
    status: {type: Sequelize.ENUM('open', 'closed')}
}, {
    hooks: {
        beforeValidate: function(page) {
            page.slug = generateSlug(page.title);
        }
    }
});

User.hasMany(Page);
Page.belongsTo(User);

const sync = () => {
    return db.sync({force: true});
};

const seed = () => {
    const usernames = ["User1", "User2", "User3"];
    return Promise.all(usernames.map(user => User.create({name: user, email: `${user}@email.com`})))
                  .then(([user1, user2, user3]) => {
                        return Promise.all([
                            Page.create({title: "Page1", content: "Page1 Content", status: 'open', userId: user1.id}),
                            Page.create({title: "Page2", content: "Page2 Content", status: 'open', userId: user1.id}),
                            Page.create({title: "Page3", content: "Page3 Content", status: 'closed', userId: user1.id}),
                            Page.create({title: "Page4", content: "Page4 Content", status: 'open', userId: user2.id}),
                            Page.create({title: "Page 5", content: "Page5 Content", status: 'open', userId: user2.id}),
                        ]);
                  });
};

const getAllUsers = () => {
    return User.findAll({include: [Page]});
}

const getUserById = (id) => {
    return User.findOne({where: {id:id }, include: [Page]});
}

const getAllPages = () => {
    return Page.findAll({include: [User]});
}

const getPageBySlug = (slug) => {
    return Page.findOne({where: {slug: slug}, include: [User]});
}

const addPage = async (title, content, status, name, email)  => {
    let user = await User.findOne({
        where: {name: name, email: email}
    });
    if(!user) {
        user = await User.create({name: name, email: email});
    }
    const page = await Page.create({title: title, content: content, 
                                    status: status, userId: user.id});
    return Page.findById(page.id, {include: [User]});
};

const generateSlug = (title) => {
    return title.replace(/\s+/g, '_').replace(/\W/g, '');
}

module.exports = {
    sync,
    seed,
    models : {
        User,
        Page
    },
    addPage,
    getAllPages,
    getPageBySlug,
    getAllUsers,
    getUserById
};