package tb.angularjs.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tb.angularjs.model.Authority;

/**
 * Spring Data JPA repository for the Authority entity.
 */
public interface AuthorityRepository extends JpaRepository<Authority, String> {
}