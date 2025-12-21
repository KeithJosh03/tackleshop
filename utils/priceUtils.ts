export const numericConverter = (number: string): string => {
  let numericPrice = Number(number);
  let formattedNumber = numericPrice.toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formattedNumber;
};


// UnitPriceDiscount function - returns formatted discounted price as a string
export const UnitPriceDiscount = (productPrice: string, discountValue: string): string => {
  const discountedPrice = (parseFloat(productPrice) - parseFloat(discountValue)).toFixed(2);
  return numericConverter(discountedPrice); 
};

// PercentPriceDiscount function - returns formatted discounted price as a string
export const PercentPriceDiscount = (productPrice: string, discountValue: string): string => {
  const price = parseFloat(productPrice);
  const discountPercent = parseFloat(discountValue);
  const discountedPrice = (price - (price * discountPercent / 100)).toFixed(2);
  return numericConverter(discountedPrice); 
};
