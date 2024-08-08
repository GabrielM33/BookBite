import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { bookName, author } = req.body;

  if (!bookName || !author) {
    return res.status(400).json({ message: 'Book name and author are required' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4', // Ensure the model name is correct
      messages: [
        { role: 'system', content: 'You are a helpful assistant that summarizes books.' },
        { role: 'user', content: `Summarize the book "${bookName}" by ${author}.` },
      ],
    });

    const summary = response.choices[0]?.message?.content;

    if (summary) {
      return res.status(200).json({ summary });
    } else {
      return res.status(500).json({ message: 'Failed to generate summary' });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error generating summary:', error.message);
      return res.status(500).json({ message: 'Error generating summary' });
    } else {
      console.error('Unexpected error:', error);
      return res.status(500).json({ message: 'Unexpected error occurred' });
    }
  }
}