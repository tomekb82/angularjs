package tb.angularjs.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.NoRepositoryBean;
import tb.angularjs.model.UserJPA;


@NoRepositoryBean
public interface UserBaseRepository<T extends UserJPA>
extends CrudRepository<T, Long> {

  /**
   * Method findByEmail
   * 
   * @param email the user email.
   * @return the user having the passed email or null if no user is found.
   */
  public T findByEmail(String email);
  
} // UserBaseRepository
