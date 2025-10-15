package com.habla.dayaway.dto;

import com.habla.dayaway.model.VacationResolution;
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
public class VacationRequestWithResolutionDto {
    private Long id;
    private String employeeName;
    private LocalDate firstDay;
    private LocalDate lastDay;
    private String note;
    private LocalDateTime createdAt;
    private VacationResolution resolution; // null if not resolved
}
