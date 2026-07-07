/**
 * Maps API failures to i18n keys stored in signals and rendered with `| translate`.
 */
export function apiErrorKey(fallbackKey: string, error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    if (message.includes('unauthorized') || message.includes('401')) {
      return 'errors.unauthorized';
    }
    if (message.includes('resource not found') || message.includes('not found') || message.includes('404')) {
      return 'errors.not-found';
    }
  }
  return fallbackKey;
}
