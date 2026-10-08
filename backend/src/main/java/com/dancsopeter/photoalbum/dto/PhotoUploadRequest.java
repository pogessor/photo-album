package com.dancsopeter.photoalbum.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;

public record PhotoUploadRequest(
        @NotNull(message = "A fájl kötelező.")
        MultipartFile file,

        @NotNull(message = "Az évszám kötelező.")
        @Min(value = 1000, message = "Az évszámnak négyjegyűnek kell lennie (1000-9999).")
        @Max(value = 9999, message = "Az évszámnak négyjegyűnek kell lennie (1000-9999).")
        Integer year,

        @Size(max = 1000, message = "A leírás legfeljebb 1000 karakter lehet.")
        String description
) {
}