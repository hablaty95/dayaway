package com.habla.dayaway.controller;

import com.habla.dayaway.model.VacationRequest;
import com.habla.dayaway.service.VacationRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vacation-requests")
public class VacationRequestController {

    private final VacationRequestService vacationRequestService;

    public VacationRequestController(VacationRequestService service) {
        this.vacationRequestService = service;
    }

    @PostMapping
    public ResponseEntity<VacationRequest> create(@RequestBody VacationRequest request) {
        VacationRequest saved = vacationRequestService.createVacationRequest(
                request.getEmployeeName(),
                request.getFirstDay(),
                request.getLastDay(),
                request.getNote()
        );
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public List<VacationRequest> getAll() {
        return vacationRequestService.getAllRequests();
    }

    @GetMapping("/{id}")
    public ResponseEntity<VacationRequest> getById(@PathVariable Long id) {
        return vacationRequestService.getRequestById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return vacationRequestService.deleteVacationRequest(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
