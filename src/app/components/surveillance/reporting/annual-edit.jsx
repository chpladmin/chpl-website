import React, { useState } from 'react';
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

import { useDeleteAnnual, usePutAnnual } from 'api/surveillance';
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
  obstacleSummary: yup.string(),
  priorityChangesFromFindingsSummary: yup.string(),
});

function ChplAnnualEdit({
  dispatch,
  report,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const { mutate: deleteReport } = useDeleteAnnual();
  const { mutate: putReport } = usePutAnnual();
  const [errorMessages, setErrorMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const classes = useStyles();
  let formik;

  const handleDelete = () => {
    setIsProcessing(true);
    setErrorMessages([]);
    deleteReport(report, {
      onSuccess: () => {
        setIsProcessing(false);
        enqueueSnackbar('The report has been deleted', {
          variant: 'success',
        });
        dispatch({ action: 'cancel' });
      },
      onError: (error) => {
        setIsProcessing(false);
        setErrorMessages([error.response?.data?.error]);
      },
    });
  };

  const handleDispatch = (action) => {
    switch (action) {
      case 'delete':
        handleDelete();
        break;
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
    setErrorMessages([]);
    const payload = {
      ...report,
      obstacleSummary: formik.values.obstacleSummary,
      priorityChangesFromFindingsSummary: formik.values.priorityChangesFromFindingsSummary,
    };
    putReport(payload, {
      onSuccess: () => {
        setIsProcessing(false);
        enqueueSnackbar('Your updates have been made', {
          variant: 'success',
        });
        dispatch({ action: 'cancel' });
      },
      onError: (error) => {
        setIsProcessing(false);
        setErrorMessages([error.response?.data?.error]);
      },
    });
  };

  formik = useFormik({
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
        errors={errorMessages}
        isProcessing={isProcessing}
        canDelete
      />
    </div>
  );
}

export default ChplAnnualEdit;

ChplAnnualEdit.propTypes = {
  dispatch: func.isRequired,
  report: object.isRequired,
};
