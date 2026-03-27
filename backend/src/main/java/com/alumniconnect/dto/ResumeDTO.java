package com.alumniconnect.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeDTO {
    private Long userId;
    private String userName;
    private String role;
    private String department;
    private String resumeUrl;
    private boolean hasAccess;
}
