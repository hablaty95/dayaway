package com.habla.dayaway.service;

import com.habla.dayaway.dto.VacationRequestWithResolutionDto;
import com.habla.dayaway.repository.VacationRequestQueryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VacationQueryService {

    private final VacationRequestQueryRepository queryRepository;

    public VacationQueryService(VacationRequestQueryRepository queryRepository) {
        this.queryRepository = queryRepository;
    }

    public List<VacationRequestWithResolutionDto> getAllRequests() {
        return queryRepository.findAllWithResolutions();
    }
}
