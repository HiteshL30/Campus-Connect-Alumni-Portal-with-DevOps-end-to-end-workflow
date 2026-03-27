package com.alumniconnect.service.llm;

public class InterviewPrompts {

    public static final String QUESTION_PROMPT = 
            "You are a professional technical interviewer for a '%s' role.\n" +
            "Round: %d | Difficulty: %s\n\n" +
            "RULES:\n" +
            "1. Be concise and professional.\n" +
            "2. Do not repeat topics from previous questions.\n" +
            "3. If the candidate's previous answer was weak, ask a clarifying follow-up or a slightly easier foundational question.\n" +
            "4. If the candidate's previous answer was strong, challenge them with a deeper or more complex scenario.\n\n" +
            "Previous Question:\n%s\n\n" +
            "Candidate Answer:\n%s\n\n" +
            "Generate the next interview question.\n" +
            "Return ONLY the question string. No quotes, no conversational filler, no markdown.";

    public static final String ANSWER_EVALUATION_PROMPT = 
            "Evaluate this technical interview answer specifically for a '%s' role.\n\n" +
            "Question:\n%s\n\n" +
            "Candidate Answer:\n%s\n\n" +
            "Evaluation Criteria: Technical Accuracy (40%), Communication (30%), Problem Solving (30%).\n" +
            "Return JSON exactly in this format WITHOUT markdown/backticks:\n" +
            "{\"score\": <0-10 integer>, \"strengths\": \"...\", \"improvements\": \"...\"}";

    public static final String INTERVIEW_SUMMARY_PROMPT = 
            "You are a Senior Talent Acquisition Manager. Review this interview transcript for a '%s' candidate.\n" +
            "Transcript:\n%s\n\n" +
            "Provide a high-level summary (2-3 sentences) of their overall performance, key strengths, and 'Hire/No Hire' recommendation logic.\n" +
            "Return ONLY the summary text.";

    public static final String FALLBACK_QUESTION_TEMPLATE = 
            "As a professional technical interviewer for a '%s' role, can you tell me about the most challenging technical project you've worked on and your specific contributions?";

    public static final String FALLBACK_QUESTION = 
            "Can you tell me about a recent technical challenge you faced and how you approached solving it?";

    public static final String RESUME_ANALYSIS_PROMPT = 
            "Extract professional entities from this resume.\n\n" +
            "Resume Text:\n%s\n\n" +
            "Return JSON exactly in this format WITHOUT markdown/backticks:\n" +
            "{\"skills\": [\"...\"], \"technologies\": [\"...\"], \"projects\": [\"...\"]}";

    public static final String RESUME_SUMMARY_PROMPT = 
            "Summarize this candidate's professional profile based on their resume into a single punchy paragraph.\n\n" +
            "Resume Text:\n%s\n\n" +
            "Return ONLY the summary text.";

    public static final String RESUME_BASED_QUESTION_PROMPT = 
            "You are a professional technical interviewer for a '%s' role.\n" +
            "Candidate's Profile: %s\n\n" +
            "RULES: Use the candidate's specific background to ask a tailored technical question.\n" +
            "If they mentioned a project, ask about a challenge they might have faced in that project.\n\n" +
            "Round: %d | Difficulty: %s\n\n" +
            "Previous Question:\n%s\n\n" +
            "Candidate Answer:\n%s\n\n" +
            "Generate the next tailored question.\n" +
            "Return ONLY the question string. No quotes, no filler, no markdown.";
}
