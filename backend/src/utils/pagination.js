export const parsePositivePage = (value, fallback = 1) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const parsePositiveLimit = (value, fallback = 10, max = 50) => {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.min(parsed, max);
};

export const emptyLookupPipeline = [{ $match: { _id: null } }];
