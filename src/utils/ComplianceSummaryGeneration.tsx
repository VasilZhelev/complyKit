import { GoogleGenAI } from "@google/genai";

// Get API key from environment variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    console.error("VITE_GEMINI_API_KEY is not set in environment variables");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export async function generateComplianceSummary(answers: Record<string, any>, riskLevel: string) {
    try {
        console.log(answers)
        console.log("Sending request to Gemini API...");
        const prompt = `You're a specialist on the EU AI act and the legal side of things for ai startups and buisnesses and you are here to provide VALUE.
                        Generate a short AI compliance summary from the AI Eu Act with everything important so we can provide value to our customers. This is a direct responce to the user filling out the form so dont use any start or end just the actual summary.
                        Some information about the user. Also focus on the specific position that the user is in because that is of the most value.
                        - Questionnaire answers: ${answers}
                        - Risk level: ${riskLevel}
                        The responce has to contain:
                        - A list of the most important things to consider
                        - A list of the most important things to avoid
                        - Next steps 
                        - Whatever other value you can provide for the customer according to their situation
                        Format the response in a clear, professional manner, but friendly and in a readable language, not legalese.
                        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
            config: {
                maxOutputTokens: 1000,
            },
        });
        
        if (response.text) {
            console.log("Success! Response text:", response.text);
            return response.text;
        } else {
            console.error("No text in response. Full response:", response);
            return "Error: No response text received from the AI model.";
        }
    } catch (error: any) {
        console.error("Error generating compliance summary:", error);
        console.error("Error details:", {
            name: error?.name,
            message: error?.message,
            stack: error?.stack
        });
        return "Error: Failed to generate compliance summary. Please check the console for details.";
    }
}