package tb.angularjs.repository.audit;

import org.joda.time.LocalDateTime;
import org.springframework.data.jpa.repository.JpaRepository;
import tb.angularjs.model.audit.PersistentAuditEvent;

import java.util.List;

/**
 * Spring Data JPA repository for the PersistentAuditEvent entity.
 */
public interface PersistenceAuditEventRepository extends JpaRepository<PersistentAuditEvent, String> {

    List<PersistentAuditEvent> findByPrincipal(String principal);

    List<PersistentAuditEvent> findByPrincipalAndAuditEventDateAfter(String principal, LocalDateTime after);

    List<PersistentAuditEvent> findAllByAuditEventDateBetween(LocalDateTime fromDate, LocalDateTime toDate);
}
