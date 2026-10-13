package com.avsarverse.backend.repository;

import com.avsarverse.backend.entity.Opportunity;
import com.avsarverse.backend.entity.OpportunityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OpportunityRepository extends JpaRepository<Opportunity, Long> {

    List<Opportunity> findByType(OpportunityType type);

    @Query("SELECT DISTINCT o FROM Opportunity o WHERE " +
           "(:type IS NULL OR o.type = :type) AND " +
           "(:q IS NULL OR :q = '' OR " +
           "LOWER(o.title) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(o.subtitle) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(o.description) LIKE LOWER(CONCAT('%', :q, '%')))")
    List<Opportunity> searchOpportunities(@Param("type") OpportunityType type, @Param("q") String q);
}
