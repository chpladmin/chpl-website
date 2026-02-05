import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  arrayOf,
  bool,
  func,
  object,
  string,
} from 'prop-types';

import ChplVersionEdit from './version-edit';

const useStyles = makeStyles({
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
});

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
  const classes = useStyles();

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
          <div className={classes.headerContainer}>
            <div className={classes.elementHeaderContainer}>Original Version</div>
          </div>
        )}
        component="div"
        className={classes.elementHeader}
      />
      <CardContent className={classes.content}>
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
