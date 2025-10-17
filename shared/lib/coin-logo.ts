/**
 * Returns the first valid logo URL from multiple sources.
 * This is a synchronous version that doesn't validate URLs.
 * For validation, use getValidCoinLogoAsync on the server side.
 */
export function getValidCoinLogo(symbol: string, name?: string): string {
  const sym = symbol?.toLowerCase().trim();
  return `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${sym}.png`;
}

/**
 * Server-side function to validate and return the first valid logo URL.
 * Use this in API routes or server components.
 */
export async function getValidCoinLogoAsync(
  symbol: string,
  name?: string
): Promise<string> {
  const sym = symbol?.toLowerCase().trim();
  const nm = name?.toLowerCase().replace(/\s+/g, "-").trim();

  const urls = [
    // 1: CryptoLogos.cc
    `https://cryptologos.cc/logos/${nm || sym}-${sym}-logo.svg?v=040`,
    // 2: CoinIcons GitHub
    `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${sym}.png`,
  ];

  const fallback = "/images/coin-placeholder.webp";

  for (const url of urls) {
    try {
      const res = await fetch(url, { method: "HEAD" }); // only check headers, not full download
      if (res.ok) return url; // 200 OK
    } catch {
      // ignore and try next
    }
  }

  return fallback; // none of the URLs worked
}
