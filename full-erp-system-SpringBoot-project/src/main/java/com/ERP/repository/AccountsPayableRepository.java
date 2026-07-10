package com.ERP.repository;
import com.ERP.entity.AccountsPayable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface AccountsPayableRepository extends JpaRepository<AccountsPayable, Long> {
    Page<AccountsPayable> findByStatus(String status, Pageable pageable);
}
