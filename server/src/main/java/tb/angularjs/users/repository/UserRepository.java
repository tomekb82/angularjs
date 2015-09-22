package tb.angularjs.users.repository;

import tb.angularjs.users.model.User;

import javax.transaction.Transactional;


@Transactional
public interface UserRepository extends UserBaseRepository<User> { }
