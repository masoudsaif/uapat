export const inchesToFeetAndInches = (inch: number) => {
  const ft = Math.floor(inch / 12);
  const inches = inch % 12;

  return { ft, inches: Math.round(inches) };
};
