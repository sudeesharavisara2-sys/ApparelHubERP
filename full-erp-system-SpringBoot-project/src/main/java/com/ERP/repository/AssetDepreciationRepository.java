package com.ERP.repository;
import com.ERP.entity.AssetDepreciation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface AssetDepreciationRepository extends JpaRepository<AssetDepreciation, Long> {}
