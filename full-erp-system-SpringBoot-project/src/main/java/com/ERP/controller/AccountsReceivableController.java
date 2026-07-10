package com.ERP.controller;

import com.ERP.dto.ApiResponse;
import com.ERP.entity.AccountsReceivable;
import com.ERP.exception.ResourceNotFoundException;
import com.ERP.repository.AccountsReceivableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/accounts-receivable")
@RequiredArgsConstructor
public class AccountsReceivableController {
    private final AccountsReceivableRepository repo;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<AccountsReceivable>>> getAll(
            @RequestParam(required=false) String status,
            @RequestParam(defaultValue="0") int page,
            @RequestParam(defaultValue="20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("dueDate").ascending());
        Page<AccountsReceivable> result = status != null ? repo.findByStatus(status, pageable) : repo.findAll(pageable);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountsReceivable>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
            repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("AR not found: " + id))));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AccountsReceivable>> create(@RequestBody AccountsReceivable ar) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Created", repo.save(ar)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountsReceivable>> update(@PathVariable Long id, @RequestBody AccountsReceivable ar) {
        if (!repo.existsById(id)) throw new ResourceNotFoundException("AR not found: " + id);
        ar.setId(id);
        return ResponseEntity.ok(ApiResponse.success("Updated", repo.save(ar)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted"));
    }
}
