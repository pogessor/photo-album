package com.dancsopeter.photoalbum.controller;

import com.dancsopeter.photoalbum.dto.PhotoDescriptionResponse;
import com.dancsopeter.photoalbum.dto.PhotoUpdateRequest;
import com.dancsopeter.photoalbum.dto.PhotoUploadRequest;
import com.dancsopeter.photoalbum.entity.Photo;
import com.dancsopeter.photoalbum.service.PhotoService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.web.multipart.MultipartFile;

@RestController
//@Validated
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
    
    /*@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Photo> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("year")
            @Min(value = 1000, message = "Az évszámnak négyjegyűnek kell lennie (1000-9999).")
            @Max(value = 9999, message = "Az évszámnak négyjegyűnek kell lennie (1000-9999).")
            Integer year,
            @RequestParam(value = "description", required = false)
            @Size(max = 1000, message = "A leírás legfeljebb 1000 karakter lehet.")
            String description) {

        Photo photo = photoService.uploadPhoto(file, year, description);
        return ResponseEntity.status(HttpStatus.CREATED).body(photo);
    }*/
            
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Photo> upload(@Valid @ModelAttribute PhotoUploadRequest request) {
        Photo photo = photoService.uploadPhoto(
                request.file(),
                request.year(),
                request.description());
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
             @Valid @RequestBody PhotoUpdateRequest request) {

        Photo updated = photoService.updatePhoto(id, request.year(), request.description());
        return ResponseEntity.ok(updated);
    }  
    
    @PostMapping(value = "/describe", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PhotoDescriptionResponse> describe(
            @RequestParam("file") MultipartFile file) {

        String description = photoService.describeImage(file);
        return ResponseEntity.ok(new PhotoDescriptionResponse(description));
    }    
}