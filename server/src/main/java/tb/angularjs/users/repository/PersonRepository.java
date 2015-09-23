package tb.angularjs.users.repository;

import tb.angularjs.users.model.Person;

import javax.transaction.Transactional;


@Transactional
public interface PersonRepository extends UserBaseRepository<Person> { }
