package com.habla.dayaway.service;

import com.habla.dayaway.model.VacationResolution;
import com.habla.dayaway.repository.VacationResolutionRepository;
import com.habla.dayaway.repository.VacationRequestRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class VacationResolutionService {

    private final VacationResolutionRepository vacationResolutionRepository;
    private final VacationRequestRepository vacationRequestRepository;

    public VacationResolutionService(VacationResolutionRepository resolutionRepo, VacationRequestRepository requestRepo) {
        this.vacationResolutionRepository = resolutionRepo;
        this.vacationRequestRepository = requestRepo;
    }

    public VacationResolution resolveRequest(Long requestId, boolean decision, String resolverName, String note) {
        // Check that request exists
        if (!vacationRequestRepository.existsById(requestId)) {
            throw new IllegalArgumentException("Vacation request with ID " + requestId + " does not exist.");
        }


        VacationResolution resolution = VacationResolution.builder()
                .vacationRequestId(requestId)
                .decision(decision)
                .resolverName(resolverName)
                .note(note)
                .createdAt(LocalDateTime.now())
                .build();

        return vacationResolutionRepository.save(resolution);
    }
}
