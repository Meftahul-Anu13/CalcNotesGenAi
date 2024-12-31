import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const sessionHistory: Record<string, string[]> = {}; 

export const POST = async (request: Request) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const data = await request.json();
        const { sessionId, question } = data;

  
        if (!sessionHistory[sessionId]) {
            sessionHistory[sessionId] = [];
        }

        sessionHistory[sessionId].push(`User: ${question}`);

        // Construct the prompt with chat history
        const chatHistory = sessionHistory[sessionId].join("\n");
        const prompt = `You are a chatbot named Dost. Engage in a conversation about science, technology, AI, ML, computer science, physics, chemistry, and more. Provide detailed answers with explanations and equations where necessary.
        Remember the conversation context and continue as if it’s a live chat. 
        
        Conversation so far:
        ${chatHistory}
        
        Dost:`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        
        sessionHistory[sessionId].push(`Dost: ${response}`);

        return NextResponse.json({ question, response });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to process the request', errorName: (error as Error).name });
    }
};
