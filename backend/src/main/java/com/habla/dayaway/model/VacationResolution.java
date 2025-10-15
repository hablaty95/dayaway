package com.habla.dayaway.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VacationResolution {
    private Long id;
    private Long vacationRequestId;
    private Boolean decision;
    private String resolverName;
    private String note;
    private LocalDateTime createdAt;

    // Helper methods for better semantics
    public boolean isApproved() {
        return Boolean.TRUE.equals(decision);
    }

    public boolean isRejected() {
        return Boolean.FALSE.equals(decision);
    }

    public String getStatus() {
        return isApproved() ? "APPROVED" : "REJECTED";
    }
}