import axios from "axios";
import * as cheerio from "cheerio";
import { randomUUID } from "crypto";

export interface CryptoCurrency {
  id: string;
  rank: string;
  name: string;
  symbol: string;
  price: string;
  change24h: string;
  image?: string;
  volume24h: string;
  marketCap?: string;
}

export async function scrapeCryptoData(url: string): Promise<CryptoCurrency[]> {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; NextScraperBot/1.0)",
      },
    });

    const $ = cheerio.load(html);
    const cryptoData: CryptoCurrency[] = [];

    let c = 0;
    $("table tbody tr").each((_, el) => {
      c++;
      const tds = $(el).find("td");

      let rank = $(tds[0]).text().trim() || c.toString();
      const name = $(tds[1]).find("a").last().text().trim().split(" ")[0] || "";
      const symbol = $(tds[1]).find("a").first().text().trim();
      const image = $(tds[1]).find("img").attr("src") || "";
      const marketCap = $(tds[3]).find("span").first().text().trim();
      const price = $(tds[4]).find("span").first().text().trim();
      const volume24h = $(tds[6]).text().trim();
      const change24h = $(tds[8]).text().trim();

      if (!name) return; // skip empty rows

      cryptoData.push({
        id: `${name}_${randomUUID()}`,
        rank,
        name,
        symbol,
        image,
        price,
        marketCap,
        volume24h,
        change24h,
      });
    });

    return cryptoData;
  } catch (error: any) {
    console.error("Failed to scrape crypto data:", error);
    return [];
  }
}
