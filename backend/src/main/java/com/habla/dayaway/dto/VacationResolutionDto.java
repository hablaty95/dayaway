package com.habla.dayaway.dto;

import lombok.Data;

@Data
public class VacationResolutionDto {
    private boolean decision;
    private String resolverName;
    private String note;
}
