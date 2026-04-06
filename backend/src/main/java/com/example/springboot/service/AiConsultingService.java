package com.example.springboot.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AiConsultingService {

    private final ChatClient chatClient;

    public AiConsultingService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    /**
     * Generates a tailored cover letter or application message.
     */
    public String generateCoverLetter(String resumeText, String jobOrServiceDescription,String nameUser) {
        String prompt = """
            You are a top-tier career consultant on a job consulting platform.
            Write a professional, concise cover letter (250-350 words max) tailored to the client's resume and the job/service description.
            Highlight key matches, show enthusiasm, and end with a strong call to action.
            
            Client Resume:
            %s
            
            Job/Service Description:
            %s

            Client Name:
            %s
            """.formatted(resumeText, jobOrServiceDescription,nameUser);

        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }

    /**
     * Suggests relevant consulting services or consultants based on user profile.
     */
    public String suggestServicesOrConsultants(String userProfileText) {
        String prompt = """
            As an expert job consultant, analyze this client profile and recommend:
            - Top 3 most suitable consulting services (e.g., resume optimization, interview coaching, career strategy)
            - Why each fits
            - 1-2 specific consultants from the platform (invent realistic names/descriptions if needed)
            
            Client Profile:
            %s
            
            Be helpful, specific, and encouraging.
            """.formatted(userProfileText);

        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }

    //  add more methods later, e.g.:
    // public String generateInterviewQuestions(String jobRole, String experienceLevel) { ... }
}