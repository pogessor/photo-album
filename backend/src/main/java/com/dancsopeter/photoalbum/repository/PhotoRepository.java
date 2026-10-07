package com.dancsopeter.photoalbum.repository;

import com.dancsopeter.photoalbum.entity.Photo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {

    List<Photo> findByYear(Integer year);

    List<Photo> findByDescriptionContainingIgnoreCase(String keyword);

    /*@Query("""
        SELECT p FROM Photo p
        WHERE CAST(p.year AS String) LIKE CONCAT('%', :keyword, '%')
           OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))
        ORDER BY p.uploadedAt DESC
        """)
    List<Photo> searchByYearOrDescription(@Param("keyword") String keyword);*/
    
    @Query("""
        SELECT p FROM Photo p
        WHERE CAST(p.year AS String) LIKE :pattern
           OR LOWER(p.description) LIKE LOWER(:pattern)
        ORDER BY p.uploadedAt DESC
        """)
    List<Photo> searchByYearOrDescription(@Param("pattern") String pattern);
}
