export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: req.body.messages.map(m => ({
          role: m.role,
          content: typeof m.content === "string"
            ? m.content
            : m.content[0]?.text || ""
        })),
        max_tokens: 1000,
      }),
    });

    const data = await response.json();

    res.json({
      content: [{
        type: "text",
        text: data.choices?.[0]?.message?.content || "No response received."
      }]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}