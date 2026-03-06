import React from 'react';
import {
  Box,
  Typography,
  makeStyles,
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { object } from 'prop-types';

import { ChplLink } from 'components/util';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  greenIcon: {
    color: 'green',
    marginLeft: '8px',
    marginTop: '4px',
  },
  redIcon: {
    color: 'red',
    marginLeft: '8px',
    marginTop: '4px',
  },
});

function ChplUrlCheckerResponse({ response }) {
  const classes = useStyles();

  const displayStatusIcon = (passed) => (passed ? (
    <CheckCircleIcon fontSize="large" className={classes.greenIcon} />
  ) : (
    <CancelIcon fontSize="large" className={classes.redIcon} />
  ));

  return (
    <Box>
      <Typography>Status:</Typography>
      <Typography>
        {response.passed ? 'Passed' : 'Failure'}
        {displayStatusIcon(response.passed)}
      </Typography>
      {response.errorMessage
       && (
         <>
           <Typography variant="body2">
             Error Message:
           </Typography>
           <Typography variant="body2">{response.errorMessage}</Typography>
         </>
       )}
      <Typography>URL:</Typography>
      <Typography>
        {response.url}
      </Typography>
      <Typography>Assertions</Typography>
      {response.httpResponseAssertion?.actualValue ? (
        <>
          <Typography>
            HTTP Status Code:
          </Typography>
          <Typography>
            {response.httpResponseAssertion.actualValue}
            {displayStatusIcon(response.httpResponseAssertion.passed)}
          </Typography>
          <Typography>
            <ChplLink
              href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status"
              text="Reference for HTTP Status Codes"
              inline
            />
          </Typography>
        </>
      ) : (
        <>
          <Typography>
            No HTTP Status Code Available:
          </Typography>
          <Typography>
            The HTTP response code could not be retrieved or is unavailable.
            {displayStatusIcon(response.httpResponseAssertion.passed)}
          </Typography>
        </>
      )}
      <Typography>
        Response Time (in milliseconds):
      </Typography>
      {response.responseTimeAssertion?.actualValue
        ? (
          <>
            <Typography>
              {response.responseTimeAssertion.actualValue}
              {displayStatusIcon(response.responseTimeAssertion.passed)}
            </Typography>
          </>
       ) : (
         <>
           <Typography>
             The response time is empty or unavailable.
             {displayStatusIcon(response.responseTimeAssertion.passed)}
           </Typography>
         </>
       )}
      {response.bodyNotEmptyAssertion?.actualValue ? (
        <>
          <Typography>
            Body Content:
          </Typography>
          <Typography>
            {response.bodyNotEmptyAssertion.actualValue
              ? response.bodyNotEmptyAssertion.actualValue
              : 'Empty body content'}
            {displayStatusIcon(response.bodyNotEmptyAssertion.passed)}
          </Typography>
        </>
      ) : (
        <>
          <Typography>
            No Content Available:
          </Typography>
          <Typography>
            The body content is empty or unavailable.
            {displayStatusIcon(response.bodyNotEmptyAssertion.passed)}
          </Typography>
        </>
      )}
    </Box>
  );
}

export default ChplUrlCheckerResponse;

ChplUrlCheckerResponse.propTypes = {
  response: object.isRequired,
};
