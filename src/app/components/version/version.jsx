import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, CardHeader, Typography,
} from '@mui/material';
import {
  arrayOf,
  bool,
  func,
  object,
  string,
} from 'prop-types';

import ChplVersionEdit from './version-edit';

const styles = {
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  elementHeader: {
    margin: '0',
    fontSize: '1.25em',
  },
  elementHeaderContainer: {
    maxWidth: '75%',
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
};

function ChplVersion({
  dispatch = () => {},
  errorMessages = [],
  isEditing = false,
  isInvalid: initialIsInvalid = false,
  isProcessing = false,
  isSplitting = false,
  version,
}) {
  const [isInvalid, setIsInvalid] = useState(false);

  useEffect(() => {
    setIsInvalid(initialIsInvalid);
  }, [initialIsInvalid]);

  if (isEditing) {
    return (
      <ChplVersionEdit
        dispatch={dispatch}
        isInvalid={isInvalid}
        isProcessing={isProcessing}
        isSplitting={isSplitting}
        errorMessages={errorMessages}
        version={version}
      />
    );
  }

  return (
    <Card
      title={`${version.version} Information`}
    >
      <CardHeader
        title={(
          <Box sx={styles.headerContainer}>
            <Box sx={styles.elementHeaderContainer}>Original Version</Box>
          </Box>
        )}
        component="div"
        sx={styles.elementHeader}
      />
      <CardContent sx={styles.content}>
        <div>
          <Typography variant="body1" gutterBottom>
            <strong>Version</strong>
            <br />
            {version.version}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}

export default ChplVersion;

ChplVersion.propTypes = {
  dispatch: func,
  errorMessages: arrayOf(string),
  isEditing: bool,
  isInvalid: bool,
  isProcessing: bool,
  isSplitting: bool,
  version: object.isRequired,
};
