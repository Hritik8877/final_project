"use server";

import { HfInference } from "@huggingface/inference";

export async function generateQuizAction(prompt) {
  try {
    const hf = new HfInference(process.env.NEXT_PUBLIC_HF_TOKEN);
    const response = await hf.chatCompletion({
      model: "Qwen/Qwen2.5-72B-Instruct",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.1
    });
    return { success: true, text: response.choices[0].message.content };
  } catch (error) {
    console.error("HF Server Action Error:", error.message);
    return { success: false, error: error.message };
  }
}
