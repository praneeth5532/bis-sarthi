import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import * as dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const DOCUMENTS_DIR = "./documents";

// 1. Upload local PDFs to the Gemini File API
async function uploadAllPDFs(dirPath) {
  if (!fs.existsSync(dirPath)) {
    throw new Error(`Directory "${dirPath}" not found. Please create it and add your PDFs.`);
  }

  const pdfFiles = fs.readdirSync(dirPath).filter((f) => f.toLowerCase().endsWith(".pdf"));

  if (pdfFiles.length === 0) {
    throw new Error(`No PDF files found inside "${dirPath}".`);
  }

  console.log(`Found ${pdfFiles.length} document(s). Uploading to Gemini...`);
  const uploadedFiles = [];

  for (const file of pdfFiles) {
    const filePath = path.join(dirPath, file);
    const uploaded = await ai.files.upload({
      file: filePath,
      mimeType: "application/pdf",
    });
    console.log(`  Uploaded: ${file}`);
    uploadedFiles.push(uploaded);
  }

  return uploadedFiles;
}

// 2. Query Gemini strictly against the uploaded files
async function askDocuments(uploadedFiles, userQuery) {
  const systemInstruction = `
You are a strict compliance assistant for the Bureau of Indian Standards (BIS).

ANTI-HALLUCINATION RULES:
1. Ground your answers EXCLUSIVELY in the provided PDF documents.
2. If the answer cannot be found in the documents, respond EXACTLY with:
   "I couldn't find sufficient information in the approved BIS knowledge base."
3. Do not extrapolate, guess, or incorporate external training knowledge.
4. When answering, cite the Document Name, Section, or Clause number where the information was found.
  `;

  const contents = [
    ...uploadedFiles.map((file) => ({
      fileData: {
        fileUri: file.uri,
        mimeType: file.mimeType,
      },
    })),
    {
      text: userQuery,
    },
  ];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash", // 3.x series model
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.0, // Eliminates creative variation
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error generating answer:", error);
    return "Error querying the documents.";
  }
}

// 3. Interactive CLI runner
async function startAssistant() {
  try {
    const uploadedDocs = await uploadAllPDFs(DOCUMENTS_DIR);
    console.log("\nAll documents indexed successfully.");
    console.log("Ask any question below (type 'exit' to quit):\n");

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const promptUser = () => {
      rl.question("Ask BIS-Sarthi > ", async (input) => {
        const query = input.trim();
        if (query.toLowerCase() === "exit") {
          rl.close();
          process.exit(0);
        }

        if (query.length > 0) {
          console.log("\nSearching PDFs...");
          const answer = await askDocuments(uploadedDocs, query);
          console.log(`\n${answer}\n`);
          console.log("--------------------------------------------------\n");
        }
        promptUser();
      });
    };

    promptUser();
  } catch (err) {
    console.error("Setup Error:", err.message);
  }
}

startAssistant();