export const formatPrice = (number) => {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(number / 100);
};

export const getUniqueValues = (allProducts, type) => {
  let unique = allProducts.map((product) => product[type]);
  if (type === "colors") unique = unique.flat(); //colors are in an array
  const uniqueSet = new Set(unique);
  return ["all", ...uniqueSet];
};
