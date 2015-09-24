package tb.angularjs.repository;

import tb.angularjs.model.Company;

import javax.transaction.Transactional;


@Transactional
public interface CompanyRepository extends UserBaseRepository<Company> { }
