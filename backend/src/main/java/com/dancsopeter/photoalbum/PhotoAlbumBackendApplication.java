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
            photoService.deleteAll();
            System.out.println(">>> Korábbi fotók törölve.");

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

            System.out.println(">>> 3 tesztfotó beszúrva.");

            System.out.println("\n>>> Keresés: 1999");
            photoService.search("1999").forEach(p -> System.out.println(
                    "  id=" + p.getId()
                    + " | year=" + p.getYear()
                    + " | desc=" + p.getDescription()
            ));

            System.out.println("\n>>> Keresés: alma");
            photoService.search("alma").forEach(p -> System.out.println(
                    "  id=" + p.getId()
                    + " | year=" + p.getYear()
                    + " | desc=" + p.getDescription()
            ));

            System.out.println("\n>>> Keresés: karácsony");
            photoService.search("karácsony").forEach(p -> System.out.println(
                    "  id=" + p.getId()
                    + " | year=" + p.getYear()
                    + " | desc=" + p.getDescription()
            ));

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
            } else {
                System.out.println("\n>>> Gemini teszt kihagyva (app.gemini.test-on-startup=false).");
            }
        };
    }
}