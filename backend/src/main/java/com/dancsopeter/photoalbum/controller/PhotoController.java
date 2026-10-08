package com.dancsopeter.photoalbum.controller;

import com.dancsopeter.photoalbum.dto.PhotoUpdateRequest;
import com.dancsopeter.photoalbum.entity.Photo;
import com.dancsopeter.photoalbum.service.PhotoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/photos")
public class PhotoController {

    private final PhotoService photoService;

    public PhotoController(PhotoService photoService) {
        this.photoService = photoService;
    }

    @GetMapping
    public List<Photo> getAll() {
        return photoService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Photo> getById(@PathVariable Long id) {
        return photoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<Photo> search(@RequestParam(required = false) String keyword) {
        return photoService.search(keyword);
    }
    
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Photo> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("year") Integer year,
            @RequestParam(value = "description", required = false) String description) {

        Photo photo = photoService.uploadPhoto(file, year, description);
        return ResponseEntity.status(HttpStatus.CREATED).body(photo);
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<Resource> getImage(@PathVariable Long id) {
        Resource resource = photoService.loadImage(id);
        MediaType mediaType = MediaTypeFactory.getMediaType(resource)
                .orElse(MediaType.APPLICATION_OCTET_STREAM);
        return ResponseEntity.ok()
                .contentType(mediaType)
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        photoService.deletePhoto(id);
        return ResponseEntity.noContent().build();
    }   
    
    @PatchMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Photo> update(
            @PathVariable Long id,
            @RequestBody PhotoUpdateRequest request) {

        Photo updated = photoService.updatePhoto(id, request.year(), request.description());
        return ResponseEntity.ok(updated);
    }    
}