import { streamText, tool } from "ai"
import { z } from "zod"

const VACCINATION_INFO = {
  dtap: {
    name: "DTaP",
    fullName: "Diphtheria, Tetanus, and Pertussis",
    description:
      "Protects against three serious bacterial diseases. Diphtheria can cause breathing problems, paralysis, and heart failure. Tetanus causes painful muscle stiffness. Pertussis (whooping cough) causes severe coughing spells.",
    schedule: "5 doses: 2 months, 4 months, 6 months, 15-18 months, and 4-6 years",
    sideEffects:
      "Common: soreness at injection site, mild fever, fussiness. Rare: high fever, seizures (very rare)",
  },
  mmr: {
    name: "MMR",
    fullName: "Measles, Mumps, and Rubella",
    description:
      "Protects against three viral diseases. Measles can cause pneumonia and brain swelling. Mumps can cause deafness. Rubella during pregnancy can cause birth defects.",
    schedule: "2 doses: 12-15 months and 4-6 years",
    sideEffects:
      "Common: mild fever, rash 7-12 days after vaccination. Rare: temporary joint pain (mainly adults)",
  },
  polio: {
    name: "IPV",
    fullName: "Inactivated Poliovirus Vaccine",
    description:
      "Protects against polio, a disease that can cause paralysis. Thanks to vaccination, polio has been nearly eliminated worldwide.",
    schedule: "4 doses: 2 months, 4 months, 6-18 months, and 4-6 years",
    sideEffects: "Very safe. Soreness at the injection site is the most common side effect.",
  },
  hepatitisB: {
    name: "Hepatitis B",
    fullName: "Hepatitis B Vaccine",
    description:
      "Protects against hepatitis B virus which can cause liver disease. The virus can be spread from mother to baby at birth.",
    schedule: "3 doses: birth, 1-2 months, and 6-18 months",
    sideEffects: "Very safe. Soreness at injection site, mild fever in some cases.",
  },
  varicella: {
    name: "Varicella",
    fullName: "Chickenpox Vaccine",
    description:
      "Protects against chickenpox, which causes itchy rash and can lead to skin infections, pneumonia, and brain swelling.",
    schedule: "2 doses: 12-15 months and 4-6 years",
    sideEffects:
      "Common: soreness, mild fever. Some children may get a mild rash 1-3 weeks after vaccination.",
  },
  pneumococcal: {
    name: "PCV13",
    fullName: "Pneumococcal Conjugate Vaccine",
    description:
      "Protects against pneumococcal bacteria which can cause meningitis, pneumonia, and ear infections.",
    schedule: "4 doses: 2 months, 4 months, 6 months, and 12-15 months",
    sideEffects: "Common: mild fever, soreness, fussiness, drowsiness.",
  },
  rotavirus: {
    name: "Rotavirus",
    fullName: "Rotavirus Vaccine",
    description:
      "Protects against rotavirus, the most common cause of severe diarrhea in infants and young children.",
    schedule: "2-3 doses (depending on brand): 2 months, 4 months, and sometimes 6 months",
    sideEffects: "Very safe. Mild temporary diarrhea or vomiting may occur.",
  },
  hib: {
    name: "Hib",
    fullName: "Haemophilus influenzae type b",
    description:
      "Protects against Hib disease which can cause meningitis, pneumonia, and other serious infections.",
    schedule: "3-4 doses: 2 months, 4 months, 6 months (some brands), and 12-15 months",
    sideEffects: "Very safe. Mild soreness at injection site.",
  },
  flu: {
    name: "Influenza",
    fullName: "Seasonal Flu Vaccine",
    description:
      "Protects against seasonal flu viruses. Young children are at higher risk for serious flu complications.",
    schedule: "Annually starting at 6 months. First-time vaccinees under 9 need 2 doses.",
    sideEffects: "Common: soreness at injection site, mild fever, muscle aches.",
  },
  hepatitisA: {
    name: "Hepatitis A",
    fullName: "Hepatitis A Vaccine",
    description:
      "Protects against hepatitis A virus which affects the liver and is spread through contaminated food/water.",
    schedule: "2 doses: 12-23 months, with second dose 6 months later",
    sideEffects: "Very safe. Mild soreness at injection site.",
  },
}

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: "openai/gpt-4o-mini",
    system: `You are VaxCare AI, a helpful and knowledgeable assistant specializing in childhood vaccinations. Your role is to:

1. Provide accurate, evidence-based information about vaccines
2. Explain vaccination schedules and timing
3. Address common concerns and questions parents have
4. Help parents understand the importance of timely vaccinations
5. Provide general guidance (but always recommend consulting healthcare providers for medical decisions)

Guidelines:
- Be warm, supportive, and understanding of parent concerns
- Use simple, clear language avoiding medical jargon when possible
- Always emphasize that you provide general information and parents should consult their pediatrician for personalized advice
- If asked about specific medical conditions or contraindications, advise consulting a healthcare provider
- Be factual about vaccine safety while acknowledging parents' concerns
- Never provide medical diagnoses or specific medical advice

You have access to tools to look up specific vaccine information. Use them when parents ask about specific vaccines.`,
    messages,
    tools: {
      getVaccineInfo: tool({
        description:
          "Get detailed information about a specific vaccine including its full name, description, schedule, and side effects",
        inputSchema: z.object({
          vaccineName: z
            .enum([
              "dtap",
              "mmr",
              "polio",
              "hepatitisB",
              "varicella",
              "pneumococcal",
              "rotavirus",
              "hib",
              "flu",
              "hepatitisA",
            ])
            .describe("The vaccine to look up information for"),
        }),
        execute: async ({ vaccineName }) => {
          const info = VACCINATION_INFO[vaccineName]
          if (!info) {
            return { error: "Vaccine information not found" }
          }
          return info
        },
      }),
      getVaccinationScheduleByAge: tool({
        description: "Get the recommended vaccinations for a specific age in months",
        inputSchema: z.object({
          ageMonths: z.number().describe("The age in months to check vaccination schedule for"),
        }),
        execute: async ({ ageMonths }) => {
          const scheduleByAge: Record<number, string[]> = {
            0: ["Hepatitis B (1st dose)"],
            2: [
              "DTaP (1st dose)",
              "IPV (1st dose)",
              "Hib (1st dose)",
              "PCV13 (1st dose)",
              "Rotavirus (1st dose)",
              "Hepatitis B (2nd dose)",
            ],
            4: [
              "DTaP (2nd dose)",
              "IPV (2nd dose)",
              "Hib (2nd dose)",
              "PCV13 (2nd dose)",
              "Rotavirus (2nd dose)",
            ],
            6: [
              "DTaP (3rd dose)",
              "Hib (3rd dose - some brands)",
              "PCV13 (3rd dose)",
              "Rotavirus (3rd dose - some brands)",
              "Hepatitis B (3rd dose)",
              "Influenza (annually)",
            ],
            12: [
              "MMR (1st dose)",
              "Varicella (1st dose)",
              "Hepatitis A (1st dose)",
              "PCV13 (4th dose)",
              "Hib (final dose)",
            ],
            15: ["DTaP (4th dose)"],
            18: ["Hepatitis A (2nd dose)"],
            48: [
              "DTaP (5th dose)",
              "IPV (4th dose)",
              "MMR (2nd dose)",
              "Varicella (2nd dose)",
            ],
          }

          // Find the closest age match
          const ages = Object.keys(scheduleByAge).map(Number)
          const closestAge = ages.reduce((prev, curr) =>
            Math.abs(curr - ageMonths) < Math.abs(prev - ageMonths) ? curr : prev
          )

          return {
            requestedAge: ageMonths,
            closestScheduledAge: closestAge,
            vaccines: scheduleByAge[closestAge] || [],
            note:
              ageMonths !== closestAge
                ? `Showing schedule for ${closestAge} months (closest to requested ${ageMonths} months)`
                : undefined,
          }
        },
      }),
    },
    maxSteps: 5,
  })

  return result.toUIMessageStreamResponse()
}
