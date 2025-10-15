package com.habla.dayaway.service;

import com.habla.dayaway.model.VacationRequest;
import com.habla.dayaway.repository.VacationRequestRepository;
import com.habla.dayaway.repository.VacationResolutionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class VacationRequestService {

    private final VacationRequestRepository vacationRequestRepository;

    public VacationRequestService(VacationRequestRepository vacationRequestRepository) {
        this.vacationRequestRepository = vacationRequestRepository;
    }

    /**
     * Create and save a new vacation request.
     */
    public VacationRequest createVacationRequest(String employeeName,
                                                 java.time.LocalDate firstDay,
                                                 java.time.LocalDate lastDay,
                                                 String note) {
        VacationRequest request = VacationRequest.builder()
                .employeeName(employeeName)
                .firstDay(firstDay)
                .lastDay(lastDay)
                .note(note)
                .createdAt(LocalDateTime.now())
                .build();

        // Persist to DB
        vacationRequestRepository.save(request);

        return request;
    }


}
