/** IANA timezone used to display telemetry timestamps in the UI. */
export const APP_DISPLAY_TIMEZONE = 'America/Lima';

/** Parse an ISO-8601 timestamp from the API as UTC. */
export function parseUtcTimestamp(value: string): Date {
  const trimmed = value.trim();
  if (/(?:Z|[+-]\d{2}:\d{2})$/.test(trimmed)) {
    return new Date(trimmed);
  }
  return new Date(`${trimmed}Z`);
}
