package tb.angularjs.users.repository;

import tb.angularjs.users.model.Company;

import javax.transaction.Transactional;


@Transactional
public interface CompanyRepository extends UserBaseRepository<Company> { }
