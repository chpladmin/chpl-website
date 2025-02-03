import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Card,
  CardHeader,
  CardContent,
  Container,
  Divider,
  FormControlLabel,
  MenuItem,
  Switch,
  Table,
  TableContainer,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  TableFooter,
  Typography,
  makeStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import {
  arrayOf,
  bool,
  func,
  object,
  string,
} from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { getDisplayDateFormat } from 'services/date-util';
import { DeveloperContext, UserContext, useAnalyticsContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    alignItems: 'start',
  },
  developerHeader: {
    margin: '0',
    fontSize: '1.25em',
  },
});

const validationSchema = yup.object({
  version: yup.string()
    .required('Version is required'),
});

function ChplVersionEdit(props) {
  const {
    dispatch,
    errorMessages: initialErrorMessages,
    isInvalid: initialIsInvalid,
    isProcessing,
    isSplitting,
    version,
  } = props;
  const { analytics } = useAnalyticsContext();
  const { developer } = useContext(DeveloperContext);
  const { hasAnyRole } = useContext(UserContext);
  const [errorMessages, setErrorMessages] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [isInvalid, setIsInvalid] = useState(false);
  const classes = useStyles();
  let formik;

  useEffect(() => {
    setIsInvalid(initialIsInvalid);
  }, [initialIsInvalid]);

  useEffect(() => {
    setErrorMessages(initialErrorMessages);
  }, [initialErrorMessages]);

  const cancel = () => {
    eventTrack({
      ...analytics,
      event: 'Cancel Version Edit',
    });
    dispatch('cancel');
  };

  const save = () => {
    const updatedVersion = {
      ...version,
      version: formik.values.version,
    };
    dispatch('save', updatedVersion);
  };

  const handleDispatch = (action) => {
    switch (action) {
      case 'cancel':
        cancel();
        break;
      case 'save':
        formik.submitForm();
        break;
        // no default
    }
  };

  const isActionDisabled = () => isInvalid || !formik.isValid;

  formik = useFormik({
    initialValues: {
      version: version.version || '',
    },
    onSubmit: () => {
      save();
    },
    validationSchema,
  });

  return (
    <Container disableGutters maxWidth="lg">
      <Card>
        { isSplitting
          && (
            <CardHeader
              title="New Developer"
              component="h5"
              className={classes.developerHeader}
            />
          )}
        { !isSplitting
          && (
            <CardHeader
              title={developer.name}
              className={classes.developerHeader}
              component="h2"
            />
          )}
        <CardContent className={classes.content}>
          <ChplTextField
            id="version"
            name="version"
            label="Version"
            required
            value={formik.values.version}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.version && !!formik.errors.version}
            helperText={formik.touched.version && formik.errors.version}
          />
        </CardContent>
      </Card>
      <ChplActionBar
        dispatch={handleDispatch}
        isDisabled={isActionDisabled()}
        isProcessing={isProcessing}
        errors={errorMessages}
        warnings={warnings}
      />
    </Container>
  );
}

export default ChplVersionEdit;

ChplVersionEdit.propTypes = {
  dispatch: func.isRequired,
  errorMessages: arrayOf(string).isRequired,
  isInvalid: bool.isRequired,
  isProcessing: bool,
  isSplitting: bool.isRequired,
  version: object.isRequired,
};

ChplVersionEdit.defaultProps = {
  isProcessing: false,
};
