// controllers/promptController.js

const { OpenAI } = require('openai');
const { log, LogType } = require('../utils/logger');
const responseRepository = require('../db/repositories/ResponseRepository');
const assignmentRepository = require('../db/repositories/AssignmentRepository');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

module.exports = {
    /**
     * Preprocess preveri bazo in odloči, ali potrebujemo AI analizo.
     */
    preprocess: async function (req, res) {
        log(LogType.INFO, "Prejet zahtevek v preprocess.");

        try {
            const { id, description, timeRemaining } = req.body;

            // Validacija
            if (!id || !description) {
                log(LogType.WARN, "Preprocess: Manjkajoči podatki (id ali description).");
                return res.status(400).json({
                    success: false,
                    message: "Manjka ID naloge ali opis (description)."
                });
            }

            // 1. Preveri, če naloga že obstaja v bazi
            const existingAssignment = await assignmentRepository.findById(id);

            if (existingAssignment) {
                log(LogType.INFO, `Naloga ${id} že obstaja.`);
                return res.json({
                    success: true,
                    source: "database",
                    data: existingAssignment
                });
            }

            // 2. Priprava za 'create'
            log(LogType.INFO, `Naloga ${id} ni v bazi. Pripravljam sporočilo.`);

            // Konstruiramo vsebino za AI
            const fullMessage = `ROK: ${timeRemaining || 'Ni podano'}\n\nNAVODILA:\n${description}`;

            // Nastavimo parametre, ki jih pričakuje tvoja create funkcija
            req.body.message = fullMessage;
            req.body.moodle_id = id;

            // OPOMBA: Če tvoj 'create' nujno potrebuje user_id,
            // ga tukaj pridobi iz seje, npr.: req.body.user_id = req.user.id;

            // 3. Pokličemo create funkcijo
            return module.exports.create(req, res);

        } catch (err) {
            log(LogType.ERROR, `Napaka v preprocess: ${err.message}`);
            return res.status(500).json({ success: false, error: err.message });
        }
    },
    create: async function (req, res) {
        const startTime = Date.now();
        log(LogType.INFO, "Začetek celovite obdelave (Assignment + Response).");

        try {
            // moodle_id pride iz preprocess, description je zdaj v 'message'
            const { message, moodle_id } = req.body;

            // Poskusimo dobiti user_id, če ga ni, nastavimo na null ali privzeto vrednost
            // (Preveri če tvoja baza v tabeli responses dovoljuje user_id = null)
            const user_id = req.body.user_id || (req.user ? req.user.id : null);

            if (!message) {
                log(LogType.WARN, "Create: Manjka vsebina (message).");
                return res.status(400).json({ success: false, message: 'Manjka besedilo naloge' });
            }

            log(LogType.INFO, `Pošiljam na OpenAI za nalogo ID: ${moodle_id}...`);

            const Instructions = `
            You are ProkrastinatorGPT, a smart homework analyzer built into a browser extension for students. You read Moodle assignments and help students understand what they need to do and how to plan their work.
            Return ONLY valid JSON. No markdown fences, no explanation.
            RULES:
            - "naslov": Short 2-4 word title in Slovenian.
            - "opis": 2-4 sentences explaining the goal.
            - "poudarki_opis": highlight important parts (must be substrings of opis).
            - "koraki": 3-7 steps with "besedilo" and "poudarek".
            - "tezavnost": 1-10 integer.
            - "cas_min/cas_max": realistic hours.
        `;

            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: Instructions },
                    { role: "user", content: message },
                ],
                response_format: { type: "json_object" }
            });

            const aiData = JSON.parse(completion.choices[0].message.content);
            log(LogType.SUCCESS, "AI uspešno analiziral nalogo.");

            const stepsAsPlainText = aiData.koraki
                .map((k, index) => `${index + 1}. ${k.besedilo}`)
                .join('\n');

            // --- 1. SHRANJEVANJE V TABELO ASSIGNMENTS ---
            let assignment;
            try {
                assignment = await assignmentRepository.create({
                    id: moodle_id,
                    title: aiData.naslov || "Nova naloga",
                    explanation: aiData.opis,
                    difficulty: aiData.tezavnost,
                    estimated_minutes: (aiData.cas_max || 1) * 60,
                    is_group_project: message.toLowerCase().includes('skupin') || message.toLowerCase().includes('ekipi')
                });
                log(LogType.INFO, "Assignment uspešno shranjen/posodobljen.");
            } catch (dbErr) {
                log(LogType.ERROR, `Napaka pri shranjevanju naloge: ${dbErr.message}`);
                // Če shranjevanje v assignments spodleti, vrnemo vsaj AI podatke, da uporabnik ne čaka zaman
                return res.status(201).json({ success: true, data: aiData, warning: "Database sync failed" });
            }

            // --- 2. SHRANJEVANJE V TABELO RESPONSES ---
            // Uporabimo moodle_id kot referenco. Če user_id ni, shranimo pod "sistemskega" uporabnika (npr. ID 1)
            // ali pa pogojno preskočimo, če baza ne dovoljuje null.
            if (assignment) {
                try {
                    const targetUserId = user_id || 1; // Če ni userja, pripiši "sistemskemu" ID 1

                    await responseRepository.create({
                        user_id: targetUserId,
                        assignment_id: moodle_id,
                        summary_text: aiData.opis,
                        steps_text: stepsAsPlainText,
                        difficulty_assessment: aiData.tezavnost,
                        estimated_minutes: (aiData.cas_max || 1) * 60
                    });
                    log(LogType.SUCCESS, `Response shranjen za uporabnika ${targetUserId}.`);
                } catch (respErr) {
                    // Logiramo napako, a ne ustavimo procesa (user mora dobiti odgovor!)
                    log(LogType.WARN, `Response ni bil shranjen: ${respErr.message}`);
                }
            }

            // Končni uspeh - vrnemo podatke frontendu
            const duration = Date.now() - startTime;
            log(LogType.INFO, `Obdelava končana v ${duration}ms.`);

            return res.status(201).json({
                success: true,
                assignment_id: moodle_id,
                data: aiData
            });

        } catch (err) {
            log(LogType.ERROR, `Kritična napaka v create: ${err.message}`);
            return res.status(500).json({ success: false, error: err.message });
        }
    },

    list: (req, res) => res.json({ message: "List ni implementiran." }),
    show: (req, res) => res.json({ message: "Show ni implementiran." }),
    remove: (req, res) => res.json({ message: "Remove ni implementiran." }),
    update: (req, res) => res.json({ message: "Update ni implementiran." }),
};