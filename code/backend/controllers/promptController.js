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
            const { message, moodle_id } = req.body;

            // Če user_id ni podan, nastavimo na null ali privzeto vrednost 1
            const user_id = req.body.user_id || (req.user ? req.user.id : 1);

            if (!message) {
                return res.status(400).json({ success: false, message: 'Manjka besedilo naloge' });
            }

            log(LogType.INFO, `Pošiljam na OpenAI za nalogo ID: ${moodle_id}...`);

            const Instructions = `
            You are ProkrastinatorGPT, a smart homework analyzer built into a browser extension for students. You read Moodle assignments and help students understand what they need to do and how to plan their work.

Return ONLY valid JSON. No markdown fences, no explanation.

EXAMPLE OUTPUT:
{
  "naslov": "Izdelava organizacijskega diagrama",
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
- "naslov": Short 2-4 word title in Slovenian.
- "opis": 2-4 sentences explaining the real goal. Summarize WHAT must be done, WITH WHAT tools/format, and WHAT must be submitted.
- "poudarki_opis": highlight EVERYTHING important — what the task requires, how to do it, and what to submit. Each key requirement gets its own highlight. All must be EXACT substrings of "opis".
- "koraki": 3-7 steps, each starting with an action verb.
- "poudarek": EXACT substring of its "besedilo" — the most meaningful phrase (action + object), e.g. "Zbrati informacije" or "Oddati diagram in log chata". Not just a single verb.
- "tezavnost": 1-10 integer, based on time needed to complete (1 < 30min, 5 = ~4/5h, 10 = semester-long project (weeks of work)). Tasks requiring physical infrastructure (SSH, network config, multiple machines) = minimum 6.
- "cas_min/cas_max": realistic hours (research + doing + reviewing). cas_max - cas_min must not exceed 6 (For semester long projects must not exceed 20).
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
            let newAssignment;
            try {
                newAssignment = await assignmentRepository.create({
                    id: moodle_id,
                    title: aiData.naslov || "Nova naloga",
                    explanation: aiData.opis,
                    difficulty: aiData.tezavnost,
                    estimated_minutes: (aiData.cas_max || 1) * 60,
                    is_group_project: message.toLowerCase().includes('skupin') || message.toLowerCase().includes('ekipi')

                });
                log(LogType.SUCCESS, "Assignment shranjen.");
            } catch (dbErr) {
                log(LogType.ERROR, `Napaka pri shranjevanju Assignment: ${dbErr.message}`);
                // Fallback: če baza ne uspe shraniti, ustvarimo objekt z ID-jem ročno za nadaljevanje
                newAssignment = { id: moodle_id };
            }

            // --- 2. SHRANJEVANJE V TABELO RESPONSES ---
            // Ne smemo failat, če ni user_id ali če response repository javi napako
            try {
                await responseRepository.create({
                    user_id: user_id, // Če je null, bo uporabil tisto, kar dovoljuje baza (ali 1)
                    assignment_id: moodle_id,
                    summary_text: aiData.opis,
                    steps_text: stepsAsPlainText,
                    difficulty_assessment: aiData.tezavnost,
                    estimated_minutes: (aiData.cas_max || 1) * 60
                });
                log(LogType.SUCCESS, "Response shranjen.");
            } catch (respErr) {
                log(LogType.WARN, `Response ni bil shranjen (vseeno nadaljujem): ${respErr.message}`);
            }

            return res.status(201).json({
                success: true,
                assignment_id: moodle_id,
                data: aiData
            });

        } catch (err) {
            log(LogType.ERROR, `Kritična napaka: ${err.message}`);
            return res.status(500).json({ success: false, error: err.message });
        }
    },

    list: (req, res) => res.json({ message: "List ni implementiran." }),
    show: (req, res) => res.json({ message: "Show ni implementiran." }),
    remove: (req, res) => res.json({ message: "Remove ni implementiran." }),
    update: (req, res) => res.json({ message: "Update ni implementiran." }),
};