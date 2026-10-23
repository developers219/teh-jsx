import { useEffect, useState } from "react";

/**
 * Search input with an animated (typewriter) placeholder.
 * Controlled input; extra props (focus / keyboard) let the parent attach
 * a suggestions dropdown without changing the design.
 *
 * The "Search your next destination," prefix behaves like a placeholder:
 * it is visible only while the input is empty.
 */
export default function Typewriter({
  words,
  value,
  onChange,
  onFocus,
  onKeyDown,
  ariaLabel = "Search destinations",
}) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    if (!words?.length) return undefined;

    // words can change (loaded from the backend), so keep the index in range
    const currentWord = words[wordIndex % words.length];
    const isTyping = text.length < currentWord.length;

    const timeout = setTimeout(
      () => {
        if (isTyping) {
          setText(currentWord.slice(0, text.length + 1));
        } else {
          setText("");
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      },
      isTyping ? 100 : 2000,
    );

    return () => clearTimeout(timeout);
  }, [text, wordIndex, words]);

  return (
    <div className="flex min-w-0 items-center">
      {/* Prefix: hidden as soon as the user starts typing */}
      {!value && (
        <span className="pointer-events-none mr-1 whitespace-nowrap">
          <span className="hidden sm:inline">
            Search your next destination,
          </span>
          <span className="sm:hidden">Search</span>
        </span>
      )}

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        placeholder={text}
        autoComplete="off"
        aria-label={ariaLabel}
        aria-autocomplete="list"
        className="min-w-0 flex-1 bg-transparent text-black outline-none placeholder:text-gray-400"
      />
    </div>
  );
}
