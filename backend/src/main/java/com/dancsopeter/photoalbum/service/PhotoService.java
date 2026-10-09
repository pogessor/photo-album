package com.dancsopeter.photoalbum.service;

import com.dancsopeter.photoalbum.entity.Photo;
import com.dancsopeter.photoalbum.exception.PhotoNotFoundException;
import com.dancsopeter.photoalbum.exception.StorageException;
import com.dancsopeter.photoalbum.repository.PhotoRepository;
import jakarta.transaction.Transactional;
import java.io.IOException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

@Service
public class PhotoService {

    private final PhotoRepository photoRepository;
    private final PhotoStorageService storageService;
    private final GeminiService geminiService;

    public PhotoService(PhotoRepository photoRepository,
                        PhotoStorageService storageService,
                        GeminiService geminiService) {
        this.photoRepository = photoRepository;
        this.storageService = storageService;
        this.geminiService = geminiService;
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
    
    @Transactional
    public Photo uploadPhoto(MultipartFile file, Integer year, String description) {
        String storedFilename = storageService.save(file);
        try {
            Photo photo = new Photo();
            photo.setFilename(storedFilename);
            photo.setOriginalFilename(file.getOriginalFilename());
            photo.setYear(year);
            photo.setDescription(description);
            photo.setUploadedAt(LocalDateTime.now());
            return photoRepository.save(photo);
        } catch (Exception e) {
            storageService.delete(storedFilename);
            throw e;
        }
    }

    public Resource loadImage(Long id) {
        Photo photo = photoRepository.findById(id)
                .orElseThrow(() -> new PhotoNotFoundException(id));
        return storageService.load(photo.getFilename());
    }

    @Transactional
    public void deletePhoto(Long id) {
        Photo photo = photoRepository.findById(id)
                .orElseThrow(() -> new PhotoNotFoundException(id));
        storageService.delete(photo.getFilename());
        photoRepository.delete(photo);
    } 
    
    @Transactional
    public Photo updatePhoto(Long id, Integer year, String description) {
        Photo photo = photoRepository.findById(id)
                .orElseThrow(() -> new PhotoNotFoundException(id));

        if (year != null) {
            photo.setYear(year);
        }
        if (description != null) {
            photo.setDescription(description);
        }

        return photoRepository.save(photo);
    } 
    
    public String describeImage(MultipartFile file) {
        if (file.isEmpty()) {
            throw new StorageException("Üres fájl nem írható le.");
        }
        String mimeType = file.getContentType();
        if (mimeType == null || mimeType.isBlank()) {
            mimeType = "application/octet-stream";
        }
        try {
            return geminiService.describeImage(file.getBytes(), mimeType);
        } catch (IOException e) {
            throw new StorageException("Nem sikerült beolvasni a feltöltött fájlt.", e);
        }
    }    
}