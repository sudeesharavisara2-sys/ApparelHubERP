package com.ERP.controller;

import com.ERP.dto.ApiResponse;
import com.ERP.entity.AccountsPayable;
import com.ERP.exception.ResourceNotFoundException;
import com.ERP.repository.AccountsPayableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/accounts-payable")
@RequiredArgsConstructor
public class AccountsPayableController {
    private final AccountsPayableRepository repo;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<AccountsPayable>>> getAll(
            @RequestParam(required=false) String status,
            @RequestParam(defaultValue="0") int page,
            @RequestParam(defaultValue="20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("dueDate").ascending());
        Page<AccountsPayable> result = status != null ? repo.findByStatus(status, pageable) : repo.findAll(pageable);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountsPayable>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
            repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("AP not found: " + id))));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AccountsPayable>> create(@RequestBody AccountsPayable ap) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Created", repo.save(ap)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountsPayable>> update(@PathVariable Long id, @RequestBody AccountsPayable ap) {
        if (!repo.existsById(id)) throw new ResourceNotFoundException("AP not found: " + id);
        ap.setId(id);
        return ResponseEntity.ok(ApiResponse.success("Updated", repo.save(ap)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted"));
    }
}
