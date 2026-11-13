import { useEffect, useRef, useState } from 'react';

// How long a change of sort shows as updating, at the least. A sort answered
// from the cache, such as flipping back to the direction just shown, swaps the
// cards at once; without this the user can't tell that they moved
const minimumSortUpdate = 400;

// Whether a results page is updating: a new sort, page or filter is loading
// while the old results stay on screen (a query with keepPreviousData), or the
// sort has just changed. Pass the query's isFetching and isPreviousData, and a
// sortKey that changes with the sort, such as `${orderBy}-${sortDescending}`
function useResultsUpdating({ isFetching, isPreviousData, sortKey }) {
  const [isSettling, setIsSettling] = useState(false);
  const previousSortKey = useRef(sortKey);

  useEffect(() => {
    if (previousSortKey.current === sortKey) { return undefined; }
    previousSortKey.current = sortKey;
    setIsSettling(true);
    const timer = setTimeout(() => setIsSettling(false), minimumSortUpdate);
    return () => clearTimeout(timer);
  }, [sortKey]);

  return (!!isFetching && !!isPreviousData) || isSettling;
}

export default useResultsUpdating;
export { minimumSortUpdate };
