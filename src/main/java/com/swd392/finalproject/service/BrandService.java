package com.swd392.finalproject.service;

import com.swd392.finalproject.dto.BrandDTO;
import com.swd392.finalproject.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BrandService {

    private final BrandRepository brandRepository;

    @Transactional(readOnly = true)
    public List<BrandDTO> getAllBrands() {
        return brandRepository.findAll().stream()
                .map(b -> new BrandDTO(b.getId(), b.getName()))
                .toList();
    }
}
