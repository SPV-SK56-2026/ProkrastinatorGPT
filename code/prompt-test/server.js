import express from "express"
import OpenAI from "openai"
import dotenv from "dotenv"

dotenv.config()

const app = express()

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

app.use(express.json())
app.use(express.static("public"))

app.post("/ask", async (req, res) => {

  const { prompt, message } = req.body

  if (!prompt || !message) {
    return res.status(400).json({ error: "Prompt in message sta obvezna." })
  }

  try {

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: message }
      ]
    })

    const raw = completion.choices[0].message.content

    // Izracun cene 
    const usage = completion.usage
    const costUsd = (usage.prompt_tokens * 0.00000015) + (usage.completion_tokens * 0.0000006)

    // Poskusi parsati JSON 
    try {
      const cleaned = raw.replace(/```json|```/g, "").trim()
      const parsed = JSON.parse(cleaned)
      res.json({ reply: raw, parsed, success: true, usage: {
        input_tokens: usage.prompt_tokens,
        output_tokens: usage.completion_tokens,
        total_tokens: usage.total_tokens,
        cost_usd: costUsd
      }})
    } catch {
      res.json({ reply: raw, parsed: null, success: true, usage: {
        input_tokens: usage.prompt_tokens,
        output_tokens: usage.completion_tokens,
        total_tokens: usage.total_tokens,
        cost_usd: costUsd
      }})
    }

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }

})

app.listen(3000, () => {
  console.log("Server running: http://localhost:3000")
})