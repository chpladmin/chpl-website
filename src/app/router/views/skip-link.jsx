import React from 'react';
import { useCurrentStateAndParams, useRouter } from '@uirouter/react';

// The urls are hash-based, so the skip link cannot simply be href="#main-content"
// - that would replace the route. It has to point at the current route plus the
// anchor, which is what the AngularJS `#{{ currentPage }}#main-content`
// interpolation produced. Re-renders on every route change.
function SkipLink() {
  const router = useRouter();
  const { state, params } = useCurrentStateAndParams();

  const route = state ? router.stateService.href(state.name, params) : '';

  return (
    <a href={`${route}#main-content`} className="chpl-skip-link">
      Skip to main content
    </a>
  );
}

export default SkipLink;
