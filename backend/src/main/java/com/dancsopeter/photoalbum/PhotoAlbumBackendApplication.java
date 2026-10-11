package com.dancsopeter.photoalbum;

import com.dancsopeter.photoalbum.entity.Photo;
import com.dancsopeter.photoalbum.service.GeminiService;
import com.dancsopeter.photoalbum.service.PhotoService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@SpringBootApplication
public class PhotoAlbumBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(PhotoAlbumBackendApplication.class, args);
    }

@Bean
CommandLineRunner demo(
        PhotoService photoService,
        GeminiService geminiService,
        @Value("${app.gemini.test-on-startup:false}") boolean geminiTestEnabled) {
    return args -> {
        // Csak akkor szúrunk be seed adatokat, ha a DB üres
        if (photoService.findAll().isEmpty()) {
            System.out.println(">>> Üres adatbázis, tesztfotók beszúrva.");

            Photo p1 = new Photo();
            p1.setYear(1999);
            p1.setDescription("Nyári vakáció a Balatonon");
            p1.setFilename("balaton.jpg");
            photoService.save(p1);

            Photo p2 = new Photo();
            p2.setYear(2023);
            p2.setDescription("Almafa virágzás tavasszal");
            p2.setFilename("almafa.jpg");
            photoService.save(p2);

            Photo p3 = new Photo();
            p3.setYear(1999);
            p3.setDescription("Karácsony a nagymamánál");
            p3.setFilename("karacsony.jpg");
            photoService.save(p3);
        } else {
            System.out.println(">>> Adatbázisban már vannak fotók, seed kihagyva.");
        }

        // Gemini teszt (csak ha engedélyezve van)
        if (geminiTestEnabled) {
            System.out.println("\n>>> Gemini API teszt indul...");
            Path testImagePath = Paths.get("uploads", "test.jpeg");
            if (!Files.exists(testImagePath)) {
                System.out.println(">>> A teszt fájl nem található: "
                        + testImagePath.toAbsolutePath());
            } else {
                try {
                    byte[] imageBytes = Files.readAllBytes(testImagePath);
                    String description = geminiService.describeImage(imageBytes, "image/jpeg");
                    System.out.println(">>> Gemini leírás: " + description);
                } catch (Exception e) {
                    System.out.println(">>> Gemini hiba: " + e.getMessage());
                }
            }
        }
    };
}
}