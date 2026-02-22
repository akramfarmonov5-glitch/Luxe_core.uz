import { supabase } from './supabaseClient';

const parseError = async (response: Response) => {
  try {
    const json = await response.json();
    return json?.error || `HTTP ${response.status}`;
  } catch {
    return `HTTP ${response.status}`;
  }
};

export const adminRequest = async <T = any>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  body?: Record<string, any>
): Promise<T> => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    throw new Error("Admin sessiya topilmadi. Qayta login qiling.");
  }

  const response = await fetch(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const message = await parseError(response);
    throw new Error(message);
  }

  const json = await response.json();
  return json as T;
};
