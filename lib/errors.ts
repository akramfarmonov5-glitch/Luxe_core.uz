/**
 * Xatolik obyektidan xavfsiz xabar olish.
 *
 * `catch (err: any)` o'rniga `catch (err: unknown)` ishlatish uchun —
 * TypeScript'da `useUnknownInCatchVariables` yoqilganda ham kod ishlaydi.
 */
export function getErrorMessage(error: unknown, fallback = 'Server xatoligi'): string {
  if (typeof error === 'string' && error.trim().length > 0) {
    return error;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (error && typeof error === 'object') {
    const maybeMessage = (error as { message?: unknown }).message;
    if (typeof maybeMessage === 'string' && maybeMessage.trim().length > 0) {
      return maybeMessage;
    }
  }

  return fallback;
}

/** Supabase/PostgREST xatolarida `code` maydoni bo'ladi (masalan `PGRST202`). */
export function getErrorCode(error: unknown): string | undefined {
  if (error && typeof error === 'object') {
    const code = (error as { code?: unknown }).code;
    if (typeof code === 'string') return code;
  }
  return undefined;
}

/** RPC/funksiya bazada mavjud emasligini bildiruvchi xatolar. */
export function isMissingRpcError(error: unknown): boolean {
  const code = getErrorCode(error);
  const message = getErrorMessage(error, '');

  return (
    code === 'PGRST202' ||
    code === '42883' ||
    /could not find the function|function .* does not exist/i.test(message)
  );
}
