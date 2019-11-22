package Thalassa.DataManagement.Services;

import Thalassa.Models.Company;

public interface CompanyService {
    Company findByName(String name);
    Company findByRegistryNumber(String registryNumber);
    void save(Company company);
}
