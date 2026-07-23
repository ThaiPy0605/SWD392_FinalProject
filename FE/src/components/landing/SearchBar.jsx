import React, { useEffect, useState } from 'react';

const SEARCH_PROMPTS = [
  'Search robotics kits...',
  'Search electronics projects...',
  'Search kits for ages 8–12...',
  'Search classroom bundles...',
];

const SearchBar = ({ value = '', onChange, compact = false }) => {
  const [promptIndex, setPromptIndex] = useState(0);
  const [animatedPrompt, setAnimatedPrompt] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (value) {
      setAnimatedPrompt('');
      setIsDeleting(false);
      return undefined;
    }

    const targetPrompt = SEARCH_PROMPTS[promptIndex];
    let delay = isDeleting ? 36 : 68;

    if (!isDeleting && animatedPrompt === targetPrompt) {
      delay = 1200;
    } else if (isDeleting && animatedPrompt === '') {
      delay = 260;
    }

    const timer = window.setTimeout(() => {
      if (!isDeleting && animatedPrompt === targetPrompt) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && animatedPrompt === '') {
        setIsDeleting(false);
        setPromptIndex((current) => (current + 1) % SEARCH_PROMPTS.length);
        return;
      }

      setAnimatedPrompt(
        isDeleting
          ? targetPrompt.slice(0, Math.max(0, animatedPrompt.length - 1))
          : targetPrompt.slice(0, animatedPrompt.length + 1),
      );
    }, delay);

    return () => window.clearTimeout(timer);
  }, [animatedPrompt, isDeleting, promptIndex, value]);

  return (
    <label className={`landing-search ${compact ? 'landing-search--compact' : ''}`}>
      <span className="sr-only">Search products</span>
      <span className="material-symbols-outlined landing-search__icon" aria-hidden="true">
        search
      </span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={value ? '' : animatedPrompt}
        className="landing-search__input"
      />
      {value && (
        <button
          type="button"
          className="landing-search__clear"
          onClick={() => onChange?.('')}
          aria-label="Clear search"
        >
          <span className="material-symbols-outlined" aria-hidden="true">close</span>
        </button>
      )}
    </label>
  );
};

export default SearchBar;
