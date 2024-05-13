export const imperialDisplayLength = (length: number) => {
  if (length < 12) {
    return `${Math.round(length)}"`;
  }

  const ft = Math.floor(length / 12);
  const inches = length % 12;

  return `${ft}' ${Math.round(inches)}"`;
};

export const metricDisplayLength = (length: number) => {
  if (length >= 100) {
    return `${Math.round(length) / 100} M`;
  }

  return `${Math.round(length * 100) / 100} CM`;
};
