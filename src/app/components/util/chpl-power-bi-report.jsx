import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import {
  arrayOf,
  bool,
  number,
  object,
  oneOfType,
  string,
} from 'prop-types';

import ChplSkeletonCard from './chpl-skeleton-card';

import { utilStyles } from 'themes';

const styles = {
  container: {
    position: 'relative',
  },
  // Covers the part of the report that's on screen, which the iframe's negative
  // margins crop, so a tall report shows it at the top rather than far below
  skeleton: {
    position: 'absolute',
    inset: 0,
    zIndex: 1,
  },
  fill: {
    height: '100%',
  },
  hidden: {
    visibility: 'hidden',
  },
};

// A PowerBI report, held behind a skeleton until its iframe loads. The report
// is cross-origin, so its own render can't be watched, only the iframe's load;
// PowerBI's own spinner takes over from there. If the load never comes, the
// iframe is shown anyway after a while, so PowerBI's own error can appear.
// Set `announce={false}` where the page has one status for several reports
function ChplPowerBiReport({
  allowFullScreen = false,
  announce = true,
  height,
  sx = undefined,
  title,
  url,
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    const timeout = setTimeout(() => setIsLoaded(true), 15000);
    return () => clearTimeout(timeout);
  }, [url]);

  return (
    <Box sx={styles.container}>
      { !isLoaded
        && (
          <Box sx={styles.skeleton} role={announce ? 'status' : undefined} aria-live={announce ? 'polite' : undefined}>
            { announce
              && (
                <Box component="span" sx={utilStyles.visuallyHidden}>{ `Loading ${title}` }</Box>
              )}
            <Box sx={styles.fill} aria-hidden="true">
              <ChplSkeletonCard sx={styles.fill} />
            </Box>
          </Box>
        )}
      <Box
        component="iframe"
        title={title}
        sx={[...(Array.isArray(sx) ? sx : [sx]), !isLoaded && styles.hidden]}
        height={height}
        src={url}
        onLoad={() => setIsLoaded(true)}
        allowFullScreen={allowFullScreen}
      />
    </Box>
  );
}

export default ChplPowerBiReport;

ChplPowerBiReport.propTypes = {
  allowFullScreen: bool,
  announce: bool,
  height: oneOfType([number, string]).isRequired,
  sx: oneOfType([arrayOf(oneOfType([bool, object])), object]),
  title: string.isRequired,
  url: string.isRequired,
};
