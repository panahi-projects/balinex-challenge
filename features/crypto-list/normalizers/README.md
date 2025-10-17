# Crypto Data Normalizer System

This system provides a unified way to handle data from different cryptocurrency data sources, ensuring consistent data structure regardless of the source.

## Overview

The normalizer system consists of:

- **Type definitions** for different data sources
- **Individual normalizers** for each data source
- **Factory pattern** for easy normalizer management
- **Automatic source detection** and validation

## Supported Data Sources

### 1. CoinGecko API

- **Source**: `coinGecko`
- **Raw Data**: CoinGecko API response from `/coins/markets`
- **Normalizer**: `CoinGeckoNormalizer`

### 2. Scraping Fallback

- **Source**: `scraping`
- **Raw Data**: Scraped data from CoinMarketCap
- **Normalizer**: `ScrapingNormalizer`

## Usage Examples

### Basic Usage with Automatic Detection

```typescript
import { normalizeCryptoData } from "@/features/crypto-list/normalizers";

// Automatically detect source and normalize
const normalizedData = normalizeCryptoData(rawData);
```

### Usage with Explicit Source

```typescript
import { normalizeCryptoDataWithSource } from "@/features/crypto-list/normalizers";

// Explicitly specify source
const normalizedData = normalizeCryptoDataWithSource(rawData, "coinGecko");
```

### Using the Factory Directly

```typescript
import { NormalizerFactory } from "@/features/crypto-list/normalizers";

// Get specific normalizer
const normalizer = NormalizerFactory.getNormalizer("coinGecko");
const normalizedData = normalizer.normalize(rawData);

// Detect source from data
const source = NormalizerFactory.detectDataSource(rawData);
```

## Data Structure

All normalizers output data in the unified `CryptoCurrency` format:

```typescript
interface CryptoCurrency {
  id: string;
  rank: string;
  name: string;
  symbol: string;
  price: string;
  image?: string;
  change24h: string;
  volume24h: string;
  marketCap?: string;
}
```

## Adding New Data Sources

1. **Define the raw data interface**:

```typescript
interface MyNewSourceData {
  // Define the structure
}
```

2. **Create a normalizer**:

```typescript
export class MyNewSourceNormalizer
  implements CryptoDataNormalizer<MyNewSourceData>
{
  normalize(data: MyNewSourceData[]): CryptoCurrency[] {
    // Implementation
  }

  validate(data: MyNewSourceData[]): boolean {
    // Validation logic
  }
}
```

3. **Register the normalizer**:

```typescript
NormalizerFactory.registerNormalizer(
  "myNewSource",
  () => new MyNewSourceNormalizer()
);
```

## Error Handling

The system includes comprehensive error handling:

- **Validation errors**: When data doesn't match expected structure
- **Source detection errors**: When source cannot be determined
- **Normalization errors**: When data transformation fails

## Features

- ✅ **Type Safety**: Full TypeScript support
- ✅ **Validation**: Data validation before normalization
- ✅ **Flexibility**: Easy to add new data sources
- ✅ **Consistency**: Unified output format
- ✅ **Error Handling**: Comprehensive error management
- ✅ **Auto-detection**: Automatic source detection
- ✅ **Formatting**: Consistent data formatting (prices, percentages, etc.)
