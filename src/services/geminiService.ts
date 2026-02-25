const API_KEY = "AIzaSyBtaFxlRqNoF_2ZsCaLfdPN5R_JnTol2oc"
// Try flash first, fall back to flash-lite if quota exceeded
const MODELS = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-2.0-flash-lite",
]
const API_URL = (model: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`

async function callGemini(requestBody: object): Promise<any> {
  for (const model of MODELS) {
    const response = await fetch(`${API_URL(model)}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })
    const data = await response.json()
    if (response.ok) return data
    // If quota exceeded, try next model
    const errMsg: string = data?.error?.message || ""
    if (errMsg.toLowerCase().includes("quota") || response.status === 429) continue
    // Other error — throw immediately
    throw new Error(errMsg || `Request failed: ${response.status}`)
  }
  throw new Error("AI quota exceeded for all models. Please get a new API key at https://aistudio.google.com/apikey or try again tomorrow.")
}

export interface DietPlanRequest {
  age: number
  weight: number
  height: number
  goal: "lose" | "maintain" | "gain"
  dailyCalorieIntake: number
}

export const generateDietPlan = async (userData: DietPlanRequest): Promise<string> => {
  const prompt = `You are a professional nutritionist. Based on the following user profile, create a personalized weekly diet plan.

User Profile:
- Age: ${userData.age} years
- Weight: ${userData.weight} kg
- Height: ${userData.height} cm
- Goal: ${userData.goal === "lose" ? "Lose Weight" : userData.goal === "gain" ? "Gain Muscle" : "Maintain Weight"}
- Daily Calorie Target: ${userData.dailyCalorieIntake} kcal

Please provide:
1. Brief personalized recommendations (2-3 sentences)
2. A simple weekly meal plan with breakfast, lunch, dinner for 3 days
3. Top 5 foods to focus on
4. Foods to avoid or limit

Format the response in a clear, readable way.`

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  }

  try {
    const data = await callGemini(requestBody)
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to generate diet plan"
  } catch (error) {
    console.error("Gemini API Error:", error)
    throw error
  }
}

export interface FoodSnapResult {
  name: string
  calories: number
  protein?: number
  carbs?: number
  fat?: number
}

export const analyzeFoodImage = async (base64Data: string, mimeType: string = "image/jpeg"): Promise<FoodSnapResult> => {
  const prompt = `You are a nutrition expert. Analyze this food image and identify ALL food items visible.
Respond ONLY with a valid JSON object in this exact format (no markdown, no explanation):
{"name": "<food name>", "calories": <total calories as number>, "protein": <grams as number>, "carbs": <grams as number>, "fat": <grams as number>}
Estimate realistic values for a standard single serving/portion visible in the image.`

  const requestBody = {
    contents: [{
      parts: [
        { inline_data: { mime_type: mimeType, data: base64Data } },
        { text: prompt }
      ]
    }],
  }

  const data = await callGemini(requestBody)
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
  const cleaned = text.replace(/```json|```/g, "").trim()
  try {
    return JSON.parse(cleaned) as FoodSnapResult
  } catch {
    throw new Error("Could not parse AI response. Try a clearer photo.")
  }
}

export const analyzeFoodSnap = async (description: string): Promise<FoodSnapResult> => {
  const prompt = `You are a nutrition expert. The user described a food item: "${description}".
Respond ONLY with a valid JSON object in this exact format (no markdown, no explanation):
{"name": "<food name>", "calories": <number>}
Estimate realistic calories for a standard single serving.`

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
  }

  const data = await callGemini(requestBody)
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
  const cleaned = text.replace(/```json|```/g, "").trim()
  try {
    return JSON.parse(cleaned) as FoodSnapResult
  } catch {
    throw new Error("Could not parse AI response. Try a more specific description.")
  }
}
