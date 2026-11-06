const base = import.meta.env.BASE_URL.replace(/\/$/, "");
const mediaBase = (import.meta.env.PUBLIC_MEDIA_BASE_URL || base).replace(/\/$/, "");

export function withBase(pathname: string) {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${path}` || "/";
}

export function withMediaBase(pathname: string) {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${mediaBase}${path}` || "/";
}
