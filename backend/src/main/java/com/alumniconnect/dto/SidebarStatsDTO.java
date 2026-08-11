package com.alumniconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SidebarStatsDTO {
    private long connectionCount;
    private long pendingRequestsCount;
    private long savedJobsCount;
    private long appliedJobsCount;
    
    private long jobPostingsCount;
    private long totalApplicantsCount;
}
