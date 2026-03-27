package com.alumniconnect.service;

import com.alumniconnect.service.llm.LLMService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SupportChatbotService {

    private final LLMService llmService;

    private static final String INSTANT_RESPONSE_PREFIX = "Welcome to Campus Connect! (Instant Assistant)\n\n";

    private static final String SYSTEM_CONTEXT = 
        "You are the Campus Connect Support Chatbot. Your goal is to guide users through the platform." +
        "\n\nFOLLOW THIS FORMAT EXACTLY:" +
        "\n1. First sentence" +
        "\n2. Second sentence" +
        "\n3. Third sentence" +
        "\nEnsure each point is ON A NEW LINE." +
        "\n\nSTRICT FORMATTING RULES:" +
        "\n- ALWAYS START with: 'Welcome to Campus Connect!'" +
        "\n- Use PLAIN TEXT only. NO asterisks (*) or markdown." +
        "\n- Use numbering (1., 2., 3.) for every separate point." +
        "\n- Double newlines for better clarity." +
        "\n\nPlatform Features:" +
        "\n1. Mock Interviews: AI practice in 'AI Interview' area." +
        "\n2. People: Connect in 'People' tab." +
        "\n3. Chat: Messaging features." +
        "\n4. Jobs: Finder in 'Jobs' portal." +
        "\n5. Events: Sessions in 'Events' tab." +
        "\n6. Resume Analysis: Feedback in 'Resume' section." +
        "\n7. Profile: Update your info.";

    public String getChatbotResponse(String userQuery) {
        String query = userQuery.toLowerCase();
        
        // 1. Instant Responses for common keywords (Saves Quota)
        String instantResponse = getInstantResponse(query);
        if (instantResponse != null) {
            return instantResponse;
        }

        // 2. Fallback to Gemini if no instant match
        try {
            return llmService.generateResponse(userQuery, SYSTEM_CONTEXT);
        } catch (Exception e) {
            return getFallbackPlatformGuide();
        }
    }

    private String getInstantResponse(String query) {
        if (query.contains("hi") || query.contains("hello") || query.contains("hey")) {
            return INSTANT_RESPONSE_PREFIX + "How can I help you today? You can ask about Interviews, Jobs, Events, or Connecting with Alumni!";
        }
        
        if (query.contains("interview") || query.contains("prep") || query.contains("practice")) {
            return INSTANT_RESPONSE_PREFIX + 
                "1. Go to the 'AI Interview' tab.\n" +
                "2. Upload your resume or enter a job role.\n" +
                "3. Start the dynamic mock session to get real-time feedback!";
        }
        
        if (query.contains("job") || query.contains("career") || query.contains("internship")) {
            return INSTANT_RESPONSE_PREFIX + 
                "1. Visit the 'Jobs' portal.\n" +
                "2. Search by company, role, or job type.\n" +
                "3. View details and apply directly or connect with the alumni who posted it!";
        }
        
        if (query.contains("resume") || query.contains("analysis") || query.contains("cv")) {
            return INSTANT_RESPONSE_PREFIX + 
                "1. Go to the 'Resume' section in your profile.\n" +
                "2. Upload your latest PDF resume.\n" +
                "3. Our AI will analyze your skills and suggest matching career paths.";
        }
        
        if (query.contains("alumni") || query.contains("people") || query.contains("connect")) {
            return INSTANT_RESPONSE_PREFIX + 
                "1. Open the 'People' or 'Alumni' directory.\n" +
                "2. Use filters to find mentors in your field.\n" +
                "3. Send a connection request to start chatting!";
        }
        
        if (query.contains("event") || query.contains("webinar") || query.contains("session")) {
            return INSTANT_RESPONSE_PREFIX + 
                "1. Check the 'Events' tab for upcoming campus sessions.\n" +
                "2. Click 'Join' to register.\n" +
                "3. Participate in live Q&A with industry experts!";
        }

        return null; // Let the LLM handle it
    }

    private String getFallbackPlatformGuide() {
        return INSTANT_RESPONSE_PREFIX + 
            "The AI is currently resting due to high traffic, but here is a quick guide:\n" +
            "• Interviews: Use 'AI Interview' for practice.\n" +
            "• Jobs: Current openings are under 'Jobs'.\n" +
            "• Networks: Find mentors in 'People'.\n" +
            "• Events: View webinars in the 'Events' tab.";
    }
}
