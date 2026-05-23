import { NextResponse } from 'next/server';
import stadiumContext from '../../../lib/stadium_context.json';

export async function POST(req: Request) {
  try {
    const { prompt, liveTelemetry } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey || apiKey.trim() === '') {
      return new NextResponse("AI Offline: API Key not configured on host server.", { status: 500 });
    }

    const fullPrompt = `You are a helpful Sentient Stadium AI assistant.
Here is the static rules and context: ${JSON.stringify(stadiumContext)}
Here is the real-time gate telemetry (wait times and crowd deltas): ${JSON.stringify(liveTelemetry)}
Based on this, answer the user's prompt: ${prompt}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: fullPrompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error details:", errorText);
      return new NextResponse(`AI Concierge offline (Gemini Error: ${response.status})`, { status: response.status });
    }

    const data = await response.json();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!answer) {
      return new NextResponse("AI Concierge: Could not parse response parts.", { status: 500 });
    }

    return NextResponse.json({ text: answer });
  } catch (err: any) {
    console.error("API Route Error:", err);
    return new NextResponse("AI offline, routing active. Please check the venue map manually for crowd levels.", { status: 500 });
  }
}
