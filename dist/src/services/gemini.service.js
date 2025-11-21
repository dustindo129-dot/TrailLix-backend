"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GeminiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const genai_1 = require("@google/genai");
const translations_vi_1 = require("../data/translations-vi");
const translations_en_1 = require("../data/translations-en");
let GeminiService = GeminiService_1 = class GeminiService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(GeminiService_1.name);
        this.evaluationSchema = {
            type: genai_1.Type.OBJECT,
            properties: {
                score: {
                    type: genai_1.Type.NUMBER,
                    description: "A score from 0 to 100 for the user's prompt based on how well it applies the lesson's formula.",
                },
                feedback: {
                    type: genai_1.Type.STRING,
                    description: "Constructive feedback about what the user did well and what they could improve to better apply the formula.",
                },
                suggestion: {
                    type: genai_1.Type.STRING,
                    description: "A concrete example of an improved prompt that perfectly applies the lesson's formula. It MUST be concise, use '\\n' for line breaks to create a clear structure, and use only plain text. DO NOT use markdown like bolding (**...**).",
                },
                isComplete: {
                    type: genai_1.Type.BOOLEAN,
                    description: 'True if the score is 80 or higher, otherwise false.',
                },
            },
            required: ['score', 'feedback', 'suggestion', 'isComplete'],
        };
        this.personalizedLessonSchema = {
            type: genai_1.Type.OBJECT,
            properties: {
                realWorldScenario: { type: genai_1.Type.STRING, description: 'A concrete, real-world situation for the user\'s role to apply the lesson. Use Markdown for bolding. Aim for ~40 words.' },
                personalizedExercise: { type: genai_1.Type.STRING, description: 'A clear, single-sentence task for the user based on the scenario. This is the prompt-writing mission. Do not use markdown. Aim for ~30 words.' },
                applicationGuide: { type: genai_1.Type.STRING, description: 'Provide a concise, step-by-step guide for the user to apply this technique. Use simple numbered or bulleted lists (e.g., \'1. ...\\n2. ...\'), \'\\n\' to create line breaks for a clear structure. Do not use bold markdown (**...**). Aim for ~50 words.' },
                fullPrompt: { type: genai_1.Type.STRING, description: 'The ideal, complete prompt that solves the personalizedExercise, perfectly applying the lesson\'s formula.' },
                components: {
                    type: genai_1.Type.ARRAY,
                    description: 'An array of 2 to 4 prompt components that, when combined, form the fullPrompt. Each component should represent a logical part of the prompt based on the lesson\'s formula.',
                    items: {
                        type: genai_1.Type.OBJECT,
                        properties: {
                            labelKey: {
                                type: genai_1.Type.STRING,
                                description: `A key corresponding to a prompt component type. Must be one of the following exact strings: 'promptComponents.actionVerb', 'promptComponents.goal', 'promptComponents.specifics', 'promptComponents.instruction', 'promptComponents.sentence', 'promptComponents.dialogue', 'promptComponents.scope', 'promptComponents.details', 'promptComponents.qualifiers', 'promptComponents.coreRequest', 'promptComponents.format', 'promptComponents.structure', 'promptComponents.style', 'promptComponents.length', 'promptComponents.audience', 'promptComponents.tone', 'promptComponents.explicit', 'promptComponents.constraints', 'promptComponents.background', 'promptComponents.objective', 'promptComponents.scenario', 'promptComponents.parameters', 'promptComponents.role', 'promptComponents.request', 'promptComponents.context', 'promptComponents.persona', 'promptComponents.example', 'promptComponents.pattern', 'promptComponents.input', 'promptComponents.output', 'promptComponents.exclusions', 'promptComponents.task', 'promptComponents.step', 'promptComponents.initialPrompt', 'promptComponents.followUp', 'promptComponents.placeholder'`,
                            },
                            text: {
                                type: genai_1.Type.STRING,
                                description: 'The actual text content of this prompt component.',
                            },
                        },
                        required: ['labelKey', 'text'],
                    },
                },
            },
            required: ['realWorldScenario', 'personalizedExercise', 'applicationGuide', 'fullPrompt', 'components'],
        };
        const apiKey = this.configService.get('GEMINI_API_KEY');
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY environment variable not set');
        }
        this.ai = new genai_1.GoogleGenAI({ apiKey });
    }
    getSystemInstruction(locale) {
        return locale === 'vi' ? translations_vi_1.translations.gemini.systemInstruction : translations_en_1.translations.gemini.systemInstruction;
    }
    async evaluatePrompt(userPrompt, lesson, exerciseContext, locale) {
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
            return result;
        }
        catch (error) {
            this.logger.error('Error evaluating prompt:', error);
            const errorFeedback = locale === 'vi' ? translations_vi_1.translations.gemini.evaluationError : translations_en_1.translations.gemini.evaluationError;
            const errorSuggestion = locale === 'vi' ? translations_vi_1.translations.gemini.evaluationSuggestion : translations_en_1.translations.gemini.evaluationSuggestion;
            return {
                score: 0,
                feedback: errorFeedback,
                suggestion: errorSuggestion,
                isComplete: false,
            };
        }
    }
    async getSampleResponse(userPrompt, locale) {
        const model = 'gemini-2.5-flash';
        const sampleInstruction = locale === 'vi' ? translations_vi_1.translations.gemini.sampleResponseInstruction : translations_en_1.translations.gemini.sampleResponseInstruction;
        try {
            const response = await this.ai.models.generateContent({
                model: model,
                contents: userPrompt,
                config: {
                    systemInstruction: sampleInstruction,
                },
            });
            return response.text;
        }
        catch (error) {
            this.logger.error('Error generating sample response:', error);
            return locale === 'vi' ? translations_vi_1.translations.gemini.sampleResponseError : translations_en_1.translations.gemini.sampleResponseError;
        }
    }
    async generatePersonalizedLesson(lesson, userProfile, locale) {
        const model = 'gemini-2.5-flash';
        const lessonContent = lesson.content[locale];
        const systemInstruction = locale === 'vi'
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
            return result;
        }
        catch (error) {
            this.logger.error('Error generating personalized lesson:', error);
            throw error;
        }
    }
    createChat() {
        const chat = this.ai.chats.create({
            model: 'gemini-2.5-flash',
        });
        return chat;
    }
    async analyzeImage(prompt, base64ImageData, mimeType) {
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
        }
        catch (error) {
            this.logger.error('Error analyzing image:', error);
            throw new Error('An error occurred while analyzing the image. Please try again.');
        }
    }
};
exports.GeminiService = GeminiService;
exports.GeminiService = GeminiService = GeminiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GeminiService);
//# sourceMappingURL=gemini.service.js.map