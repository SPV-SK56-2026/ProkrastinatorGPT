const BugModel = require('../db/repositories/BugRepository');
const { log, LogType } = require('../utils/logger');

module.exports = {

    list: async function (req, res) {
        log(LogType.INFO, "Pridobivanje seznama vseh prijavljenih napak.");
        try {
            let bugs;
            if (req.query.user_id) {
                bugs = await BugModel.getByUserId(req.query.user_id);
            } else if (req.query.status) {
                bugs = await BugModel.getByStatus(req.query.status);
            } else if (req.query.priority) {
                bugs = await BugModel.getByPriority(req.query.priority);
            } else {
                bugs = await BugModel.getAll();
            }

            log(LogType.SUCCESS, `Uspe\u0161no pridobljenih ${bugs.length} napak.`);
            res.json(bugs);
        } catch (err) {
            log(LogType.ERROR, `Napaka pri pridobivanju seznama napak: ${err.message}`);
            res.status(500).json({ error: err.message });
        }
    },

    show: async function (req, res) {
        const id = req.params.id;
        log(LogType.INFO, `Zahtevek za pridobitev napake z ID: ${id}`);
        try {
            const bug = await BugModel.getById(id);
            if (!bug) {
                log(LogType.WARN, `Napaka z ID ${id} ni bila najdena.`);
                return res.status(404).json({ message: 'Bug not found' });
            }
            res.json(bug);
        } catch (err) {
            log(LogType.ERROR, `Napaka pri pridobivanju napake (${id}): ${err.message}`);
            res.status(500).json({ error: err.message });
        }
    },

    create: async function (req, res) {
        const { user_id, title, description, status, priority } = req.body;
        log(LogType.INFO, `Poskus ustvarjanja nove napake: ${title || '(brez naslova)'}`);

        if (!title || !description) {
            log(LogType.WARN, "Neuspeh create: manjkajo obvezna polja.");
            return res.status(400).json({ message: 'Missing required fields' });
        }

        try {
            const newBug = await BugModel.create({
                user_id,
                title,
                description,
                status,
                priority,
            });

            log(LogType.SUCCESS, `Napaka ustvarjena z ID: ${newBug.id}`);
            return res.status(201).json(newBug);
        } catch (err) {
            log(LogType.ERROR, `Napaka pri ustvarjanju napake: ${err.message}`);
            res.status(500).json({ error: err.message });
        }
    },

    update: async function (req, res) {
        const id = req.params.id;
        log(LogType.INFO, `Poskus posodobitve napake z ID: ${id}`);
        const { user_id, title, description, status, priority } = req.body;

        const updateData = {};
        if (user_id !== undefined) updateData.user_id = user_id;
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (status !== undefined) updateData.status = status;
        if (priority !== undefined) updateData.priority = priority;

        if (Object.keys(updateData).length === 0) {
            log(LogType.WARN, "Posodobitev preklicana: Ni podanih polj.");
            return res.status(400).json({ message: 'No fields provided for update' });
        }

        try {
            const bug = await BugModel.getById(id);
            if (!bug) {
                log(LogType.WARN, `Posodobitev neuspe\u0161na: Bug z ID ${id} ne obstaja.`);
                return res.status(404).json({ message: 'Bug not found' });
            }

            const updated = await BugModel.update(id, updateData);
            log(LogType.SUCCESS, `Bug z ID ${id} uspe\u0161no posodobljen.`);
            res.json(updated);
        } catch (err) {
            log(LogType.ERROR, `Napaka pri posodabljanju napake (${id}): ${err.message}`);
            res.status(500).json({ error: err.message });
        }
    },

    remove: async function (req, res) {
        const id = req.params.id;
        log(LogType.INFO, `Zahtevek za izbris napake z ID: ${id}`);
        try {
            const bug = await BugModel.getById(id);
            if (!bug) {
                log(LogType.WARN, `Izbris neuspe\u0161en: Bug z ID ${id} ne obstaja.`);
                return res.status(404).json({ message: 'Bug not found' });
            }

            await BugModel.delete(id);
            log(LogType.SUCCESS, `Bug z ID ${id} je bil odstranjen.`);
            return res.json({ message: 'Bug deleted successfully' });
        } catch (err) {
            log(LogType.ERROR, `Napaka pri brisanju napake (${id}): ${err.message}`);
            res.status(500).json({ error: err.message });
        }
    },
};