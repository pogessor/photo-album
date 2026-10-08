package com.dancsopeter.photoalbum.service;

import com.dancsopeter.photoalbum.exception.StorageException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class LocalFileStorageService implements PhotoStorageService {

    private final Path rootLocation;

    public LocalFileStorageService(@Value("${app.upload.dir}") String uploadDir) {
        this.rootLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.rootLocation);
        } catch (IOException e) {
            throw new RuntimeException(
                    "Nem sikerült létrehozni a feltöltési könyvtárat: " + this.rootLocation, e);
        }
    }

    @Override
    public String save(MultipartFile file) {
        if (file.isEmpty()) {
            throw new StorageException("Üres fájl nem tölthető fel.");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String storedFilename = UUID.randomUUID() + extension;

        try {
            Path targetPath = rootLocation.resolve(storedFilename).normalize();
            if (!targetPath.startsWith(rootLocation)) {
                throw new StorageException("Érvénytelen fájlnév: " + storedFilename);
            }
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            return storedFilename;
        } catch (IOException e) {
            throw new StorageException("Nem sikerült elmenteni a fájlt: " + storedFilename, e);
        }
    }

   @Override
    public Resource load(String storedFilename) {
        try {
            Path filePath = rootLocation.resolve(storedFilename).normalize();
            if (!filePath.startsWith(rootLocation)) {
                throw new StorageException("Érvénytelen fájlnév: " + storedFilename);
            }
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            }
            throw new StorageException("Fájl nem található: " + storedFilename);
        } catch (MalformedURLException e) {
            throw new StorageException("Hibás fájl útvonal: " + storedFilename, e);
        }
    }
    
    
    @Override
    public void delete(String storedFilename) {
        try {
            Path filePath = rootLocation.resolve(storedFilename).normalize();
            if (!filePath.startsWith(rootLocation)) {
                throw new StorageException("Érvénytelen fájlnév: " + storedFilename);
            }
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new StorageException("Nem sikerült törölni a fájlt: " + storedFilename, e);
        }
    }

    @Override
    public boolean exists(String storedFilename) {
        Path filePath = rootLocation.resolve(storedFilename).normalize();
        return filePath.startsWith(rootLocation) && Files.exists(filePath);
    }
}