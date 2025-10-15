package com.habla.dayaway.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateVacationRequestDto {
    @NotBlank(message = "Employee name is required")
    private String employeeName;

    @NotNull(message = "First day is required")
    private LocalDate firstDay;

    @NotNull(message = "Last day is required")
    private LocalDate lastDay;

    private String note;

    // Validation method
    public boolean isValidDateRange() {
        return firstDay != null && lastDay != null &&
                !firstDay.isAfter(lastDay) &&
                !firstDay.isBefore(LocalDate.now());
    }
}