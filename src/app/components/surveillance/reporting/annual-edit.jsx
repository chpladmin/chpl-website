import React, { useContext, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { func, object } from 'prop-types';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { usePutAnnual } from 'api/surveillance';
import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '16px',
    marginBottom: '32px',
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateColumns: '350px 1fr',
      alignItems: 'start',
    },
  },
  reportInfoCard: {
    padding: '8px',
  },
  stickyColumn: {
    position: 'sticky',
    top: '124px',
    zIndex: 1,
    boxShadow: 'rgba(149, 157, 165, 0.1) 0 4px 8px',
  },
  summaryGroup: {
    margin: '8px 0',
    whiteSpace: 'pre-line',
  },
});

const validationSchema = yup.object({
  obstacleSummary: yup.string()
    .required('Field is required'),
  priorityChangesFromFindingsSummary: yup.string()
    .required('Field is required'),
});

function ChplAnnualEdit({
  dispatch,
  report,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const { mutate } = usePutAnnual();
  const [errorMessages, setErrorMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const classes = useStyles();
  let formik;

  const handleDispatch = (action) => {
    switch (action) {
      case 'save':
        formik.submitForm();
        break;
      default:
        dispatch({ action });
        break;
    }
  };

  const save = () => {
    setIsProcessing(true);
    const payload = {
      ...report,
      obstacleSummary: formik.values.obstacleSummary,
      priorityChangesFromFindingsSummary: formik.values.priorityChangesFromFindingsSummary,
    };
    mutate(payload, {
      onSuccess: (response) => {
        setIsProcessing(false);
        console.log(response);
      },
      onError: (error) => {
        setIsProcessing(false);
        console.error(error);
      },
    });
  };

  formik  = useFormik({
    initialValues: {
      obstacleSummary: report.obstacleSummary || '',
      priorityChangesFromFindingsSummary: report.priorityChangesFromFindingsSummary || '',
    },
    onSubmit: () => {
      save();
    },
    validationSchema,
  });

  return (
    <div className={classes.container}>
      <Box className={classes.stickyColumn}>
        <Card className={classes.reportInfoCard}>
          <CardContent>
            <Typography variant="h6" component="h2">
              <strong>{`${report.acb?.name} Annual Surveillance Reporting`}</strong>
            </Typography>
            <Typography variant="body1">
              { report.year }
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Card>
        <CardContent>
          <Box>
            <Typography variant="h6" component="h2">
              <strong>Obstacle Summary</strong>
            </Typography>
            <Typography style={{ paddingBottom: '4px', color: '#373737' }} variant="body2" gutterBottom>
              Please list any obstacles encountered during surveillance, including those related to resources/technical capabilities, developers, and providers/end-users.
            </Typography>
            <ChplTextField
              id="obstacleSummary"
              name="obstacleSummary"
              label="Obstacle Summary"
              required
              value={formik.values.obstacleSummary}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.obstacleSummary && !!formik.errors.obstacleSummary}
              helperText={formik.touched.obstacleSummary && formik.errors.obstacleSummary}
            />
          </Box>
          <Box className={classes.summaryGroup}>
            <Typography variant="h6" component="h2">
              <strong>Priority Changes From Findings Summary</strong>
            </Typography>
          </Box>
          <ChplTextField
            id="priorityChangesFromFindingsSummary"
            name="priorityChangesFromFindingsSummary"
            label="Priority Changes From Findings Summary"
            required
            value={formik.values.priorityChangesFromFindingsSummary}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.priorityChangesFromFindingsSummary && !!formik.errors.priorityChangesFromFindingsSummary}
            helperText={formik.touched.priorityChangesFromFindingsSummary && formik.errors.priorityChangesFromFindingsSummary}
          />
          <Divider />
          <Typography variant="body2">
            The titles and descriptions used in this module&apos;s user interface reflect the most recent version of the report and may appear differently for historical reports in the downloads
          </Typography>
        </CardContent>
      </Card>
      <ChplActionBar
        dispatch={handleDispatch}
        disabled={!formik.isValid}
        isProcessing={isProcessing}
      />
    </div>
  );
}

export default ChplAnnualEdit;

ChplAnnualEdit.propTypes = {
  dispatch: func.isRequired,
  report: object.isRequired,
};
