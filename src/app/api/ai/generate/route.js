import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { handler } from "../../auth/[...nextauth]/route";

export async function POST(req) {
  // 1. Check Authentication (Optional: Allow guests for now if needed, but safer to require auth)
  // const session = await getServerSession(handler);
  // if (!session) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  try {
    const { prompt } = await req.json();

    // 2. Alternative: Use Groq (Llama 3) if available (Much higher limits)
    if (process.env.GROQ_API_KEY) {
        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messages: [{ role: "user", content: prompt }],
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.7
                })
            });
            
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error?.message || "Groq API error");
            }

            const data = await response.json();
            return NextResponse.json({ result: data.choices[0].message.content });
        } catch (groqError) {
            console.error("Groq Error:", groqError);
            return NextResponse.json({ error: `Groq Error: ${groqError.message}` }, { status: 500 });
        }
    }

    // 3. Default: Use Gemini (gemini-1.5-flash recommended for high limits)
    // NOTE: If getting 429 quota errors, create a NEW API KEY in a NEW PROJECT to get standard 1500 req/day limits.
    if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json({ error: "No API Key configured. Set GROQ_API_KEY or GEMINI_API_KEY." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Standard high-limit model

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: `AI Generation Failed: ${error.message}. Try getting a new API key or switching to Groq.` }, { status: 500 });
  }
}
