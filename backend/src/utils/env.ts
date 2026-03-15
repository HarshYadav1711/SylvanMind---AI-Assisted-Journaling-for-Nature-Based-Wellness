function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`Missing required env: ${key}`);
  }
  return value;
}

export const env = {
  port: () => parseInt(getEnv("PORT", "3001"), 10),
  mongodbUri: () => getEnv("MONGODB_URI", "mongodb://localhost:27017/sylvanmind"),
  huggingfaceApiKey: () => process.env.HUGGINGFACE_API_KEY ?? "",
};
