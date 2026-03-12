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
    update: async function (req, res) {
        const id = req.params.id;
        const { username, email, password } = req.body;

        try {
            // Check if user exists
            const user = await UserModel.getById(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Prepare the update object
            const updateData = {};
            // Check if username was provided for change
            if (username) updateData.username = username;
            // Check if email was provided for change
            if (email) updateData.email = email;

            // Password hashing if changed
            if (password) {
                const salt = await bcrypt.genSalt(10);
                updateData.password_hash = await bcrypt.hash(password, salt);
            }

            // Check if there is actually anything to update
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ message: 'No fields provided for update' });
            }

            // Perform the update
            const updatedUser = await UserModel.update(id, updateData);

            return res.status(200).json({
                message: 'User updated successfully',
                user: updatedUser
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error updating user', error: err.message });
        }
    },

    /**
     * userController.remove()
     */
    remove: async function (req, res) {
        const id = req.params.id;

        try {
            // Check if the user exists first
            const user = await UserModel.getById(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Delete the user
            await UserModel.delete(id);

            // Return status
            return res.status(200).json({ 
                message: `User with ID ${id} successfully deleted.` 
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ 
                message: 'Error deleting user', 
                error: err.message 
            });
        }
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