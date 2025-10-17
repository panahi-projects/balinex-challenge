/**
 * Returns the first valid logo URL from multiple sources.
 */
export async function getValidCoinLogo(
  symbol: string,
  name?: string
): Promise<string> {
  const sym = symbol?.toLowerCase().trim();
  const nm = name?.toLowerCase().replace(/\s+/g, "-");

  const urls = [
    // 1: CryptoLogos.cc
    `https://cryptologos.cc/logos/${nm || sym}-${sym}-logo.svg?v=040`,
    // 2: jsDelivr cryptocoins-icons
    `https://cdn.jsdelivr.net/npm/cryptocoins-icons@2.9.0/svg/color/${sym}.svg`,
    // 3: CoinIcons GitHub
    `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${sym}.png`,
  ];

  const fallback =
    "https://upload.wikimedia.org/wikipedia/commons/8/89/HD_transparent_picture.png";

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
