package com.dancsopeter.photoalbum.controller;

import com.dancsopeter.photoalbum.entity.Photo;
import com.dancsopeter.photoalbum.service.PhotoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}