package com.ERP.controller;

import com.ERP.dto.ApiResponse;
import com.ERP.entity.*;
import com.ERP.exception.ResourceNotFoundException;
import com.ERP.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/assets")
@RequiredArgsConstructor
public class AssetController {
    private final AssetRepository assetRepo;
    private final AssetMaintenanceRepository maintenanceRepo;
    private final AssetTransferRepository transferRepo;
    private final AssetDepreciationRepository depreciationRepo;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Asset>>> getAll(
            @RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="20") int size) {
        return ResponseEntity.ok(ApiResponse.success(assetRepo.findAll(PageRequest.of(page, size))));
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Asset>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
            assetRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Asset not found: " + id))));
    }
    @PostMapping
    public ResponseEntity<ApiResponse<Asset>> create(@RequestBody Asset a) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Created", assetRepo.save(a)));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Asset>> update(@PathVariable Long id, @RequestBody Asset a) {
        if (!assetRepo.existsById(id)) throw new ResourceNotFoundException("Asset not found: " + id);
        a.setId(id); return ResponseEntity.ok(ApiResponse.success("Updated", assetRepo.save(a)));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        assetRepo.deleteById(id); return ResponseEntity.ok(ApiResponse.success("Deleted"));
    }

    // Maintenance
    @GetMapping("/maintenance")
    public ResponseEntity<ApiResponse<Page<AssetMaintenance>>> getMaintenance(
            @RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="20") int size) {
        return ResponseEntity.ok(ApiResponse.success(maintenanceRepo.findAll(PageRequest.of(page, size))));
    }
    @PostMapping("/maintenance")
    public ResponseEntity<ApiResponse<AssetMaintenance>> createMaintenance(@RequestBody AssetMaintenance m) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Created", maintenanceRepo.save(m)));
    }
    @PutMapping("/maintenance/{id}")
    public ResponseEntity<ApiResponse<AssetMaintenance>> updateMaintenance(@PathVariable Long id, @RequestBody AssetMaintenance m) {
        if (!maintenanceRepo.existsById(id)) throw new ResourceNotFoundException("Maintenance not found: " + id);
        m.setId(id); return ResponseEntity.ok(ApiResponse.success("Updated", maintenanceRepo.save(m)));
    }
    @DeleteMapping("/maintenance/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMaintenance(@PathVariable Long id) {
        maintenanceRepo.deleteById(id); return ResponseEntity.ok(ApiResponse.success("Deleted"));
    }

    // Transfers
    @GetMapping("/transfers")
    public ResponseEntity<ApiResponse<Page<AssetTransfer>>> getTransfers(
            @RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="20") int size) {
        return ResponseEntity.ok(ApiResponse.success(transferRepo.findAll(PageRequest.of(page, size))));
    }
    @PostMapping("/transfers")
    public ResponseEntity<ApiResponse<AssetTransfer>> createTransfer(@RequestBody AssetTransfer t) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Created", transferRepo.save(t)));
    }
    @PutMapping("/transfers/{id}")
    public ResponseEntity<ApiResponse<AssetTransfer>> updateTransfer(@PathVariable Long id, @RequestBody AssetTransfer t) {
        if (!transferRepo.existsById(id)) throw new ResourceNotFoundException("Transfer not found: " + id);
        t.setId(id); return ResponseEntity.ok(ApiResponse.success("Updated", transferRepo.save(t)));
    }
    @DeleteMapping("/transfers/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTransfer(@PathVariable Long id) {
        transferRepo.deleteById(id); return ResponseEntity.ok(ApiResponse.success("Deleted"));
    }

    // Depreciation
    @GetMapping("/depreciation")
    public ResponseEntity<ApiResponse<Page<AssetDepreciation>>> getDepreciation(
            @RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="20") int size) {
        return ResponseEntity.ok(ApiResponse.success(depreciationRepo.findAll(PageRequest.of(page, size))));
    }
    @PostMapping("/depreciation")
    public ResponseEntity<ApiResponse<AssetDepreciation>> createDepreciation(@RequestBody AssetDepreciation d) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Created", depreciationRepo.save(d)));
    }
    @DeleteMapping("/depreciation/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDepreciation(@PathVariable Long id) {
        depreciationRepo.deleteById(id); return ResponseEntity.ok(ApiResponse.success("Deleted"));
    }
}
