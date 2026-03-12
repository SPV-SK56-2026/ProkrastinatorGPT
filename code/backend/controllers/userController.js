// controllers/userController.js

const UserModel = require('../db/repositories/UserRepository');
const bcrypt = require('bcryptjs');
const { log, LogType } = require('../utils/logger');

module.exports = {

    /**
     * userController.list()
     */
    list: async function (req, res) {
        log(LogType.INFO, "Pridobivanje seznama vseh uporabnikov.");
        try {
            const users = await UserModel.getAll();
            log(LogType.SUCCESS, `Uspešno pridobljenih ${users.length} uporabnikov.`);
            res.json(users);
        } catch (err) {
            log(LogType.ERROR, `Napaka pri pridobivanju seznama uporabnikov: ${err.message}`);
            res.status(500).json({ error: err.message });
        }
    },

    /**
     * userController.show()
     */
    show: function (req, res) {
        log(LogType.INFO, "Klicana neimplementirana metoda show (uporabnik).");
        //TO DO
    },

    /**
     * userController.create()
     */
    create: async function (req, res) {
        const { username, email, password } = req.body;
        log(LogType.INFO, `Poskus registracije novega uporabnika: ${email}`);

        if (!username || !email || !password) {
            log(LogType.WARN, "Registracija neuspešna: Manjkajo obvezna polja.");
            return res.status(400).json({ message: 'Missing required fields' });
        }

        try {
            // Preveri, če uporabnik z e-pošto že obstaja
            const existingUser = await UserModel.getByEmail(email);
            if (existingUser) {
                log(LogType.WARN, `Registracija zavrnjena: E-pošta ${email} je že zasedena.`);
                return res.status(409).json({ message: 'Email already registered' });
            }

            // Hashiranje gesla
            log(LogType.INFO, "Generiranje gesla (hashing)...");
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(password, salt);

            // Shranjevanje v bazo
            const newUser = await UserModel.create({
                username,
                email,
                password_hash: hashed
            });

            log(LogType.SUCCESS, `Uporabnik ${username} uspešno ustvarjen z ID: ${newUser.id || 'N/A'}`);
            return res.status(201).json(newUser);
        } catch (err) {
            log(LogType.ERROR, `Napaka pri ustvarjanju uporabnika: ${err.message}`);
            return res.status(500).json({ message: 'Error creating user', error: err });
        }
    },

    /**
     * userController.update()
     */
    update: async function (req, res) {
        const id = req.params.id;
        const { username, email, password } = req.body;
        log(LogType.INFO, `Poskus posodobitve uporabnika z ID: ${id}`);

        try {
            // Preveri, če uporabnik sploh obstaja
            const user = await UserModel.getById(id);
            if (!user) {
                log(LogType.WARN, `Posodobitev neuspešna: Uporabnik z ID ${id} ne obstaja.`);
                return res.status(404).json({ message: 'User not found' });
            }

            const updateData = {};
            if (username) updateData.username = username;
            if (email) updateData.email = email;

            if (password) {
                log(LogType.INFO, "Posodabljanje gesla (hashing)...");
                const salt = await bcrypt.genSalt(10);
                updateData.password_hash = await bcrypt.hash(password, salt);
            }

            if (Object.keys(updateData).length === 0) {
                log(LogType.WARN, "Posodobitev prekinjena: Ni podanih polj za spremembo.");
                return res.status(400).json({ message: 'No fields provided for update' });
            }

            const updatedUser = await UserModel.update(id, updateData);
            log(LogType.SUCCESS, `Uporabnik z ID ${id} uspešno posodobljen.`);

            return res.status(200).json({
                message: 'User updated successfully',
                user: updatedUser
            });

        } catch (err) {
            log(LogType.ERROR, `Napaka pri posodabljanju uporabnika (ID: ${id}): ${err.message}`);
            return res.status(500).json({ message: 'Error updating user', error: err.message });
        }
    },

    /**
     * userController.remove()
     */
    remove: async function (req, res) {
        const id = req.params.id;
        log(LogType.INFO, `Zahtevek za izbris uporabnika z ID: ${id}`);

        try {
            const user = await UserModel.getById(id);
            if (!user) {
                log(LogType.WARN, `Izbris neuspešen: Uporabnik z ID ${id} ne obstaja.`);
                return res.status(404).json({ message: 'User not found' });
            }

            await UserModel.delete(id);
            log(LogType.SUCCESS, `Uporabnik z ID ${id} je bil odstranjen iz sistema.`);

            return res.status(200).json({
                message: `User with ID ${id} successfully deleted.`
            });
        } catch (err) {
            log(LogType.ERROR, `Napaka pri brisanju uporabnika (ID: ${id}): ${err.message}`);
            return res.status(500).json({
                message: 'Error deleting user',
                error: err.message
            });
        }
    },

    showRegister: function(req, res){
        log(LogType.INFO, "Prikaz registracijske strani.");
        //TO DO
    },

    showLogin: function(req, res){
        log(LogType.INFO, "Prikaz prijavne strani.");
        //TO DO
    },

    login: function(req, res, next){
        log(LogType.INFO, `Poskus prijave uporabnika.`);
        //TO DO
    },

    profile: function(req, res,next){
        log(LogType.INFO, "Dostop do profila uporabnika.");
        //TO DO
    },

    logout: function(req, res, next){
        log(LogType.INFO, "Odjava uporabnika.");
        //TO DO
    }
};