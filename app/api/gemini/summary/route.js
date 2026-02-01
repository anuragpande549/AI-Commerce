import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, description, features } = await req.json();

    const prompt = `
Summarize this product for an e-commerce buyer in 3 short bullet points.
Be clear, persuasive, and friendly.

Product Name: ${name}
Description: ${description}
Features: ${features?.join(", ")}
`;

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await res.json();

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Unable to generate summary.";

    return NextResponse.json({ summary: text });
  } catch (error) {
    console.error("Gemini error:", error);
    return NextResponse.json(
      { error: "Gemini summary failed" },
      { status: 500 }
    );
  }
}
