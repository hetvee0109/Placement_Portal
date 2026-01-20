package com.placement.management.dto;

import com.placement.management.entity.Application;
import java.util.List;

public class CompanyApplicationsDTO {

    private String companyName;
    private List<Application> applications;

    public CompanyApplicationsDTO(String companyName, List<Application> applications) {
        this.companyName = companyName;
        this.applications = applications;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public List<Application> getApplications() {
        return applications;
    }

    public void setApplications(List<Application> applications) {
        this.applications = applications;
    }
}
