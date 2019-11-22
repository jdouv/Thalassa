package Thalassa.DataManagement.Services;

import Thalassa.DataManagement.Repositories.CompanyRepository;
import Thalassa.Models.Company;
import org.springframework.stereotype.Service;

@Service
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyServiceImpl(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @Override
    public Company findByName(String name) {
        return companyRepository.findByName(name);
    }

    @Override
    public Company findByRegistryNumber(String registryNumber) {
        return companyRepository.findByRegistryNumber(registryNumber);
    }

    @Override
    public void save(Company company) {
        companyRepository.save(company);
    }
}
