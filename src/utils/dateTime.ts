export function convertTimestampToDateString(timestampInSeconds: number) {
  const dateObject = new Date(timestampInSeconds * 1000);
  return dateObject.toUTCString();
}

export function nowTimestamp(): number {
  return Date.now() / 1000;
}

export async function waitSeconds(seconds: number) {
  await new Promise((e) => setTimeout(e, seconds * 1000));
}
