import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Knowledge base grounded strictly in the official BIS standards & product manuals
const BIS_KNOWLEDGE_BASE = `
1. HELMETS FOR TWO-WHEELER RIDERS:
- Standard: IS 4151:2015 / Quality Control Order 2020.
- Scope: Protective helmets for riders of two-wheeled motor vehicles.
- Requirements: Mandatory ISI Mark under Scheme-I of Schedule-II. Peripheral vision must be minimum 105 degrees. Chin strap retention width minimum 20 mm. Subject to dynamic impact and penetration tests.

2. SAFETY OF TOYS:
- Order: Toys (Quality Control) Order, 2020 (Effective 01.09.2020).
- Scope: Any product or material designed or clearly intended for use in play by children under 14 years of age.
- Primary Standards:
  * Non-Electric Toys: IS 9873 (Part 1):2019 (Mechanical and physical properties).
  * Electric Toys: IS 15644:2006 (Electric safety, power input, heating, battery/transformer layout).
- Secondary Standards:
  * IS 9873 (Part 2):2017 - Flammability.
  * IS 9873 (Part 3):2020 - Migration of certain elements (Sb, As, Ba, Cd, Cr, Pb, Hg, Se).
  * IS 9873 (Part 4):2017 - Swings, slides, and activity toys for indoor/outdoor domestic use.
  * IS 9873 (Part 7):2017 - Finger paints (limits for primary aromatic amines, impurities, pH, preservatives).
  * IS 9873 (Part 9):2017 - Certain phthalates esters (DBP, BBP, DEHP, DNOP, DINP, DIDP) in vinyl parts.
- Grouping: 7 categories (A through G) and 146 sub-categories. Sample size for testing: 3-10 pieces.

3. INSULATED FLASK FOR DOMESTIC USE:
- Standard: IS 17790:2022 / Quality Control Order 2024.
- Raw Materials:
  * Inner container: Stainless steel Grade 304 or higher of IS 5522.
  * Outer container (if steel): Grade N2 of IS 15997 or Grade 304 or higher of IS 5522.
  * Welding electrode: Grade 308 or higher of IS 5856.
- Classifications: Wide Mouth (>45 mm) vs Narrow Mouth (<=45 mm); Group A (<=1000 ml) vs Group B (>1000 ml).
- Testing Parameters: Heat retention (tested at 1h, 6h, 12h, and 24h), Cold retention, Leakage, Joint leakage, Stability (10 degree plane), Pour test, Handle fixing strength. Sample size: 8 Nos.

4. DOMESTIC STAINLESS STEEL VACUUM FLASK / BOTTLE:
- Standard: IS 17526:2021 / Quality Control Order 2024.
- Scope: Double-walled stainless steel vacuum insulated bottles/flasks.
- Classifications: Wide mouth (>45 mm) and Narrow mouth (<=45 mm); Group A (<=1000 ml) and Group B (>1000 ml).
- Key Tests: Heat retention (1h, 6h, 12h, 24h), Cold retention (6h, 12h, 24h), Drop impact test, Pendulum impact test, Handle fixing strength (>6x filled mass), Shoulder strap strength (>10x filled mass), Cord strength (3x water capacity mass), O-ring/Washer endurance test. Sample size: 8 Flasks.

5. POTABLE WATER BOTTLES (METALLIC):
- Standard: IS 17803:2022.
- Raw Materials:
  * Copper: Conforming to IS 191 (Cu-ETP, Cu-FRHC, Cu-CATH-2), minimum thickness 0.5 mm.
  * Stainless Steel: Conforming to Grade N1, N2 (IS 15997 / IS 6911), Grade 304 series (IS 5522 / IS 6911), or 316/316L (IS 6911), minimum thickness 0.4 mm.
  * Aluminum: Grade 19000, 19500, or 31000 of IS 737.
  * Gaskets/Washers: Food grade silicone (IS 3565).
  * Welding electrode: Grade 308L as per IS 5856.
- Key Tests: Capacity, Impact resistance, Leakage, Stability, Air pressure test (for aluminum), Load test, Sensorial/Leaching tests for N1/N2 grades, Potability test as per IS 10500. Sample size: 3-4 Nos.

6. PLASTIC BOTTLES / CONTAINERS FOR PACKAGED WATER:
- Standard: IS 15410:2003.
- Permissible Materials: Polyethylene (PE), Polyvinyl Chloride (PVC), Polyethylene Terephthalate (PET), Polybutylene Terephthalate (PBT), Polypropylene (PP), Polycarbonate, Polystyrene.
- Key Tests: Transparency (light transmittance integration ball method), Wall thickness (Top, Middle, Bottom), Closure leakage, Vibration leakage (IS 2798), Air pressure leakage, Drop test (0.5m/1.0m/1.2m), Overall Migration test (IS 9845), Water potability test. Sample size: 10 Filled + 6 Empty + 30 Caps.
`;

export async function askBIS(userQuery) {
  const prompt = `
You are a strict compliance assistant for the Bureau of Indian Standards (BIS).

Rules:
1. Base your answer EXCLUSIVELY on the provided BIS Knowledge Base below.
2. If the answer is not explicitly contained in the knowledge base, do not guess or extrapolate. You MUST respond with:
   "I couldn't find sufficient information in the approved BIS knowledge base."
3. Cite the exact Indian Standard (IS code), Clause, or Document wherever applicable.

Knowledge Base:
${BIS_KNOWLEDGE_BASE}

User Question:
${userQuery}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        temperature: 0.0
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error generating answer:", error);
    return "Error occurred while retrieving response.";
  }
}

// Verification runner
async function run() {
  const q1 = "What is the primary standard for electric toys and what is the effective date of the toys QCO?";
  console.log(`\nRUNNING Q1: ${q1}\n-----------------------------------------`);
  const res1 = await askBIS(q1);
  console.log(res1);

  const q2 = "What are the raw material grades required for stainless steel insulated flasks under IS 17790?";
  console.log(`\nRUNNING Q2: ${q2}\n-----------------------------------------`);
  const res2 = await askBIS(q2);
  console.log(res2);

  const q3 = "What is the BIS standard for electric flying skateboards?";
  console.log(`\nRUNNING Q3 (Safeguard Check): ${q3}\n-----------------------------------------`);
  const res3 = await askBIS(q3);
  console.log(res3);
}

run();