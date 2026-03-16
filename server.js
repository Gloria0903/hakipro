const express = require('express');
const cors    = require('cors');

const app  = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.post('/api/claude', async (req, res) => {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: req.body.messages.map(m => ({
          role:    m.role,
          content: typeof m.content === 'string' ? m.content : m.content[0]?.text || ''
        })),
        max_tokens: 1000,
      }),
    });
    const data = await response.json();
    // Format response to match Anthropic shape the app expects
    res.json({
      content: [{
        type: 'text',
        text: data.choices?.[0]?.message?.content || 'No response received.'
      }]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`HakiPro proxy running on http://localhost:${PORT}`);
});