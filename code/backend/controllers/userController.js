//var UserModel = // TO DO
const UserModel = require('../db/repositories/UserRepository');
const bcrypt = require('bcryptjs');

module.exports = {

    /**
     * userController.list()
     */
    list: async function (req, res) {
        try {
            const users = await UserModel.getAll();
            res.json(users);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    /**
     * userController.show()
     */
    show: function (req, res) {
        //TO DO
    },

    /**
     * userController.create()
     */
    create: async function (req, res) {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        try {
            // Check if user with this email already exists
            const existingUser = await UserModel.getByEmail(email);
            if (existingUser) {
                return res.status(409).json({ message: 'Email already registered' });
            }

            // Hash the password 
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(password, salt);

           // Save to DB
            const newUser = await UserModel.create({
                username,
                email,
                password_hash: hashed
            });

            return res.status(201).json(newUser);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error creating user', error: err });
        }
    },

    /**
     * userController.update()
     */
    update: function (req, res) {
        //TO DO
    },

    /**
     * userController.remove()
     */
    remove: function (req, res) {
        //TO DO
    },

    showRegister: function(req, res){
        //TO DO
    },

    showLogin: function(req, res){
        //TO DO
    },

    login: function(req, res, next){
        //TO DO
    },

    profile: function(req, res,next){
        //TO DO 
    },

    logout: function(req, res, next){
        //TO DO
    }
};