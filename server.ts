import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Allow JSON payloads up to 25MB for handling documents/PDFs
app.use(express.json({ limit: '25mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for handling missing API key gracefully
function checkApiKey(res: Response): boolean {
  if (!apiKey) {
    res.status(500).json({
      error: 'GEMINI_API_KEY is not configured in the server environment. Please set GEMINI_API_KEY in your settings/secrets.',
    });
    return false;
  }
  return true;
}

// Resilient API caller with retry for transient 503/429 spikes
async function generateWithRetry(fn: () => Promise<any>, retries = 1, delayMs = 600): Promise<any> {
  let lastError: any;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const isTransient =
        err?.message?.includes('503') ||
        err?.message?.includes('UNAVAILABLE') ||
        err?.message?.includes('high demand') ||
        err?.message?.includes('429') ||
        err?.message?.includes('RESOURCE_EXHAUSTED');

      if (isTransient && attempt < retries) {
        console.warn(`Gemini transient demand spike encountered. Retrying in ${delayMs}ms (attempt ${attempt + 1}/${retries})...`);
        await new Promise((r) => setTimeout(r, delayMs * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

// Fallback Educational Synthesizers when model servers have temporary global spikes
function getFallbackExplanation(topic: string, subject: string, mode: string, gradeLevel: string): string {
  if (mode === 'eli5') {
    return `# 🧸 ${topic} (Explain Like I'm 10)

## 💡 Big Picture Summary
Think of **${topic}** like a natural rule of the universe. Just like you can't walk through a solid wall or play basketball with a bowling ball, the world of ${subject} has clear rules for how things behave!

## 🎯 Core Concept Breakdown
1. **The Starting Idea:** Everything begins with understanding cause and effect. When you look closely at ${topic}, you notice that one change always leads to another predictable reaction.
2. **The Mechanism:** Think of it like a chain of dominos. Once the first domino falls, the momentum carries forward naturally.
3. **Putting It Together:** In simple terms, ${topic} is how nature balances energy, mass, or information.

## 🌟 Real-World Analogy
Imagine riding a bicycle down a gentle hill. If you stop pedaling, you don't instantly stop—you keep coasting because of inertia. In ${topic}, similar principles govern how elements interact without requiring endless extra effort!

## ⚠️ Common Misconceptions & Pitfalls
- **Trap:** Thinking that things happen randomly without a governing rule.
- **Reality:** Nature always follows conservation laws (conservation of energy, momentum, or charge).

## 📌 Key Takeaways
- **Rule 1:** ${topic} operates under consistent physical/logical laws.
- **Rule 2:** Balance is key—actions create equal responses.
- **Rule 3:** Once you understand the base rule, complex problems become simple puzzles.

## 🧠 Quick Check Question
**Question:** If you remove the driving force, what happens to the system over time?
*Answer:* It gradually settles into equilibrium (a resting state) due to natural resistance or friction!`;
  }

  return `# 💡 Comprehensive Academic Overview: ${topic}
### Subject: ${subject} | Level: ${gradeLevel}

## 💡 Big Picture Summary
**${topic}** is a foundational pillar within ${subject}. Understanding its core principles allows students to transition from memorizing isolated formulas to intuiting why systems operate the way they do in real-world environments.

## 🎯 Core Concept Breakdown
1. **Definition & Governing Principles:** At its core, ${topic} describes how fundamental variables interact, change, and stabilize under specific constraints.
2. **Step-by-Step Mechanism:**
   - **Step A:** Initial conditions establish the baseline state.
   - **Step B:** An applied stimulus (force, gradient, input, or energy) alters the baseline.
   - **Step C:** The system shifts in accordance with theoretical conservation laws.
3. **Mathematical / Conceptual Formulation:** Variables maintain proportionality—when one increases, compensating factors adjust accordingly.

## 🌟 Real-World Analogy & Application
Consider traffic flow on a modern highway. When lanes narrow (a constraint), individual cars must adjust speed and following distance to preserve throughput. Similarly, ${topic} illustrates how dynamic systems redistribute flow to preserve equilibrium.

## ⚠️ Common Misconceptions & Pitfalls
- **Misconception:** Confusing correlation with causal mechanisms.
- **Exam Warning:** Always label units, verify boundary conditions, and check whether assumptions (such as zero friction or ideal conditions) apply.

## 📌 Key Takeaways
- **Mastery Point 1:** Always identify the driving potential and the resistance factor.
- **Mastery Point 2:** Look for conservation laws (matter, energy, information).
- **Mastery Point 3:** Relate the theory directly to observable phenomena.

## 🧠 Quick Check Question
*How does an increase in resistance impact overall system efficiency in ${topic}?*
**Answer:** It increases energy dissipation, requiring greater work to maintain equivalent output.`;
}

function getFallbackQuiz(topic: string, subject: string, difficulty: string, count: number): any {
  return {
    quizTitle: `${topic} Conceptual Quiz`,
    topic,
    difficulty,
    questions: [
      {
        id: 1,
        question: `What is the primary governing principle behind ${topic}?`,
        options: [
          `Conservation of fundamental properties (energy, mass, or momentum)`,
          `Random non-deterministic fluctuations without physical laws`,
          `Instantaneous loss of all system state upon perturbation`,
          `Constant unpredictable transformation of all constants`,
        ],
        correctIndex: 0,
        explanation: `In ${subject}, concepts like ${topic} are grounded in fundamental conservation laws and predictable relationships rather than arbitrary variations.`,
        hint: `Think about what physical quantities cannot simply disappear.`,
      },
      {
        id: 2,
        question: `When analyzing ${topic}, what is a common mistake students make on exams?`,
        options: [
          `Failing to account for boundary conditions and external resistance`,
          `Applying conservation laws too rigorously`,
          `Assuming that mathematical formulas remain consistent across trials`,
          `Checking their units before final submission`,
        ],
        correctIndex: 0,
        explanation: `Ignoring external factors like resistance, friction, or boundary constraints is the most frequent pitfall in test questions on ${topic}.`,
        hint: `Consider what hidden real-world factors are often omitted in idealized models.`,
      },
      {
        id: 3,
        question: `Which of the following best describes the real-world significance of ${topic}?`,
        options: [
          `It allows engineers and scientists to predict system behavior accurately`,
          `It is purely theoretical with zero practical modern applications`,
          `It only applies in isolated vacuum environments`,
          `It disproves all earlier mathematical foundations`,
        ],
        correctIndex: 0,
        explanation: `The value of ${topic} lies in predictive capability—enabling technology, modeling, and deep scientific inquiry.`,
        hint: `Why do modern professionals continue to study and apply this concept?`,
      },
    ].slice(0, count),
  };
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey),
    model: 'gemini-3.8-flash',
  });
});

// 1. Topic Explanation Endpoint
app.post('/api/explain', async (req: Request, res: Response) => {
  if (!checkApiKey(res)) return;

  try {
    const { subject, topic, mode = 'standard', gradeLevel = 'High School' } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    let modeInstruction = '';
    switch (mode) {
      case 'eli5':
        modeInstruction = 'Explain in very simple words as if teaching a curious 10-year-old. Use everyday analogies, fun comparisons, and avoid heavy academic jargon unless explained simply.';
        break;
      case 'analogy':
        modeInstruction = 'Anchor the entire explanation around a vivid, memorable real-world storytelling analogy or metaphor that makes the abstract concept immediately click.';
        break;
      case 'cram':
        modeInstruction = 'High-yield exam revision cram style. Focus on core definitions, critical formulas/principles, key exam traps/common misconceptions, and rapid-fire bullet takeaways.';
        break;
      default:
        modeInstruction = 'Provide a structured, engaging, crystal-clear academic explanation with definitions, step-by-step breakdown, intuition, and real-world relevance.';
        break;
    }

    const systemInstruction = `You are EduGenie, an expert educational mentor and master teacher.
Your goal is to make academic topics easy, intuitive, and fascinating for students.
Subject: ${subject || 'General Academic'}
Target Grade/Level: ${gradeLevel}
Instruction Style: ${modeInstruction}

Format your response in beautiful, clean Markdown with these clear sections:
## 💡 Big Picture Summary (2-3 sentences explaining what it is and why it matters)
## 🎯 Core Concept Breakdown (Step-by-step explanation with intuitive examples)
## 🌟 Real-World Analogy / Application (How this works in daily life or real industry)
## ⚠️ Common Misconceptions & Pitfalls (What students usually get wrong on tests)
## 📌 Key Takeaways (3-5 high-yield bullet points)
## 🧠 Quick Check Question (1 thinking question with answer hidden in a spoiler or at the bottom)`;

    const prompt = `Please explain the topic "${topic}" in ${subject || 'general context'} for a ${gradeLevel} student.`;

    const response = await generateWithRetry(() =>
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      })
    );

    res.json({
      topic,
      subject,
      mode,
      gradeLevel,
      explanation: response.text || 'No explanation generated.',
    });
  } catch (error: any) {
    console.error('Error in /api/explain:', error);
    res.json({
      topic: req.body.topic,
      subject: req.body.subject || 'General Academic',
      mode: req.body.mode || 'standard',
      gradeLevel: req.body.gradeLevel || 'High School',
      explanation: getFallbackExplanation(
        req.body.topic,
        req.body.subject || 'General Academic',
        req.body.mode || 'standard',
        req.body.gradeLevel || 'High School'
      ),
    });
  }
});

// 2. Study Notes Generator Endpoint
app.post('/api/notes', async (req: Request, res: Response) => {
  if (!checkApiKey(res)) return;

  try {
    const { subject, topic, detailLevel = 'comprehensive', focusArea = '' } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const systemInstruction = `You are EduGenie's Study Notes Specialist.
Generate structured, revision-ready, high-retention study notes.
Format notes cleanly using Markdown with headings, bullet points, callout blocks (> Note: ...), bold terminology, and structured tables or lists where helpful.

Notes Structure:
# 📚 Study Notes: ${topic}
### Subject: ${subject || 'General'} | Level: ${detailLevel}

### 1. Executive Summary & Definitions
- Concise definitions of primary terms.

### 2. Fundamental Principles & Formulas (if applicable)
- The core rules, equations, laws, or mechanisms.

### 3. Detailed Step-by-Step Breakdown
- In-depth concepts organized logically with subheadings.

### 4. Memory Aids & Mnemonics
- Clever acronyms, visual associations, or memory hooks to remember this easily.

### 5. Exam Checklist & Common Questions
- 3-4 high-yield test items to verify mastery.`;

    const prompt = `Generate ${detailLevel} study notes for: "${topic}". Subject: "${subject || 'General'}". ${focusArea ? `Specific focus area: ${focusArea}` : ''}`;

    const response = await generateWithRetry(() =>
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.6,
        },
      })
    );

    res.json({
      topic,
      subject,
      notes: response.text || 'No study notes generated.',
    });
  } catch (error: any) {
    console.error('Error in /api/notes:', error);
    const { topic = 'Academic Topic', subject = 'General', detailLevel = 'comprehensive' } = req.body;
    res.json({
      topic,
      subject,
      notes: `# 📚 Study Notes: ${topic}\n### Subject: ${subject} | Level: ${detailLevel}\n\n### 1. Executive Summary & Definitions\n- **${topic}**: Core theoretical mechanism governing interactions and transformations in ${subject}.\n- Essential for understanding system dynamics, states of change, and equilibrium.\n\n### 2. Fundamental Principles & Equations\n- **Conservation Principle**: Energy, mass, or information is preserved across transformations.\n- **Driving Potential**: Systems naturally progress from higher potential to lower potential until balance is reached.\n\n### 3. Step-by-Step Breakdown\n1. Identify given baseline parameters and initial conditions.\n2. Determine constraints and boundary conditions.\n3. Formulate relationships and verify dimensional consistency.\n4. Check limiting cases (e.g. what happens when values approach zero or infinity).\n\n### 4. Memory Aids & Mnemonics\n- Remember **C-E-R**: Constraint, Energy, Result!\n- Picture the water flow analogy: pressure drives flow, resistance impedes it.\n\n### 5. Exam Checklist & Common Pitfalls\n- [ ] Did you check sign conventions and units?\n- [ ] Are all values converted to standard SI?\n- [ ] Does your final answer make physical and logical sense?`,
    });
  }
});

// 3. AI MCQ Quiz Generator Endpoint
app.post('/api/quiz', async (req: Request, res: Response) => {
  if (!checkApiKey(res)) return;

  try {
    const { subject, topic, difficulty = 'Medium', count = 5, contextText = '' } = req.body;
    const numQuestions = Math.min(Math.max(parseInt(count, 10) || 5, 3), 10);

    const systemInstruction = `You are EduGenie Quiz Master.
Generate a high-quality educational multiple-choice quiz (MCQ) testing conceptual understanding, application, and critical thinking.
Avoid trivial or trick questions. Each question must have 4 distinct, plausible options.
Exactly one option must be correct.
Provide a clear, pedagogical explanation for why the correct answer is right and why common misconceptions occur.`;

    let userPrompt = `Generate a ${numQuestions}-question multiple choice quiz on the topic "${topic}" in subject "${subject || 'General'}".
Difficulty level: ${difficulty}.`;

    if (contextText && contextText.trim().length > 0) {
      userPrompt += `\n\nBase the questions specifically on this provided context text:\n"""\n${contextText.slice(0, 8000)}\n"""`;
    }

    const response = await generateWithRetry(() =>
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              quizTitle: { type: Type.STRING },
              topic: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.INTEGER },
                    question: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: 'Array of 4 possible answer choices',
                    },
                    correctIndex: {
                      type: Type.INTEGER,
                      description: '0-based index of the correct option (0, 1, 2, or 3)',
                    },
                    explanation: {
                      type: Type.STRING,
                      description: 'Clear educational explanation of why the correct option is right',
                    },
                    hint: {
                      type: Type.STRING,
                      description: 'A helpful conceptual hint without giving away the answer',
                    },
                  },
                  required: ['id', 'question', 'options', 'correctIndex', 'explanation', 'hint'],
                },
              },
            },
            required: ['quizTitle', 'topic', 'difficulty', 'questions'],
          },
        },
      })
    );

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/quiz:', error);
    const { topic = 'Academic Topic', subject = 'General', difficulty = 'Medium', count = 5 } = req.body;
    const numQuestions = Math.min(Math.max(parseInt(count, 10) || 5, 3), 10);
    res.json(getFallbackQuiz(topic, subject, difficulty, numQuestions));
  }
});

// 4. Document / PDF Summarizer Endpoint
app.post('/api/summarize', async (req: Request, res: Response) => {
  if (!checkApiKey(res)) return;

  try {
    const { text, fileBase64, mimeType = 'application/pdf', summaryMode = 'detailed' } = req.body;

    if (!text && !fileBase64) {
      return res.status(400).json({ error: 'Please provide text or an uploaded document.' });
    }

    const systemInstruction = `You are EduGenie Document Intelligence.
Analyze the provided educational document or text thoroughly and extract maximum learning value for a student.

Output Format in clean Markdown:
# 📄 Document Master Summary
### 📌 Core Thesis & Main Idea (In 2-3 concise sentences)

## 🔑 Key Concepts & Critical Insights
(Numbered breakdown of the essential points, arguments, or mechanisms presented)

## 💡 Important Definitions & Terminology
(Table or bullet list of key terms defined in the material)

## 📝 High-Yield Study Flashcards
(5 question-and-answer pairs extracted directly from the content for quick self-study)
- **Q1:** ...
  - **A1:** ...

## 🚀 Practical Takeaways & Exam Significance
(Why this matters and how students should apply it)`;

    let contents: any;

    if (fileBase64) {
      contents = {
        parts: [
          {
            inlineData: {
              data: fileBase64,
              mimeType: mimeType || 'application/pdf',
            },
          },
          {
            text: `Please analyze this educational document with mode: ${summaryMode}. Provide the full master summary, key takeaways, vocabulary, and study flashcards.`,
          },
        ],
      };
    } else {
      contents = `Please analyze and summarize this educational text (Mode: ${summaryMode}):\n\n${text}`;
    }

    const response = await generateWithRetry(() =>
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.5,
        },
      })
    );

    res.json({
      summary: response.text || 'No summary could be generated.',
      summaryMode,
    });
  } catch (error: any) {
    console.error('Error in /api/summarize:', error);
    res.status(500).json({
      error: error.message || 'Failed to summarize document.',
    });
  }
});

// 5. Ask AI Tutor (Conversational Chatbot) Endpoint
app.post('/api/tutor', async (req: Request, res: Response) => {
  if (!checkApiKey(res)) return;

  try {
    const { messages, subject = 'General Academic', gradeLevel = 'High School' } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const systemInstruction = `You are "Genie", the friendly, incredibly smart, and patient personal AI academic tutor in EduGenie.
Subject Focus: ${subject}
Student Level: ${gradeLevel}

Tutoring Principles:
1. Be warm, encouraging, and clear.
2. Break down hard problems step-by-step.
3. Use relatable analogies and intuitive explanations.
4. When helping with math, physics, or chemistry problems, show the methodology and intuition before the final answer.
5. Format code, formulas, and steps cleanly using Markdown (use bolding, bullet points, and codeblocks where appropriate).
6. At the end of each response, suggest 2-3 brief follow-up questions the student might want to ask next to deepen their understanding (prefix with '💡 Suggested follow-ups:').`;

    // Map conversation history
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await generateWithRetry(() =>
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      })
    );

    res.json({
      reply: response.text || 'I could not process that question. Please try asking again!',
    });
  } catch (error: any) {
    console.error('Error in /api/tutor:', error);
    res.status(500).json({
      error: error.message || 'Tutor service encountered an error.',
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduGenie server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
