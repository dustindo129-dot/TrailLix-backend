import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI, Type, Chat } from '@google/genai';
import type { Lesson, Evaluation, PersonalizedLessonContent, UserProfile } from '../data/types';
import { translations as viTranslations } from '../data/translations-vi';
import { translations as enTranslations } from '../data/translations-en';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private ai: GoogleGenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable not set');
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  private readonly evaluationSchema = {
    type: Type.OBJECT,
    properties: {
      score: {
        type: Type.NUMBER,
        description: "A score from 0 to 100 for the user's prompt based on how well it applies the lesson's formula.",
      },
      feedback: {
        type: Type.STRING,
        description: "Constructive feedback about what the user did well and what they could improve to better apply the formula.",
      },
      suggestion: {
        type: Type.STRING,
        description: "A concrete example of an improved prompt that perfectly applies the lesson's formula. It MUST be concise, use '\\n' for line breaks to create a clear structure, and use only plain text. DO NOT use markdown like bolding (**...**).",
      },
      isComplete: {
        type: Type.BOOLEAN,
        description: 'True if the score is 80 or higher, otherwise false.',
      },
    },
    required: ['score', 'feedback', 'suggestion', 'isComplete'],
  };

  private readonly personalizedLessonSchema = {
    type: Type.OBJECT,
    properties: {
      realWorldScenario: { type: Type.STRING, description: 'A concrete, real-world situation for the user\'s role to apply the lesson. Use Markdown for bolding. Aim for ~40 words.' },
      personalizedExercise: { type: Type.STRING, description: 'A clear, single-sentence task for the user based on the scenario. This is the prompt-writing mission. Do not use markdown. Aim for ~30 words.' },
      applicationGuide: { type: Type.STRING, description: 'Provide a concise, step-by-step guide for the user to apply this technique. Use simple numbered or bulleted lists (e.g., \'1. ...\\n2. ...\'), \'\\n\' to create line breaks for a clear structure. Do not use bold markdown (**...**). Aim for ~50 words.' },
      fullPrompt: { type: Type.STRING, description: 'The ideal, complete prompt that solves the personalizedExercise, perfectly applying the lesson\'s formula.' },
      components: {
        type: Type.ARRAY,
        description: 'An array of 2 to 4 prompt components that, when combined, form the fullPrompt. Each component should represent a logical part of the prompt based on the lesson\'s formula.',
        items: {
          type: Type.OBJECT,
          properties: {
            labelKey: {
              type: Type.STRING,
              description: `A key corresponding to a prompt component type. Must be one of the following exact strings: 'promptComponents.actionVerb', 'promptComponents.goal', 'promptComponents.specifics', 'promptComponents.instruction', 'promptComponents.sentence', 'promptComponents.dialogue', 'promptComponents.scope', 'promptComponents.details', 'promptComponents.qualifiers', 'promptComponents.coreRequest', 'promptComponents.format', 'promptComponents.structure', 'promptComponents.style', 'promptComponents.length', 'promptComponents.audience', 'promptComponents.tone', 'promptComponents.explicit', 'promptComponents.constraints', 'promptComponents.background', 'promptComponents.objective', 'promptComponents.scenario', 'promptComponents.parameters', 'promptComponents.role', 'promptComponents.request', 'promptComponents.context', 'promptComponents.persona', 'promptComponents.example', 'promptComponents.pattern', 'promptComponents.input', 'promptComponents.output', 'promptComponents.exclusions', 'promptComponents.task', 'promptComponents.step', 'promptComponents.initialPrompt', 'promptComponents.followUp', 'promptComponents.placeholder'`,
            },
            text: {
              type: Type.STRING,
              description: 'The actual text content of this prompt component.',
            },
          },
          required: ['labelKey', 'text'],
        },
      },
    },
    required: ['realWorldScenario', 'personalizedExercise', 'applicationGuide', 'fullPrompt', 'components'],
  };

  private getSystemInstruction(locale: 'en' | 'vi'): string {
    return locale === 'vi' ? viTranslations.gemini.systemInstruction : enTranslations.gemini.systemInstruction;
  }

  async evaluatePrompt(
    userPrompt: string,
    lesson: Lesson,
    exerciseContext: string,
    locale: 'en' | 'vi',
  ): Promise<Evaluation> {
    const model = 'gemini-2.5-flash';
    const systemInstruction = this.getSystemInstruction(locale);
    const lessonContent = lesson.content[locale];

    const promptForEvaluator = `
        Lesson Technique: "${lessonContent.title}"
        Technique Formula: "${lessonContent.formula}"
        Exercise Context: "${exerciseContext}"
        User's Prompt to Evaluate: "${userPrompt}"

        Based on how well the user's prompt applies the Technique Formula to solve the task in the Exercise Context, please evaluate it.
        Provide your response in the specified JSON format, using the language: ${locale}.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: model,
        contents: promptForEvaluator,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: this.evaluationSchema,
        },
      });

      const jsonString = response.text.trim();
      const result = JSON.parse(jsonString);
      return result as Evaluation;
    } catch (error) {
      this.logger.error('Error evaluating prompt:', error);
      const errorFeedback = locale === 'vi' ? viTranslations.gemini.evaluationError : enTranslations.gemini.evaluationError;
      const errorSuggestion = locale === 'vi' ? viTranslations.gemini.evaluationSuggestion : enTranslations.gemini.evaluationSuggestion;

      return {
        score: 0,
        feedback: errorFeedback,
        suggestion: errorSuggestion,
        isComplete: false,
      };
    }
  }

  async getSampleResponse(userPrompt: string, locale: 'en' | 'vi'): Promise<string> {
    const model = 'gemini-2.5-flash';
    const sampleInstruction = locale === 'vi' ? viTranslations.gemini.sampleResponseInstruction : enTranslations.gemini.sampleResponseInstruction;

    try {
      const response = await this.ai.models.generateContent({
        model: model,
        contents: userPrompt,
        config: {
          systemInstruction: sampleInstruction,
        },
      });
      return response.text;
    } catch (error) {
      this.logger.error('Error generating sample response:', error);
      return locale === 'vi' ? viTranslations.gemini.sampleResponseError : enTranslations.gemini.sampleResponseError;
    }
  }

  async generatePersonalizedLesson(lesson: Lesson, userProfile: UserProfile, locale: 'en' | 'vi'): Promise<PersonalizedLessonContent> {
    const model = 'gemini-2.5-flash';
    const lessonContent = lesson.content[locale];
    const systemInstruction =
      locale === 'vi'
        ? 'Bạn là một chuyên gia AI của TRAINIX, chuyên tạo ra nội dung hướng dẫn về kỹ thuật prompt. Nhiệm vụ của bạn là cá nhân hóa bài học sao cho thật gần gũi, thực tế và dễ áp dụng cho người dùng Việt Nam. Giữ cho văn phong tự nhiên, ngắn gọn và dễ hiểu, tránh dùng từ ngữ quá học thuật. QUAN TRỌNG: Luôn trả lời bằng đối tượng JSON theo đúng schema đã cho.'
        : 'You are an expert curriculum designer specializing in AI prompt engineering for non-technical professionals. Your goal is to create personalized, easy-to-understand lesson content.';

    const promptForGenerator = `
        Lesson: "${lessonContent.title}"
        Learning Goal: Teach the user to apply the following prompt formula: "${lessonContent.formula}"
        
        User Profile:
        - Name: "${userProfile.name}"
        - Age Range: "${userProfile.ageRange}"
        - Current Role: "${userProfile.role}"
        - AI Experience Level: "${userProfile.aiExperience}"
        - Skills they want to learn: "${userProfile.skills.join(', ')}"
        - Main goal after the course: "${userProfile.achievement}"
        - Relevant Industries/Fields: "${userProfile.fields.join(', ')}"
        - Motivation for learning AI: "${userProfile.motivations.join(', ')}"
        Language: "${locale}"

        Based on this rich user profile and the lesson's goal, generate a personalized, real-world application.
        Make it highly specific and relevant to their role, goals, and fields of interest.
        This includes:
        1. A real-world scenario.
        2. A specific exercise/task for the user.
        3. A guide on how to apply the lesson's formula to this task.
        4. An ideal, complete prompt ('fullPrompt') that solves the exercise.
        5. Deconstruct the 'fullPrompt' into 2-4 logical 'components', each with a 'labelKey' and its 'text'. The 'labelKey' must be a valid key from the provided schema description.

        Respond ONLY with a JSON object that adheres to the provided schema.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: model,
        contents: promptForGenerator,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: this.personalizedLessonSchema,
        },
      });

      const jsonString = response.text.trim();
      const result = JSON.parse(jsonString);
      return result as PersonalizedLessonContent;
    } catch (error) {
      this.logger.error('Error generating personalized lesson:', error);
      throw error;
    }
  }

  createChat(): Chat {
    const chat = this.ai.chats.create({
      model: 'gemini-2.5-flash',
    });
    return chat;
  }

  async analyzeImage(prompt: string, base64ImageData: string, mimeType: string): Promise<string> {
    const model = 'gemini-2.5-flash';

    const imagePart = {
      inlineData: {
        data: base64ImageData,
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: prompt,
    };

    try {
      const response = await this.ai.models.generateContent({
        model: model,
        contents: { parts: [imagePart, textPart] },
      });

      return response.text;
    } catch (error) {
      this.logger.error('Error analyzing image:', error);
      throw new Error('An error occurred while analyzing the image. Please try again.');
    }
  }
}
