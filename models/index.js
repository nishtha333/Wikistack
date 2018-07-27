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
                            Page.create({title: "Page1", slug: "page1", content: "Page1 Content", status: 'open', userId: user1.id}),
                            Page.create({title: "Page2", slug: "page2", content: "Page2 Content", status: 'open', userId: user1.id}),
                            Page.create({title: "Page3", slug: "page3", content: "Page3 Content", status: 'closed', userId: user1.id}),
                            Page.create({title: "Page4", slug: "page4", content: "Page4 Content", status: 'open', userId: user2.id}),
                            Page.create({title: "Page5", slug: "page5", content: "Page5 Content", status: 'open', userId: user2.id}),
                        ]);
                  });
};

const getAllUsers = () => {
    return User.findAll({});
}

const getUserById = (id) => {
    return User.findOne({where: {id:id }, include: [Page]});
}

const getAllPages = () => {
    return Page.findAll({});
}

const getPageBySlug = (slug) => {
    return Page.findOne({where: {slug: slug}, include: [User]});
}

const addPage = async (title, content, status, name, email)  => {
    const slug = generateSlug(title); //TODO: As a hook (BeforeValidate)
    let user = await User.findOne({
        where: {name: name, email: email}
    });
    if(!user) {
        user = await User.create({name: name, email: email});
    }
    const page = await Page.create({title: title, slug: slug, content: content, 
                                    status: status, userId: user.id});
    return page;
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