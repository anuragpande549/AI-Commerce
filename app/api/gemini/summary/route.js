import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, description, features, price } = await req.json();

    // We ask Gemini to return strictly formatted JSON
    const prompt = `
      You are an expert product reviewer. Analyze this product and provide helpful advice.
      
      Product: ${name}
      Price: ${price}
      Description: ${description}
      Features: ${features?.join(", ")}

      Return a VALID JSON object (no markdown formatting) with these exact keys:
      {
        "summary": "A 2-sentence quick summary of what this is.",
        "pros": ["Pro 1", "Pro 2", "Pro 3"],
        "cons": ["Con 1", "Con 2"],
        "whyBuy": "A persuasive reason why this specific product is worth the money."
      }
    `;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await res.json();
    
    // Extract text and clean it up to ensure it is valid JSON
    let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    
    // Remove markdown code blocks if Gemini adds them (e.g. ```json ... ```)
    rawText = rawText.replace(/```json|```/g, "").trim();

    const aiResponse = JSON.parse(rawText);

    return NextResponse.json(aiResponse);

  } catch (error) {
    console.error("Gemini Summary Error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}