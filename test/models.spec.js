const expect = require("chai").expect;
const db = require("../models");
const { User, Page} = db.models;

describe('Models', () => {
    beforeEach(() => {
        return db.sync()
                 .then(() => db.seed());
    });
    describe('Users', () => {
        it('getAllUsers gets all users', () => {
            return db.getAllUsers()
                    .then(response => expect(response.length).to.equal(3));
        });
        it('User1 has 3 pages', () => {
            return User.findOne({
                            where:   {name: 'User1'},
                            include: [Page]
                        })
                        .then(user => expect(user.pages.length).to.equal(3));
        });
        it('User2 has 2 pages', () => {
            return User.findOne({
                            where:   {name: 'User2'},
                            include: [Page]
                        })
                        .then(user => expect(user.pages.length).to.equal(2));
        });
        it('User3 has 0 pages', () => {
            return User.findOne({
                            where:   {name: 'User3'},
                            include: [Page]
                        })
                        .then(user => expect(user.pages.length).to.equal(0));
        });
        it('getUserById gets user by id', () => {
            return db.getUserById(3)
                    .then(response => expect(response.name).to.equal("User3"));
        });
    });
    describe('Pages', () => {
        it('getAllPages gets all the pages', () => {
            return db.getAllPages()
                       .then(response => expect(response.length).to.equal(5));
        });
        it('getPageBySlug gets page for given slug', () => {
            return db.getPageBySlug("Page_5")
                       .then(response => {
                           expect(response.slug).to.equal("Page_5");
                           expect(response.title).to.equal("Page 5");
                        });
        });
        it('Page1 is by User1', () => {
            return Page.findOne({
                            where:   {title: "Page1" },
                            include: [User]
                    })
                    .then(page => expect(page.user.name).to.equal("User1"));
        });
        it('addPage adds a new Page for existing user', async () => {
            const page = await db.addPage("Test Title", "Test Content", "open", "User1", "User1@email.com");
            expect(page.get().id).to.equal(6);
            expect(page.get().title).to.equal("Test Title");
        });
        it('addPage adds a new Page and creates a new user if user does not exist', async () => {
            const page = await db.addPage("Test Title", "Test Content", "open", "User4", "User4@email.com");
            expect(page.get().id).to.equal(6);
            expect(page.get().title).to.equal("Test Title");
            const user = await User.findOne({ where:   {name: 'User4'}});
            expect(user.id).to.equal(4);
            expect(user.name).to.equal("User4");
        });
    });    
});