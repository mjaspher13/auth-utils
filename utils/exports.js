// Optimized and exported mapping function for handling export cards based on user roles
export const handleExportCards = (records, props) => {
  return records.map((obj) => {
    const {
      name,
      cardNumber,
      employeeId,
      creditLimit,
      validFrom,
      validTo,
      field1,
      field2,
      field3,
      notes,
      cardCreatedTime,
      creatorname,
      approvername,
      emailId,
      osn,
      mobileNumber,
      serviceInterface,
      FLAT,
      STREET_ADDRESS,
      companyname,
      CITY,
      COUNTRY,
      ZIP_CODE,
      businessNumber,
    } = obj;

    const commonData = {
      name,
      cardNumber,
      employeeID: employeeId,
      creditLimit,
      validFrom,
      validTo,
      field1,
      field2,
      field3,
      notes,
      dateCreated: cardCreatedTime,
      createdBy: creatorname,
      approverName: approvername || "not applicable",
      emailID: emailId,
      mobileNumber: viewPhoneNumber(mobileNumber),
      accountID: osn,
    };

    const isPrivilegedRole =
      props.roles === "Super Admin" || props.roles === "Customer Support";
    const additionalData = isPrivilegedRole
      ? {
          billingAddress: `${FLAT || ""} ${STREET_ADDRESS || ""}`.trim(),
          companyName: companyname || "",
          city: CITY || "",
          county: COUNTRY || "",
          zipCode: ZIP_CODE || "",
          businessNumber: viewPhoneNumber(businessNumber),
        }
      : {};

    if (props.theme === "elan" && serviceInterface?.includes("Elan EasyPay")) {
      commonData.accountID += " IC";
    }

    return { ...commonData, ...additionalData };
  });
};
