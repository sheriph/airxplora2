module.exports = (phase, { defaultConfig }) => {
  const nextConfig = {
    /* config options here */
    env: {
      NEXT_PUBLIC_CLIENT_ID: process.env.NEXT_PUBLIC_CLIENT_ID,
      NEXT_PUBLIC_CLIENT_SECRET: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      NEXT_PUBLIC_GRANT_TYPE: process.env.NEXT_PUBLIC_GRANT_TYPE,
      NEXT_PUBLIC_DB_HOST: process.env.NEXT_PUBLIC_DB_HOST,
      NEXT_PUBLIC_DB_USER: process.env.NEXT_PUBLIC_DB_USER,
      NEXT_PUBLIC_DB_PASSWORD: process.env.NEXT_PUBLIC_DB_PASSWORD,
      NEXT_PUBLIC_DB: process.env.NEXT_PUBLIC_DB,
      MONGODB_URI: process.env.MONGODB_URI,
      AUTH0_SECRET: process.env.AUTH0_SECRET,
      AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
      AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
      AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
      AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    },
  };
  return nextConfig;
};
