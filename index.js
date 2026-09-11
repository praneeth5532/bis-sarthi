/* global process */
import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
You are an AI assistant for Indian Standards and BIS Services.
Answer the user's question using ONLY the provided CONTEXT.

CRITICAL RULES:
1. Grounding: Answer strictly using facts found in the context. Never guess, assume, or fabricate standards or rules.
2. Safeguard: If the answer is not clearly present in the context, do NOT attempt to answer. Respond ONLY with:
   "I couldn't find sufficient information in the approved BIS knowledge base."
3. Sources: Always end your answer with a "Sources:" section listing each source file and page used, formatted exactly like:
   Sources:
   - filename.pdf - Page X
`;

async function generateAnswer(userQuestion, contextChunks) {
  let formattedContext = "";
  for (const chunk of contextChunks) {
    formattedContext += `[${chunk.file}, page ${chunk.page}]\n"${chunk.text}"\n\n`;
  }

  const prompt = `USER QUESTION:
"${userQuestion}"

CONTEXT:
${formattedContext}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    return response.text;
  } catch (err) {
    return `Error: ${err.message}`;
  }
}

async function runTests() {
  const mockChunks = [
    {
      file: "helmet_product_manual.pdf",
      page: 1,
      text: "Protective helmets for two-wheeler riders are covered under Indian Standard IS 4151:2015.",
    },
    {
      file: "helmet_quality_control_order_2020.pdf",
      page: 2,
      text: "BIS certification is mandatory under the applicable Quality Control Order for all helmets manufactured or imported into India.",
    },
  ];

  const testQuestions = [
    { id: "Q1", question: "What standard applies to motorcycle helmets?" },
    { id: "Q2", question: "Is BIS certification mandatory?" },
    { id: "Q3", question: "What does IS 4151 cover?" },
    { id: "Q4 (Safeguard)", question: "What is the BIS standard for electric flying skateboards?" },
  ];

  for (const t of testQuestions) {
    console.log(`\n========================================`);
    console.log(`RUNNING ${t.id}: ${t.question}`);
    console.log(`----------------------------------------`);
    const answer = await generateAnswer(t.question, mockChunks);
    console.log(answer);
  }
}

runTests();
