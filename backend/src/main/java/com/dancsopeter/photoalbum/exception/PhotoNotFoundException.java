package com.dancsopeter.photoalbum.exception;

public class PhotoNotFoundException extends RuntimeException {

    public PhotoNotFoundException(Long id) {
        super("Fotó nem található: id=" + id);
    }
}