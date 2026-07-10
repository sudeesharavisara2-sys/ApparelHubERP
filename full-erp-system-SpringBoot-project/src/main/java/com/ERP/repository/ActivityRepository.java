package com.ERP.repository;
import com.ERP.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {}
