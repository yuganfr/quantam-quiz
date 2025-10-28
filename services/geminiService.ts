
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from '../types';

const fetchQuizQuestions = async (): Promise<QuizQuestion[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Create a 5-question multiple-choice quiz about quantum computing concepts.
    IMPORTANT: Frame every question as a short, charming story or scenario involving animals in a meadow.
    DO NOT use direct quantum terminology like 'qubit', 'superposition', 'entanglement', 'quantum tunneling', or 'observer effect' in the questions or options.
    For each question, provide:
    1.  'questionStory': The animal-based story or scenario.
    2.  'options': An array of 4 possible answers. One must be correct. Each option should have 'text' and 'isCorrect' (boolean).
    3.  'explanation': A brief explanation of the correct answer, which first explains the animal story's logic and then reveals the corresponding quantum computing concept in parentheses.
    4.  'quantumConcept': The name of the quantum concept the question is about (e.g., "Superposition", "Entanglement").
    
    Example for one question:
    A magical firefly named Flicker can be in multiple flowers at once. If you try to catch it, it instantly appears in just one flower.
    The quantum concept is Superposition & Measurement.

    Generate 5 unique questions following this format.
  `;

  const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        questionStory: {
          type: Type.STRING,
          description: "The animal-based story for the quiz question.",
        },
        options: {
          type: Type.ARRAY,
          description: "An array of 4 multiple-choice options.",
          items: {
            type: Type.OBJECT,
            properties: {
              text: {
                type: Type.STRING,
                description: "The text of the option.",
              },
              isCorrect: {
                type: Type.BOOLEAN,
                description: "True if this is the correct answer.",
              },
            },
            required: ["text", "isCorrect"],
          },
        },
        explanation: {
          type: Type.STRING,
          description: "Explanation of the correct answer and the related quantum concept.",
        },
        quantumConcept: {
            type: Type.STRING,
            description: "The name of the quantum concept."
        }
      },
      required: ["questionStory", "options", "explanation", "quantumConcept"],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8,
      },
    });
    const jsonText = response.text.trim();
    const quizData = JSON.parse(jsonText);
    
    // Basic validation
    if (!Array.isArray(quizData) || quizData.length === 0) {
        throw new Error("Invalid quiz data format received from API.");
    }

    return quizData as QuizQuestion[];

  } catch (error) {
    console.error("Error fetching quiz questions from Gemini API:", error);
    // Fallback to mock data if API fails
    return getMockQuestions();
  }
};

const getMockQuestions = (): QuizQuestion[] => {
    return [
      {
        questionStory: "A tiny field mouse named Pip finds a tall, solid blade of grass blocking his path to a tasty berry. Instead of going around, he sometimes just appears on the other side instantly, as if he walked through it. How does he do it?",
        options: [
          { text: "He's a ghost mouse.", isCorrect: false },
          { text: "He momentarily borrows a bit of energy to 'tunnel' through the barrier.", isCorrect: true },
          { text: "The wind blows him over the top very fast.", isCorrect: false },
          { text: "He eats the grass blade.", isCorrect: false }
        ],
        explanation: "Pip doesn't break the rules of the meadow, he just uses them in a strange way. By 'borrowing' energy for a split second, he has a small chance to appear on the other side. (This is like Quantum Tunneling).",
        quantumConcept: "Quantum Tunneling"
      },
      {
        questionStory: "Two twin fireflies, Flicker and Flash, are born. They are magically linked. If Flicker flashes a green light in one corner of the meadow, you instantly know Flash, who is all the way on the other side, is also flashing green. How do they coordinate?",
        options: [
          { text: "They are sending secret signals.", isCorrect: false },
          { text: "It's just a coincidence.", isCorrect: false },
          { text: "Their fates are connected; knowing one's state instantly determines the other's.", isCorrect: true },
          { text: "They agreed on a pattern beforehand.", isCorrect: false }
        ],
        explanation: "Flicker and Flash are connected in a special way. The state of one is instantly linked to the other, no matter the distance. (This is like Quantum Entanglement).",
        quantumConcept: "Entanglement"
      }
    ];
};


export default fetchQuizQuestions;
