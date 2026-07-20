import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  MenuItem,
  makeStyles,
} from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { LocalDate } from '@js-joda/core';

import { usePostSurveillanceActivityReport } from 'api/surveillance';
import { ChplPageBody, ChplPageHeader, ChplTextField } from 'components/util';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '16px',
  },
  formContent:{
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '16px',
  },
});

const validationSchema = yup.object({
  year: yup.string()
    .required('Year is required'),
  quarter: yup.string()
    .required('Quarter is required'),
});

function ChplSurveillanceActivityReporting() {
  const { enqueueSnackbar } = useSnackbar();
  const { mutate } = usePostSurveillanceActivityReport();
  const classes = useStyles();
  let formik;

  const getYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    const startYear = 2016;
    let i;
    for (i = currentYear; i >= startYear; i -= 1) {
      years.push(i);
    }
    return years;
  };

  const dateRange = ({ year, quarter }) => {
    switch (quarter) {
      case 'all':
        return {
          startDay: LocalDate.of(year, 1, 1),
          endDay: LocalDate.of(year, 12, 31),
        };
      case 'q1':
        return {
          startDay: LocalDate.of(year, 1, 1),
          endDay: LocalDate.of(year, 3, 31),
        };
      case 'q2':
        return {
          startDay: LocalDate.of(year, 4, 1),
          endDay: LocalDate.of(year, 6, 30),
        };
      case 'q3':
        return {
          startDay: LocalDate.of(year, 7, 1),
          endDay: LocalDate.of(year, 9, 30),
        };
      case 'q4':
        return {
          startDay: LocalDate.of(year, 10, 1),
          endDay: LocalDate.of(year, 12, 31),
        };
      default:
        return {};
    }
  };

  const submitRequest = (values) => {
    const payload = dateRange(values);
    mutate(payload, {
      onSuccess: (response) => {
        formik.resetForm();
        enqueueSnackbar(`Your request has been submitted and you'll get an email at ${response.data.job.jobDataMap.email} when it's done`, {
          variant: 'success',
        });
      },
      onError: (error) => {
        const message = error.response.data.error;
        enqueueSnackbar(message, {
          variant: 'error',
        });
      },
    });
  };

  formik = useFormik({
    initialValues: {
      year: '',
      quarter: '',
    },
    onSubmit: submitRequest,
    validationSchema,
  });

  return (
    <>
      <ChplPageHeader text="Surveillance Activity Reporting" />
      <ChplPageBody maxWidth="md">
        <div className={classes.container}>
          <Card>
            <CardHeader
              title="Activity Reporting"
              subheader="Select a Date Range to Download Reports"
            />
            <CardContent>
              <Box className={classes.formContent}>
                <ChplTextField
                  select
                  required
                  id="year"
                  name="year"
                  label="Year"
                  value={formik.values.year}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.year && !!formik.errors.year}
                  helperText={formik.touched.year && formik.errors.year}
                >
                  { getYears().map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </ChplTextField>
                <ChplTextField
                  select
                  required
                  id="quarter"
                  name="quarter"
                  label="Quarter"
                  value={formik.values.quarter}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.quarter && !!formik.errors.quarter}
                  helperText={formik.touched.quarter && formik.errors.quarter}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="q1">Q1</MenuItem>
                  <MenuItem value="q2">Q2</MenuItem>
                  <MenuItem value="q3">Q3</MenuItem>
                  <MenuItem value="q4">Q4</MenuItem>
                </ChplTextField>
              </Box>
              <Button
                color="primary"
                variant="contained"
                name="downloadResults"
                id="download-results"
                disabled={!formik.isValid}
                onClick={formik.handleSubmit}
                endIcon={<CloudDownloadIcon />}
              >
                Download Results
              </Button>
            </CardContent>
          </Card>
        </div>
      </ChplPageBody>
    </>
  );
}

export default ChplSurveillanceActivityReporting;

ChplSurveillanceActivityReporting.propTypes = {
};
