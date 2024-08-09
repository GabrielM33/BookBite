import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { bookName, author } = await req.json();

  if (!bookName || !author) {
    return NextResponse.json({ message: 'Book name and author are required' }, { status: 400 });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Use a free or available model
      messages: [
        { role: 'system', content: 'You are a helpful assistant that summarizes books.' },
        { role: 'user', content: `Summarize the book "${bookName}" by ${author}.` },
      ],
    });

    const summary = response.choices[0]?.message?.content;

    if (summary) {
      return NextResponse.json({ summary });
    } else {
      return NextResponse.json({ message: 'Failed to generate summary' }, { status: 500 });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Handle known Error type
      console.error('Error generating summary:', error.message);
      return NextResponse.json({ message: `Error generating summary: ${error.message}` }, { status: 500 });
    } else {
      // Handle unexpected errors
      console.error('Unexpected error:', error);
      return NextResponse.json({ message: 'Unexpected error occurred' }, { status: 500 });
    }
  }
}