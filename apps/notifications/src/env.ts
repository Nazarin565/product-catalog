const required = [
  'AWS_SQS_ENDPOINT',
  'SQS_QUEUE_NAME',
] as const;

export function validateEnv(): void {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
