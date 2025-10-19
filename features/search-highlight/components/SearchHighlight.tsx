"use client";

import { useState, useMemo } from "react";
import styles from "./SearchHighlight.module.css";

const SearchHighlight = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const paragraphText = `Paragraphs are the building blocks of papers. Many students define paragraphs in terms of length: a paragraph is a group of at least five sentences, a paragraph is half a page long, etc. In reality, though, the unity and coherence of ideas among sentences is what constitutes a paragraph. A paragraph is defined as “a group of sentences or a single sentence that forms a unit” (Lunsford and Connors 116). Length and appearance do not determine whether a section in a paper is a paragraph. For instance, in some styles of writing, particularly journalistic styles, a paragraph can be just one sentence long. Ultimately, a paragraph is a sentence or group of sentences that support one main idea. In this handout, we will refer to this as the “controlling idea,” because it controls what happens in the rest of the paragraph.`;

  const highlightedText = useMemo(() => {
    if (!searchTerm.trim()) return paragraphText;

    const regex = new RegExp(
      `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = paragraphText.split(regex);

    return parts.map((part, index) => {
      if (regex.test(part)) {
        return (
          <span key={index} className={styles.highlightedWord} data-text={part}>
            {part}
          </span>
        );
      }
      return part;
    });
  }, [paragraphText, searchTerm]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>جستجوی متنی</h1>

      <div className={styles.searchContainer}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="متن مورد نظر را وارد کنید"
          className={styles.searchInput}
        />
      </div>

      <div className={styles.paragraphContainer}>
        <p className={styles.highlightParagraph}>{highlightedText}</p>
      </div>
    </div>
  );
};

export default SearchHighlight;
