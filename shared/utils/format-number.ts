export const formatPrice = (input: number | string) => {
  // Convert input to number
  const num = typeof input === "string" ? parseFloat(input) : input;

  // Check if the input is a valid number
  if (isNaN(num)) {
    throw new Error("Invalid input: must be a valid number or numeric string");
  }

  // Format the number with commas and handle decimals
  const parts = num.toString().split(".");
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // If there's a decimal part, include it
  if (parts.length > 1) {
    return `${integerPart}/${parts[1]}`;
  }

  return integerPart;
};
