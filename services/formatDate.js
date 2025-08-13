// Function to format dates correctly (ensure YYYY-MM-DD format or return null for invalid dates)
function formatDate(date) {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return null; // Return null if the date is invalid
  }
  return parsedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
}

module.exports = formatDate