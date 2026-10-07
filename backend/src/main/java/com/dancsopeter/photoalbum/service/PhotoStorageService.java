package com.dancsopeter.photoalbum.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface PhotoStorageService {

    String save(MultipartFile file);

    Resource load(String storedFilename);

    void delete(String storedFilename);

    boolean exists(String storedFilename);
}