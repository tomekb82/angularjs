package tb.angularjs.service;

import tb.angularjs.config.audit.AuditEventConverter;
import org.joda.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.audit.AuditEvent;
import org.springframework.stereotype.Service;
import tb.angularjs.model.audit.PersistentAuditEvent;
import tb.angularjs.repository.audit.PersistenceAuditEventRepository;

//import javax.inject.Inject;
import java.util.List;

/**
 * Service for managing audit events.
 * <p/>
 * <p>
 * This is the default implementation to support SpringBoot Actuator AuditEventRepository
 * </p>
 */
@Service
public class AuditEventService {

    @Autowired//Inject
    private PersistenceAuditEventRepository persistenceAuditEventRepository;

    @Autowired//Inject
    private AuditEventConverter auditEventConverter;

    public List<AuditEvent> findAll() {
        return auditEventConverter.convertToAuditEvent(persistenceAuditEventRepository.findAll());
    }

    public List<AuditEvent> findByDates(LocalDateTime fromDate, LocalDateTime toDate) {
        List<PersistentAuditEvent> persistentAuditEvents =
            persistenceAuditEventRepository.findAllByAuditEventDateBetween(fromDate, toDate);

        return auditEventConverter.convertToAuditEvent(persistentAuditEvents);
    }
}
