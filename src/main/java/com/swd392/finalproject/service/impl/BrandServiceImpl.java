package com.swd392.finalproject.service.impl;

import com.swd392.finalproject.dto.BrandDTO;
import com.swd392.finalproject.repository.BrandRepository;
import com.swd392.finalproject.service.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;

    @Override
    @Transactional(readOnly = true)
    public List<BrandDTO> getAllBrands() {
        return brandRepository.findAll().stream()
                .map(b -> new BrandDTO(b.getId(), b.getName()))
                .toList();
    }
}
