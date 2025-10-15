package com.habla.dayaway.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VacationRequestWithResolution {
    // VacationRequest fields
    private Long requestId;
    private String employeeName;
    private LocalDate firstDay;
    private LocalDate lastDay;
    private String requestNote;
    private LocalDateTime requestCreatedAt;

    // VacationResolution fields
    private Long resolutionId;
    private Boolean decision;
    private String resolverName;
    private String resolutionNote;
    private LocalDateTime resolutionCreatedAt;

    // Derived fields
    public String getStatus() {
        if (decision == null) {
            return "PENDING";
        }
        return decision ? "APPROVED" : "REJECTED";
    }

    public boolean isPending() {
        return decision == null;
    }

    public boolean isResolved() {
        return decision != null;
    }

    public long getDurationInDays() {
        return java.time.temporal.ChronoUnit.DAYS.between(firstDay, lastDay) + 1;
    }
}