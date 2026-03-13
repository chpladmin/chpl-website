import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Popover,
  makeStyles,
} from '@material-ui/core';
import { func, string } from 'prop-types';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import * as yup from 'yup';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';

import ChplUrlCheckerResponse from './url-checker-response';

import { usePostUrlChecker } from 'api/url-checker';
import { ChplTextField } from 'components/util';

const useStyles = makeStyles({
  buttonGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginLeft: '-4px',
  },
  popoverPaper: {
    maxWidth: '420px',
    padding: '12px 16px',
    border: '1px solid #d9e2ec',
    boxShadow: '0 8px 24px rgb(15 23 42 / 14%)',
    position: 'relative',
    overflow: 'visible',
    marginLeft: '12px',
    '&:before': {
      content: '""',
      position: 'absolute',
      left: '-10px',
      top: 'calc(50% - 10px)',
      width: 0,
      height: 0,
      borderTop: '10px solid transparent',
      borderBottom: '10px solid transparent',
      borderRight: '10px solid #d9e2ec',
    },
    '&:after': {
      content: '""',
      position: 'absolute',
      left: '-8px',
      top: 'calc(50% - 9px)',
      width: 0,
      height: 0,
      borderTop: '9px solid transparent',
      borderBottom: '9px solid transparent',
      borderRight: '9px solid #ffffff',
    },
  },
});

const validationSchema = yup.object({
  url: yup.string()
    .required('Field is required')
    .url('Improper format (http://www.example.com)'),
});

function ChplUrlChecker({ dispatch, url = '' }) {
  const { enqueueSnackbar } = useSnackbar();
  const { mutate, isLoading } = usePostUrlChecker();
  const fieldAnchorRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [hasValidatedOnce, setHasValidatedOnce] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [urlCheckResponse, setUrlCheckResponse] = useState(undefined);
  const classes = useStyles();

  const validate = (payload) => {
    setUrlCheckResponse(undefined);
    setIsPopoverOpen(false);
    dispatch({ action: 'loading' });
    mutate(payload, {
      onSuccess: (response) => {
        setHasValidatedOnce(true);
        setUrlCheckResponse(response.data);
        setIsPopoverOpen(true);
        dispatch({ action: 'complete', payload: response.data, url: payload.url });
      },
      onError: () => {
        setIsPopoverOpen(false);
        enqueueSnackbar('There was an error attempting to check the URL.', {
          variant: 'error',
        });
        dispatch({ action: 'complete' });
      },
    });
  };

  const formik = useFormik({
    initialValues: {
      url,
    },
    onSubmit: () => {
      validate({
        url: formik.values.url,
      });
    },
    validationSchema,
  });

  const handleValidate = (event) => {
    const popoverAnchor = fieldAnchorRef.current || event.currentTarget;
    setAnchorEl(popoverAnchor);
    formik.handleSubmit();
  };

  const handleViewResult = (event) => {
    if (!urlCheckResponse) {
      return;
    }
    const popoverAnchor = fieldAnchorRef.current || event.currentTarget;
    setAnchorEl(popoverAnchor);
    setIsPopoverOpen((prev) => !prev);
  };

  const handleClosePopover = () => {
    setIsPopoverOpen(false);
  };

  return (
    <>
      <Box display="flex" alignItems="flex-start">
        <Box ref={fieldAnchorRef} flexGrow={1}>
          <ChplTextField
            id="url"
            name="url"
            label="URL to check"
            value={formik.values.url}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.url && !!formik.errors.url}
            helperText={formik.touched.url && formik.errors.url}
            required
          />
        </Box>
        <div className={classes.buttonGroup}>
          <Button
            id="validate-url"
            aria-label="Validate URL"
            color="primary"
            variant="contained"
            onClick={handleValidate}
            disabled={isLoading}
            size="small"
            style={{ fontSize: 'small', padding: '9px' }}
            endIcon={isLoading
              ? <CircularProgress size={14} color="inherit" />
              : <VerifiedUserIcon />}
          >
            { isLoading ? 'Validating' : 'Validate' }
          </Button>
          { hasValidatedOnce && (
            <Button
              id="view-last-url-result"
              aria-label="View last URL check result"
              color="secondary"
              variant="contained"
              onClick={handleViewResult}
              disabled={!urlCheckResponse || isLoading}
              size="small"
              style={{ fontSize: 'small', padding: '9px' }}
            >
              { isPopoverOpen ? 'Hide Result' : 'View Result' }
            </Button>
          )}
        </div>
      </Box>
      <Popover
        id="url-checker-response"
        open={Boolean(anchorEl) && Boolean(urlCheckResponse) && isPopoverOpen}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        classes={{
          paper: classes.popoverPaper,
        }}
      >
        { urlCheckResponse && <ChplUrlCheckerResponse response={urlCheckResponse} /> }
      </Popover>
    </>
  );
}

export default ChplUrlChecker;

ChplUrlChecker.propTypes = {
  dispatch: func.isRequired,
  url: string,
};
