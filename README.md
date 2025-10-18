# Balinex Challenge Project

## Project Overview

A modern cryptocurrency tracking application built with Next.js 13, featuring real-time crypto data, search functionality, and responsive design. This project demonstrates advanced React patterns, performance optimization, and clean architecture.

**Developer**: Saeed Panahi  
**Contact**: panahi.projects@gmail.com

## 🛠 Tech Stack

- **Framework**: Next.js 13 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Code Quality**: ESLint, Prettier, Husky

## 🏗 Project Architecture

### Directory Structure

- **/features/** # Feature-based modules
- **/shared/** # Reusable components and utilities
- **/app/** # Next.js app router pages

### Key Architectural Decisions

- **Feature-based organization** for better scalability and maintainability
- **Shared component library** to promote reusability
- **Context API** for state management to avoid prop drilling
- **TypeScript** for type safety and better developer experience

## 🚀 Development Process

### Phase 1: Project Setup & Configuration

1. **Initialized** Next.js 13 project with TypeScript template
2. **Configured** development tools:
   - Husky for Git hooks
   - lint-staged for pre-commit checks
   - Prettier for code formatting
   - VS Code settings with Balinex color theme
3. **Set up** TailwindCSS with custom theme matching Balinex branding

### Phase 2: Core Components & Layout

4. **Implemented** responsive header and navigation components
5. **Added** authentication buttons to navbar
6. **Created** shared Card component for consistent UI
7. **Built** generic DataTable component with TypeScript generics
8. **Specialized** DataTable for cryptocurrency display (CryptoTable)

### Phase 3: Data Integration & Features

9. **Integrated** Farsi numeral font and price formatting utilities
10. **Implemented** dual data sourcing strategy:
    - Primary: Crypto API integration
    - Fallback: Web scraping with Cheerio
    - Priority mechanism for data source selection
11. **Added** real-time cryptocurrency data with pagination
12. **Implemented** advanced search with debounce functionality

### Phase 4: Advanced Features & Optimization

13. **Created** CryptoDetails page with comprehensive coin information
14. **Implemented** navigation between list and detail views
15. **Added** form for adding new cryptocurrencies (mock API)
16. **Built** text highlighting component for search results
17. **Optimized** rendering strategies:
    - Reduced Client-Side Rendering (CSR)
    - Implemented Incremental Static Regeneration (ISR)
    - Utilized Server-Side Rendering (SSR) where appropriate
18. **Enhanced** accessibility with proper ARIA tags and semantic HTML

## 🎯 Key Features

### Data Management

- **Generic DataTable**: Reusable component with pagination, sorting, and filtering
- **Dual Data Sources**: API + web scraping with fallback mechanism
- **Real-time Updates**: Live cryptocurrency pricing
- **Search & Filter**: Debounced search with text highlighting

### UI/UX

- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Balinex Theme**: Custom color scheme and styling
- **Pixel-Perfect**: Attention to detail in component styling
- **Accessibility**: WCAG compliant with proper semantic markup

### Performance

- **Code Splitting**: Lazy-loaded components for better initial load
- **Rendering Optimization**: Strategic use of SSR, SSG, and ISR
- **Bundle Optimization**: Tree-shaking and minimal dependencies

## 📦 Dependencies

```json
{
  "dependencies": {
    "next": "13.5.6",
    "react": "^18",
    "react-dom": "^18",
    "typescript": "^5",
    "tailwindcss": "^3",
    "axios": "^1.12.2",
    "cheerio": "^1.1.2",
    "lucide-react": "^0.546.0",
    "react-hook-form": "^7.65.0",
    "zod": "^4.1.12",
    "@hookform/resolvers": "^5.2.2"
  },
  "devDependencies": {
    "husky": "^9.1.7",
    "lint-staged": "^16.2.4",
    "eslint": "^8",
    "prettier": "^3.6.2"
  }
}
```

## 🔧 Development Environment

Node.js: v22.18.0

Package Manager: npm

IDE: VS Code with custom Balinex color theme

## 🚀 Getting Started

```sh
# Install dependencies
npm install
```

```sh
# Run development server
npm run dev
```

```sh
# Build for production
npm run build
```

```sh
# Start production server
npm start
```

## 📝 Code Quality

- Pre-commit hooks with Husky and lint-staged
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety
