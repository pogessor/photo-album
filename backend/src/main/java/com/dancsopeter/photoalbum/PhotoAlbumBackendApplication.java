package com.dancsopeter.photoalbum;

import com.dancsopeter.photoalbum.entity.Photo;
import com.dancsopeter.photoalbum.repository.PhotoRepository;
import com.dancsopeter.photoalbum.service.PhotoService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;

@SpringBootApplication
public class PhotoAlbumBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(PhotoAlbumBackendApplication.class, args);
    }

    @Bean
    CommandLineRunner demo(PhotoService photoService) {
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
        };
    }
}
