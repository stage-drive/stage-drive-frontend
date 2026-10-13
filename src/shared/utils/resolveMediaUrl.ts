const ABSOLUTE_URL = /^(https?:|data:|blob:)/i;

export const resolveMediaUrl = (
  value?: string | null,
  apiBase: string | undefined = import.meta.env.VITE_API_URL,
): string | undefined => {
  if (!value) return undefined;
  if (ABSOLUTE_URL.test(value)) return value;

  const path = value.startsWith('/') ? value : `/${value}`;
  if (!apiBase || apiBase.startsWith('/')) return path;

  return `${new URL(apiBase).origin}${path}`;
};
