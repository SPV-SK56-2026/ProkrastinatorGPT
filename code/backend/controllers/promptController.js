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

                // Pridobi tudi korake iz tabele responses
                const responses = await responseRepository.getByAssignmentId(id);
                const responseData = responses.length > 0 ? responses[0] : null;

                // Če koraki manjkajo (response ni bil shranjen), ponovno analiziraj z AI
                if (!responseData || !responseData.steps_text) {
                    log(LogType.INFO, `Naloga ${id} nima korakov v bazi. Ponovna AI analiza.`);
                    const fullMessage = `ROK: ${timeRemaining || 'Ni podano'}\n\nNAVODILA:\n${description}`;
                    req.body.message = fullMessage;
                    req.body.assignment_id = id;
                    return module.exports.create(req, res);
                }

                return res.json({
                    success: true,
                    source: "database",
                    data: {
                        ...existingAssignment,
                        steps_text: responseData.steps_text
                    }
                });
            }

            // 2. Priprava za 'create'
            log(LogType.INFO, `Naloga ${id} ni v bazi. Pripravljam sporočilo.`);

            // Konstruiramo vsebino za AI
            const fullMessage = `ROK: ${timeRemaining || 'Ni podano'}\n\nNAVODILA:\n${description}`;

            // Nastavimo parametre za 'create' - ključno: uporabimo 'id' iz req.body
            req.body.message = fullMessage;
            req.body.assignment_id = id;

            // 3. Pokličemo create funkcijo
            return module.exports.create(req, res);

        } catch (err) {
            log(LogType.ERROR, `Napaka v preprocess: ${err.message}`);
            return res.status(500).json({ success: false, error: err.message });
        }
    },

    create: async function (req, res) {
        log(LogType.INFO, "Začetek celovite obdelave (Assignment + Response).");

        try {
            const { message, assignment_id } = req.body;

            // Če user_id ni podan, nastavimo na null ali privzeto vrednost 1
            const user_id = req.body.user_id || (req.user ? req.user.id : 1);

            if (!message || !assignment_id) {
                return res.status(400).json({ success: false, message: 'Manjkajo podatki za obdelavo (message ali assignment_id)' });
            }

            log(LogType.INFO, `Pošiljam na OpenAI za nalogo ID: ${assignment_id}...`);

            const Instructions = `
            You are ProkrastinatorGPT, a smart homework analyzer built into a browser extension for students. You read Moodle assignments and help students understand what they need to do and how to plan their work.

Return ONLY valid JSON. No markdown fences, no explanation.

EXAMPLE OUTPUT:
{
  "naslov": "Organizacijski diagram",
  "opis": "Naloga zahteva <b>izdelavo organizacijskega diagrama</b> podjetja, ki prikazuje strukturo in naloge posameznikov ali oddelkov. Priložiti je treba <b>log chata</b>, ki dokazuje, da so vsi člani ekipe <b>sodelovali in oddali isto datoteko</b>.",
  "koraki": [
    { "besedilo": "Zbrati <b>informacije o strukturi podjetja</b> in nalogah oddelkov." },
    { "besedilo": "Izdelati <b>organizacijski diagram</b> s hierarhijo in odgovornostmi." },
    { "besedilo": "Uskladiti vsebino z <b>vsemi člani ekipe</b>." },
    { "besedilo": "Posneti <b>log chata</b> kot dokaz sodelovanja." },
    { "besedilo": "Oddati <b>diagram in log chata</b> v skupni datoteki." }
  ],
  "tezavnost": 4,
  "cas_min": 2,
  "cas_max": 3
}

RULES:
- "naslov": Short 2-4 word title in Slovenian.
- "opis": 2-4 sentences explaining the real goal. Summarize WHAT must be done, WITH WHAT tools/format, and WHAT must be submitted.
- "koraki": 3-7 steps, each starting with an action verb.
- "poudarek": EXACT substring of its "besedilo" — the most meaningful phrase (action + object), e.g. "Zbrati informacije" or "Oddati diagram in log chata". Not just a single verb.
- "tezavnost": 1-10 integer, based on time needed to complete (1 < 30min, 5 = ~4/5h, 10 = semester-long project (weeks of work)). Tasks requiring physical infrastructure (SSH, network config, multiple machines) = minimum 6.
- "cas_min/cas_max": realistic hours (research + doing + reviewing). cas_max - cas_min must not exceed 6 (For semester long projects must not exceed 20).
- "motivacija": only if this is a group assignment — add EXACTLY 3 DISTINCT, humorous and sharp insults in Slovenian for a "nerdy" student who started way too early (long before the deadline). The insults should tease them for being too diligent or having no life. Severity matches tezavnost: 1-3 = light teasing, 4-6 = harsh, 7+ = brutal (nerd-shaming). Omit this field entirely for individual assignments.
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
            log(LogType.INFO, `AI data: ${JSON.stringify(aiData, null, 2)}`);

            const stepsAsPlainText = aiData.koraki
                .map((k, index) => `${index + 1}. ${k.besedilo}`)
                .join('\n');

            const isGroup = aiData.motivacija ? true : message.toLowerCase().includes('skupin') || message.toLowerCase().includes('ekipi');


            // --- 1. SHRANJEVANJE V TABELO ASSIGNMENTS ---
            try {
                await assignmentRepository.create({
                    id: assignment_id, // Uporabimo ID, ki ga je preprocess prejel iz req.body.id
                    title: aiData.naslov || "Nova naloga",
                    explanation: aiData.opis,
                    difficulty: aiData.tezavnost,
                    estimated_minutes: (aiData.cas_max || 1) * 60,
                    is_group_project: isGroup
                });
                log(LogType.SUCCESS, "Assignment shranjen.");
            } catch (dbErr) {
                log(LogType.ERROR, `Napaka pri shranjevanju Assignment: ${dbErr.message}`);
                // Nadaljujemo, ker morda naloga že obstaja
            }

            // --- 2. SHRANJEVANJE V TABELO RESPONSES ---
            try {

                await responseRepository.create({
                    user_id: user_id,
                    assignment_id: assignment_id, // Isti ID kot zgoraj, da zadostimo FK pogoju
                    summary_text: aiData.opis,
                    steps_text: stepsAsPlainText,
                    difficulty_assessment: aiData.tezavnost,
                    estimated_minutes: (aiData.cas_max || 1) * 60
                });
                log(LogType.SUCCESS, "Response shranjen.");
            } catch (respErr) {
                log(LogType.ERROR, `Response ni bil shranjen: ${respErr.message}`);
            }

            return res.status(201).json({
                success: true,
                assignment_id: assignment_id,
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