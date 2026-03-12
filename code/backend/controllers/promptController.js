// controllers/promptController.js

const { OpenAI } = require('openai');
const { log, LogType } = require('../utils/logger');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_AI_KEY,
});

module.exports = {

    create: async function (req, res) {
        const startTime = Date.now();
        log(LogType.INFO, "Prejet nov zahtevek za analizo navodil.");

        try {
            const { message } = req.body;

            if (!message) {
                log(LogType.WARN, "Prejeto prazno besedilo naloge (400 Bad Request).");
                return res.status(400).json({
                    success: false,
                    message: 'Manjka besedilo naloge'
                });
            }

            log(LogType.INFO, `Pošiljam podatke na OpenAI (vhod: ${message.length} znakov)...`);

            const Instructions = `
                You are ProkrastinatorGPT, a smart homework analyzer built into a browser extension for Slovenian students. You read Moodle assignments and help students understand what they need to do and how to plan their work.

                Return ONLY valid JSON. No markdown fences, no explanation, nothing before or after.
                
                EXAMPLE OUTPUT:
                {
                    "opis": "Naloga zahteva izdelavo organizacijskega diagrama podjetja, ki prikazuje strukturo in naloge posameznikov ali oddelkov. Priložiti je treba log chata, ki dokazuje, da so vsi člani ekipe sodelovali.",
                    "poudarki_opis": ["organizacijskega diagrama", "log chata"],
                    "koraki": [
                    { "besedilo": "Zbrati informacije o strukturi podjetja in nalogah oddelkov.", "poudarek": "informacije o strukturi podjetja" },
                    { "besedilo": "Izdelati organizacijski diagram s hierarhijo in odgovornostmi.", "poudarek": "organizacijski diagram" },
                    { "besedilo": "Sodelovati v ekipi in se dogovoriti o vsebini diagrama.", "poudarek": "Sodelovati v ekipi" },
                    { "besedilo": "Zabeležiti log chata kot dokaz aktivnega sodelovanja.", "poudarek": "log chata" },
                    { "besedilo": "Oddati diagram in log chata v skupni datoteki.", "poudarek": "skupni datoteki" }
                    ],
                    "tezavnost": 4,
                    "cas_min": 2,
                    "cas_max": 3
                }

                RULES:
                - "opis": 2-3 sentences in Slovenian explaining the real goal.
                - "poudarki_opis": 2-3 strings — EXACT substrings of "opis", copy-pasted character for character. UI shows them ORANGE.
                - "koraki": 3-6 steps, each starting with an action verb.
                - "poudarek": EXACT substring of its own "besedilo", copy-pasted character for character. UI shows it BLUE.
                - "tezavnost": 1-10 integer.
                - "cas_min/cas_max": realistic hours (research + doing + reviewing).
                - Write in Slovenian.
            `;

            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: Instructions },
                    { role: "user", content: message },
                ],
                response_format: { type: "json_object" }
            });

            const duration = (Date.now() - startTime) / 1000;
            log(LogType.SUCCESS, `OpenAI odgovoril v ${duration}s.`);

            const aiData = JSON.parse(completion.choices[0].message.content);
            log(LogType.INFO, "Analiza uspešno poslana uporabniku.");

            return res.status(201).json({
                success: true,
                data: aiData
            });

        } catch (err) {
            log(LogType.ERROR, `Napaka v promptController: ${err.message}`);
            return res.status(500).json({
                success: false,
                message: "Napaka pri komunikaciji z AI",
                error: err.message
            });
        }
    },

    list: function (req, res) {
        log(LogType.INFO, "Klicana neimplementirana metoda list.");
        return res.json({ message: "List ni implementiran." });
    },

    show: function (req, res) {
        log(LogType.INFO, "Klicana neimplementirana metoda show.");
        return res.json({ message: "Show ni implementiran." });
    },

    remove: function (req, res) {
        log(LogType.INFO, "Klicana neimplementirana metoda remove.");
        return res.json({ message: "Remove ni implementiran." });
    },

    update: function (req, res) {
        log(LogType.INFO, "Klicana neimplementirana metoda update.");
        return res.json({ message: "Update ni implementiran." });
    },

};