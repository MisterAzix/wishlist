/** Keep local assets valid at / and at a GitHub Pages project subpath. */
export function assetPath(path: string): string {
  return `${import.meta.env.BASE_URL.replace(/\/$/, "")}${path}`;
}
