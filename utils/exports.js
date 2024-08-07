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

/**
 * Formats a phone number to a standard format.
 * @param {string} value - The phone number input.
 * @returns {string} - Formatted phone number.
 */
export function phoneNumberFormat(value) {
  // Remove all non-digit characters and limit to 10 digits
  let input = value.replace(/\D/g, '').substring(0, 10);
  const size = input.length;

  // Return formatted number based on its length
  if (size < 4) return input;
  if (size < 7) return `${input.substring(0, 3)} ${input.substring(3, 6)}`;
  return `${input.substring(0, 3)} ${input.substring(3, 6)} ${input.substring(6, 10)}`;
}

/**
 * Formats a phone number with country code to a readable format.
 * @param {string} value - The phone number input with country code.
 * @returns {string} - Formatted phone number.
 */
export function viewPhoneNumber(value) {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  // Extract the last 10 digits (local number)
  const last10 = digits.substr(-10);
  // Extract the country code
  const countryCode = digits.substr(0, digits.length - 10);

  // Combine country code and local number
  const input = `${countryCode} ${last10}`;
  // Split input into parts by space
  const parts = input.trim().split(' ');

  // Return the original input if it does not contain the expected parts
  if (parts.length < 2) return input;

  // Format the number into readable chunks
  const formattedNumber = `${parts[0]} ${parts[1].slice(0, 3)} ${parts[1].slice(3, 6)} ${parts[1].slice(6)}`;
  return formattedNumber;
}
