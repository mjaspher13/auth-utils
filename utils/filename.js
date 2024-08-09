/**
 * Generates a file name string using the company name, the current date and time, 
 * and the active card label. The date and time are formatted as "MM_DD_YYYY_HH_mm_ss".
 *
 * @param {string} companyName - The name of the company to be included in the file name.
 * @param {object} labelKeys - An object containing various label keys, including `activeCards` 
 *                             which will be appended to the file name.
 * @returns {string} - A string representing the generated file name in the format:
 *                     "{companyName} {MM_DD_YYYY_HH_mm_ss} {activeCards}.xlsx"
 */
const generateFileName = (companyName, labelKeys) => {
    const now = new Date();
    
    // Format the current date and time as MM_DD_YYYY_HH_mm_ss
    const formattedDate = [
        String(now.getMonth() + 1).padStart(2, '0'), // Month (0-based index, so +1)
        String(now.getDate()).padStart(2, '0'),      // Day of the month
        now.getFullYear(),                           // Year
        String(now.getHours()).padStart(2, '0'),     // Hours (24-hour format)
        String(now.getMinutes()).padStart(2, '0'),   // Minutes
        String(now.getSeconds()).padStart(2, '0')    // Seconds
    ].join('_');
    
    // Return the formatted file name string
    return `${companyName} ${formattedDate} ${labelKeys.activeCards}.xlsx`;
};
