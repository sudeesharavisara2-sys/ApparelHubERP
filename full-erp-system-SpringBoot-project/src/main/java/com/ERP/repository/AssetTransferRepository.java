package com.ERP.repository;
import com.ERP.entity.AssetTransfer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface AssetTransferRepository extends JpaRepository<AssetTransfer, Long> {}
