package com.cntt.rentalmanagement.domain.enums;

public enum RoleName {
    ROLE_USER(" ROLE_USER"),
    ROLE_ADMIN("ROLE_ADMIN"),
    ROLE_landlord("ROLE_landlord");


    private String value;

    RoleName(String value){
        this.value = value;
    }

    public String getValue(){
        return this.value;
    }
}
