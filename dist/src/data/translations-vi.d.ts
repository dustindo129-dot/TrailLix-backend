export declare const translations: {
    selector: {
        title: string;
        mainTitle: string;
        subtitle: string;
    };
    auth: {
        email: string;
        password: string;
        confirmPassword: string;
        login: string;
        signup: string;
        welcomeBack: string;
        createAccount: string;
        loginTitle: string;
        signupTitle: string;
        taglines: string;
        noAccount: string;
        hasAccount: string;
        tagline: string;
        back: string;
        rememberMe: string;
        strength: {
            weak: string;
            medium: string;
            strong: string;
            criteria: {
                length: string;
                uppercase: string;
                lowercase: string;
                number: string;
                special: string;
            };
        };
        error: {
            emailRequired: string;
            passwordRequired: string;
            noMatch: string;
            userNotFound: string;
            incorrectPassword: string;
            userExists: string;
        };
    };
    account: {
        title: string;
        back: string;
        profileTitle: string;
        profileDescription: string;
        username: string;
        emailLabel: string;
        saveProfile: string;
        profileSuccess: string;
        securityTitle: string;
        securityDescription: string;
        oldPassword: string;
        newPassword: string;
        confirmNewPassword: string;
        changePassword: string;
        passwordSuccess: string;
        passwordError: string;
        genericError: string;
        nameLabel: string;
        ageRangeLabel: string;
        roleLabel: string;
        aiExperienceLabel: string;
        skillsLabel: string;
        achievementLabel: string;
        fieldsLabel: string;
        motivationsLabel: string;
    };
    sidebar: {
        viewCertificate: string;
        accountSettings: string;
        logout: string;
        lessonsTitle: string;
        trailProgress: string;
    };
    roleSelector: {
        mainTitle: string;
        description: string;
        step1: {
            title: string;
            placeholder: string;
        };
        step2: {
            title: string;
            options: {
                "18-24": string;
                "25-34": string;
                "35-44": string;
                "45-54": string;
                "55+": string;
            };
        };
        step3: {
            title: string;
            options: {
                student: string;
                employee: string;
                specialist: string;
                manager: string;
                director: string;
                owner: string;
                jobSeeker: string;
                other: string;
            };
            otherPlaceholder: string;
        };
        step4: {
            title: string;
            options: {
                beginner: string;
                basic: string;
                regular: string;
                experienced: string;
                expert: string;
            };
        };
        step5: {
            title: string;
            options: {
                prompting: string;
                automation: string;
                analysis: string;
                contentCreation: string;
                chatbots: string;
                projectManagement: string;
                marketing: string;
                development: string;
                other: string;
            };
            otherPlaceholder: string;
        };
        step6: {
            title: string;
            options: {
                certificate: string;
                productivity: string;
                promotion: string;
                careerChange: string;
                ownProject: string;
                consultant: string;
                stayUpdated: string;
                other: string;
            };
            otherPlaceholder: string;
        };
        step7: {
            title: string;
            options: {
                marketing: string;
                business: string;
                education: string;
                tech: string;
                finance: string;
                health: string;
                design: string;
                hr: string;
                sales: string;
                logistics: string;
                hospitality: string;
                realEstate: string;
                legal: string;
                arts: string;
                other: string;
            };
            otherPlaceholder: string;
        };
        step8: {
            title: string;
            options: {
                income: string;
                passion: string;
                pressure: string;
                fomo: string;
                problemSolving: string;
                careerChange: string;
                build: string;
                curiosity: string;
                company: string;
                other: string;
            };
            otherPlaceholder: string;
        };
        next: string;
        submit: string;
        back: string;
    };
    concepts: {
        next: string;
        back: string;
        finalCta: string;
        checkAnswer: string;
        correctTitle: string;
        incorrectTitle: string;
        tryAgain: string;
        explanationTitle: string;
        steps: {
            title: string;
            icon: string;
            options: string[];
            correctIndex: number;
            explanation: string;
        }[];
    };
    lesson: {
        promptPlaceholder: string;
        evaluatePrompt: string;
        generatingLesson: string;
        generationError: string;
        copy: string;
        copied: string;
        retry: string;
        continue: string;
        getCertificate: string;
        stepNext: string;
        stepBack: string;
        whatTitle: string;
        whyTitle: string;
        formulaTitle: string;
        comparisonTitle: string;
        simplePracticeTitle: string;
        scenarioTitle: string;
        missionTitle: string;
        guideTitle: string;
        before: string;
        after: string;
        simpleExamplePrompt: string;
        buildYourPrompt: string;
        addComponent: string;
        yourPrompt: string;
        fullExamplePrompt: string;
        loadingNext: string;
        trailCheckpoint: string;
    };
    promptComponents: {
        actionVerb: string;
        goal: string;
        specifics: string;
        instruction: string;
        sentence: string;
        dialogue: string;
        scope: string;
        details: string;
        qualifiers: string;
        coreRequest: string;
        concise: string;
        clarification: string;
        precision: string;
        format: string;
        structure: string;
        style: string;
        length: string;
        bulletPoints: string;
        table: string;
        markdown: string;
        positive: string;
        audience: string;
        tone: string;
        explicit: string;
        constraints: string;
        background: string;
        objective: string;
        scenario: string;
        parameters: string;
        document: string;
        extraction: string;
        usage: string;
        role: string;
        request: string;
        specialization: string;
        context: string;
        persona: string;
        example: string;
        pattern: string;
        input: string;
        output: string;
        exclusions: string;
        task: string;
        step: string;
        initialPrompt: string;
        followUp: string;
        placeholder: string;
    };
    evaluation: {
        title: string;
        score: string;
        status: string;
        complete: string;
        needsWork: string;
        feedback: string;
        suggestion: string;
        showSuggestion: string;
        greatJob: string;
        summaryTitle: string;
        winningPrompt: string;
        aiResponse: string;
        welcomePromptError: string;
        loading: {
            analyzing: string;
            scoring: string;
            generatingFeedback: string;
            almostDone: string;
        };
        onTrack: string;
        offTrail: string;
    };
    sampleResponse: {
        title: string;
    };
    loader: {
        title: string;
        steps: {
            analyzing: string;
            crafting: string;
            finding: string;
            finalizing: string;
        };
    };
    onboarding: {
        evalTitle1: string;
        evalContent1: string;
        evalTitle2: string;
        evalContent2: string;
        evalTitle3: string;
        evalContent3: string;
        sidebarTitle2: string;
        sidebarContent2: string;
        sidebarTitle3: string;
        sidebarContent3: string;
        skip: string;
        back: string;
        next: string;
        finish: string;
    };
    gemini: {
        systemInstruction: string;
        evaluationError: string;
        evaluationSuggestion: string;
        sampleResponseInstruction: string;
        sampleResponseError: string;
    };
    gamification: {
        level: string;
        totalXp: string;
        streakTitle: string;
        levelUpTitle: string;
        levelUpDescription: string;
        continue: string;
        courseProgress: string;
        trailMilestone: string;
        checkpointsCompleted: string;
    };
    ranks: {
        novice: string;
        apprentice: string;
        journeyman: string;
        adept: string;
        pro: string;
        master: string;
        virtuoso: string;
    };
    playground: {
        title: string;
        description: string;
        chatTab: string;
        imageTab: string;
        practiceTrail: string;
    };
};
