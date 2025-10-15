package com.habla.dayaway.model;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VacationRequest {
    private Long id;
    private String employeeName;
    private LocalDate firstDay;
    private LocalDate lastDay;
    private String note;
    private LocalDateTime createdAt;

    // Helper method to calculate duration in days
    public long getDurationInDays() {
        return java.time.temporal.ChronoUnit.DAYS.between(firstDay, lastDay) + 1;
    }

    // Helper method to check if request is pending
    public boolean isPending() {
        // This would typically check if there's a resolution, but since we're using JDBC,
        // this logic will be handled in the service layer
        return true;
    }
}