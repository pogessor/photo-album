package com.dancsopeter.photoalbum.service;

import com.dancsopeter.photoalbum.entity.Photo;
import com.dancsopeter.photoalbum.repository.PhotoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PhotoService {

    private final PhotoRepository photoRepository;

    public PhotoService(PhotoRepository photoRepository) {
        this.photoRepository = photoRepository;
    }

    public List<Photo> findAll() {
        return photoRepository.findAll();
    }

    public Optional<Photo> findById(Long id) {
        return photoRepository.findById(id);
    }

    public List<Photo> search(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return photoRepository.findAll();
        }
        String pattern = "%" + keyword.trim() + "%";
        return photoRepository.searchByYearOrDescription(pattern);
    }

    public Photo save(Photo photo) {
        if (photo.getUploadedAt() == null) {
            photo.setUploadedAt(LocalDateTime.now());
        }
        return photoRepository.save(photo);
    }

    public void deleteById(Long id) {
        photoRepository.deleteById(id);
    }

    public void deleteAll() {
        photoRepository.deleteAll();
    }
}