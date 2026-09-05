import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Reusable infinite-scroll hook
 *
 * @param {Array} items - Complete data array
 * @param {number} initialCount - Items shown initially
 * @param {number} batchSize - Number of items loaded per scroll
 */
const useInfiniteScroll = (
  items = [],
  initialCount = 12,
  batchSize = 12
) => {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const observerRef = useRef(null);

  const hasMore = visibleCount < items.length;

  const loadMore = useCallback(() => {
    if (!hasMore) return;

    setVisibleCount((prev) =>
      Math.min(prev + batchSize, items.length)
    );
  }, [hasMore, batchSize, items.length]);

  /**
   * Element passed to this ref becomes the
   * intersection observer target.
   */
  const loadMoreRef = useCallback(
    (node) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (!node || !hasMore) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMore();
          }
        },
        {
          root: null,
          rootMargin: "500px",
          threshold: 0,
        }
      );

      observerRef.current.observe(node);
    },
    [hasMore, loadMore]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    visibleItems: items.slice(0, visibleCount),
    loadMoreRef,
    hasMore,
    visibleCount,
  };
};

export default useInfiniteScroll;