const parseList = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .map((item) => item.replace(/\/+$/, ""))
    .filter(Boolean);

export const isProduction = process.env.NODE_ENV === "production";

export const port = process.env.PORT || 8000;

const defaultFrontendUrls = isProduction
  ? ["https://video-app-wheat-eight.vercel.app"]
  : ["http://localhost:5173"];

export const frontendUrls = [
  ...parseList(process.env.FRONTEND_URL),
  ...parseList(process.env.FRONTEND_URLS),
  ...parseList(process.env.FRONT_END_URL),
  ...parseList(process.env.FRONT_END_URLS),
  ...parseList(process.env.FRONTH_END_URL),
  ...parseList(process.env.FRONTH_END_URLS),
  ...parseList(process.env.CLIENT_URL),
  ...parseList(process.env.CLIENT_URLS),
  ...defaultFrontendUrls,
];

export const corsOrigins = Array.from(new Set(frontendUrls));

export const socketCorsOrigin = corsOrigins.length ? corsOrigins : false;

export const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
};

export const getMongoUri = () => {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }

  if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URI or MONGODB_URL is required");
  }

  return process.env.DB_NAME
    ? `${process.env.MONGODB_URL}/${process.env.DB_NAME}`
    : process.env.MONGODB_URL;
};
