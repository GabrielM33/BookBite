import Groq from 'groq-sdk';

// Initialize your Groq client here
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
    try {
        const data = await req.json(); // or req.body depending on your setup

        // Assuming you're making a request to Groq API here
        const response = await groq.request({
            model: 'llama-3.1-70b-versatile',
            prompt: data.prompt,
            max_tokens: 8000 // Ensure this is within allowed limits
        });

        return new Response(JSON.stringify(response), { status: 200 });
    } catch (error) {
        return new Response(error.message, { status: 400 });
    }
}
