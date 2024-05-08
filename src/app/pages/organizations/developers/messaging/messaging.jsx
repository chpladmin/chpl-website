import React, { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';

import { utilStyles } from 'themes';
import { useFetchDevelopersBySearch } from 'api/developer';
import { useFilterContext } from 'components/filter';

const useStyles = makeStyles({
  ...utilStyles,
  pageHeader: {
    padding: '32px',
    backgroundColor: '#ffffff',
  },
  pageBody: {
    display: 'grid',
    gridTemplateColumns: ' 1fr',
    gap: '16px',
    padding: '16px 32px',
    backgroundColor: '#f9f9f9',
  },
});

function ChplMessaging({ dispatch }) {
  const { queryString } = useFilterContext(); // use "POST" values instead of query string
  const [recordCount, setRecordCount] = useState(0);
  const classes = useStyles();

  const { data, isError, isLoading } = useFetchDevelopersBySearch({
    orderBy: 'developer',
    pageNumber: 0,
    pageSize: 25,
    sortDescending: false,
    query: queryString(),
  });

  useEffect(() => {
    if (isLoading) { return; }
    if (isError || !data.results) {
      return;
    }
    if (isLoading || !data.results) { return; }
    setRecordCount(data.recordCount);
  }, [data?.results, data?.recordCount, isError, isLoading]);

  return (
    <>
      <div className={classes.pageHeader}>
        <Typography variant="h1">
          Messaging
        </Typography>
      </div>
      <div className={classes.pageBody} id="main-content" tabIndex="-1">
        Messaging
        {' '}
        { recordCount }
        {' '}
        developers with string: "
        { queryString() }
        "
        <Button
          onClick={() => dispatch()}
        >
          Send Message
        </Button>
      </div>
    </>
  );
}

export default ChplMessaging;

ChplMessaging.propTypes = {
  dispatch: func.isRequired,
};
