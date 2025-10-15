package com.habla.dayaway.controller;

import com.habla.dayaway.dto.VacationRequestWithResolutionDto;
import com.habla.dayaway.dto.VacationResolutionDto;
import com.habla.dayaway.model.VacationResolution;
import com.habla.dayaway.service.VacationQueryService;
import com.habla.dayaway.service.VacationResolutionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vacations")
public class VacationResolutionController {

    private final VacationResolutionService vacationResolutionService;
    private final VacationQueryService vacationQueryService;


    public VacationResolutionController(
            VacationResolutionService vacationResolutionService,
            VacationQueryService vacationQueryService
    ) {
        this.vacationResolutionService = vacationResolutionService;
        this.vacationQueryService = vacationQueryService;
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<?> resolveVacation(
            @PathVariable Long id,
            @RequestBody VacationResolutionDto body
    ) {
        VacationResolution saved = vacationResolutionService.resolveRequest(
                id,
                body.isDecision(),
                body.getResolverName(),
                body.getNote()
        );
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<VacationRequestWithResolutionDto>> getAllVacationRequests() {
        return ResponseEntity.ok(vacationQueryService.getAllRequests());
    }
}
