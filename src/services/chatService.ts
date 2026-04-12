import dbConnect from '@/lib/db';
import { Conversation } from '@/models/Conversation';
import { Message } from '@/models/Message';
import { ProductInstance } from '@/models/ProductInstance';
import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini AI SDK client
let genai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

export async function processChatMessage(
  projectId: string, 
  productInstanceId: string, 
  conversationId: string, 
  userMessage: string
) {
  await dbConnect();
  
  // 1. Fetch Integration Settings for this instance
  const instance = await ProductInstance.findById(productInstanceId).lean();
  if (!instance) throw new Error('Product not found');
  
  const integrations = instance.integrations as Record<string, boolean>;

  const steps = []; // Internal steps to return to UI

  // 2. Integration Simulation
  if (integrations.shopify) {
    steps.push({ role: 'system', content: 'Querying Shopify inventory...', isStep: true });
    // Simulate real delay
    await new Promise(r => setTimeout(r, 600)); 
  }
  
  if (integrations.crm) {
    steps.push({ role: 'system', content: 'Checking CRM records...', isStep: true });
    await new Promise(r => setTimeout(r, 500));
  }

  steps.push({ role: 'system', content: 'Generating response via AI...', isStep: true });

  let aiText = "I'm a mock AI response. I noticed Shopify is " + (integrations.shopify ? "enabled" : "disabled") + " and CRM is " + (integrations.crm ? "enabled." : "disabled.");

  // 3. Optional: Call Real API (Gemini)
  if (genai) {
    try {
      const response = await genai.models.generateContent({
        model: 'gemini-2.5-flash',
         contents: [
           { 
             role: 'user', 
             parts: [{ text: `Respond as an AI assistant. The user said: ${userMessage}. Known integrations: ${JSON.stringify(integrations)}` }] 
           }
         ]
       });
       aiText = response.text || aiText;
    } catch (e) {
      console.error('Gemini API Error:', e);
      aiText = "Error reaching Gemini API. Here's a fallback mock response.";
    }
  }

  // 4. Save to MongoDB
  await Message.create({ conversationId, role: 'user', content: userMessage });
  await Message.create({ conversationId, role: 'assistant', content: aiText });

  return {
    steps,
    response: { role: 'assistant', content: aiText }
  };
}
