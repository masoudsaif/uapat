import { POSITIVE_NON_ZERO_NUMBER_REGEX } from "@/plan-creator/constants/regex";

export const isPositiveNonZeroNumber = (s: string) =>
  POSITIVE_NON_ZERO_NUMBER_REGEX.test(s);

export const roundTwoDecimal = (n: number) =>
  Math.round((n + Number.EPSILON) * 100) / 100;
