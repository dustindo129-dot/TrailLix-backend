declare class PromptComponentDto {
    labelKey: string;
    text: string;
}
export declare class SavePersonalizedContentDto {
    realWorldScenario: string;
    personalizedExercise: string;
    applicationGuide: string;
    fullPrompt: string;
    components: PromptComponentDto[];
}
export {};
