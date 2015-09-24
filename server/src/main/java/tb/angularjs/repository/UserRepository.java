package tb.angularjs.repository;

import tb.angularjs.model.User;

import javax.transaction.Transactional;


@Transactional
public interface UserRepository extends UserBaseRepository<User> { }
