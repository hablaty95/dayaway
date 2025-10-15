package com.habla.dayaway.service;

import com.habla.dayaway.model.VacationRequest;
import com.habla.dayaway.repository.VacationRequestRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class VacationRequestService {

    private final VacationRequestRepository vacationRequestRepository;

    public VacationRequestService(VacationRequestRepository vacationRequestRepository) {
        this.vacationRequestRepository = vacationRequestRepository;
    }

    /**
     * Create and validate a new vacation request.
     */
    public VacationRequest createVacationRequest(String employeeName,
                                                 LocalDate firstDay,
                                                 LocalDate lastDay,
                                                 String note) {
        validateVacationDates(firstDay, lastDay);

        VacationRequest request = VacationRequest.builder()
                .employeeName(employeeName)
                .firstDay(firstDay)
                .lastDay(lastDay)
                .note(note)
                .createdAt(LocalDateTime.now())
                .build();

        vacationRequestRepository.save(request);
        return request;
    }

    /**
     * Validate vacation request date rules.
     */
    private void validateVacationDates(LocalDate firstDay, LocalDate lastDay) {
        LocalDate today = LocalDate.now();

        // Rule 1: First day must be at least 2 days in the future
        if (firstDay.isBefore(today.plusDays(2))) {
            throw new IllegalArgumentException("Vacation must start at least 2 days in the future.");
        }

        // Rule 2: End day must be greater or equal to start day
        if (lastDay.isBefore(firstDay)) {
            throw new IllegalArgumentException("End date must be greater than or equal to start date.");
        }
    }

    public List<VacationRequest> getAllRequests() {
        return vacationRequestRepository.findAll();
    }

    public Optional<VacationRequest> getRequestById(Long id) {
        return vacationRequestRepository.findById(id);
    }

    public boolean deleteVacationRequest(Long id) {
        int rows = vacationRequestRepository.deleteById(id);
        return rows > 0;
    }

    public List<VacationRequest> getRequestsByEmployee(String employeeName) {
        return vacationRequestRepository.findByEmployeeName(employeeName);
    }
}
