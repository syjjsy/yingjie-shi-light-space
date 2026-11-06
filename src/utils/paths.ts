const base = import.meta.env.BASE_URL.replace(/\/$/, "");

export function withBase(pathname: string) {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${path}` || "/";
}
