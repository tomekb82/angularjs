package tb.angularjs.repository;

import tb.angularjs.model.Person;

import javax.transaction.Transactional;


@Transactional
public interface PersonRepository extends UserBaseRepository<Person> { }
