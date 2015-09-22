package tb.angularjs.users.dao;

import org.springframework.data.repository.CrudRepository;
import tb.angularjs.users.model.User;

import javax.transaction.Transactional;

/**
 * Created by tomek on 22.09.15.
 */
@Transactional
public interface UserDao extends CrudRepository<User, Long> {

    /**
     * Return the user having the passed email or null if no user is found.
     *
     * @param email the user email.
     */
    public User findByEmail(String email);

} // class UserDao