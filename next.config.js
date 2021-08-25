module.exports = (phase, { defaultConfig }) => {
  const nextConfig = {
    /* config options here */
    env: {
      NEXT_PUBLIC_CLIENT_ID: process.env.NEXT_PUBLIC_CLIENT_ID,
      NEXT_PUBLIC_CLIENT_SECRET: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      NEXT_PUBLIC_GRANT_TYPE: process.env.NEXT_PUBLIC_GRANT_TYPE,
    },
  };
  return nextConfig;
};
