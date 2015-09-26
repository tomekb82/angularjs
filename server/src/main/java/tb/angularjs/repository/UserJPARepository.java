package tb.angularjs.repository;

import tb.angularjs.model.UserJPA;

import javax.transaction.Transactional;


@Transactional
public interface UserJPARepository extends UserBaseRepository<UserJPA> { }
