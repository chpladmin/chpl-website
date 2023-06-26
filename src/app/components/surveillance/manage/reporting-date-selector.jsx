import React from 'react';
import {
  Button,
  MenuItem,
  Typography,
} from '@material-ui/core';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { LocalDate } from '@js-joda/core';

import ChplTextField from 'components/util/chpl-text-field';
import { getAngularService } from 'services/angular-react-helper';
import theme from 'themes/theme';

const useStyles = makeStyles({
  apiRegistrationLayout: {
    display: 'grid',
    columnGap: '8px',
    gridRowGap: '16px',
    gridTemplateColumns: '1fr 1fr',
    backgroundColor: '#ffffff',
    padding: '8px',
  },
  fullWidth: {
    gridColumn: '1 / -1',
  },
});

const validationSchema = yup.object({
  year: yup.string()
    .required('Year is required'),
  quarter: yup.string()
    .required('Quarter is required'),
});

function ChplSurveillanceActivityReportingDateSelector() {
  const networkService = getAngularService('networkService');
  const toaster = getAngularService('toaster');
  const classes = useStyles();
  let formik = {};

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

  const dateRange = (year, quarter) => {
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
    networkService
      .getSurveillanceActivityReport(dateRange(values.year, values.quarter))
      .then((response) => {
        const message = `Request for Surveillance Activity Report was successfully submitted. An email will be sent to ${response.job.jobDataMap.email} with the report.`;
        toaster.pop({
          type: 'success',
          title: 'Success',
          body: message,
        });
      });
  };

  formik = useFormik({
    initialValues: { year: '', quarter: '' },
    onSubmit: (values) => {
      submitRequest(values);
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: true,
  });

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.apiRegistrationLayout}>
        <div className={classes.fullWidth}>
          <Typography variant="subtitle1">
            Select a Date Range to Download Reports
          </Typography>
        </div>
        <ChplTextField
          select
          required
          id="year"
          name="year"
          label="Year"
          value={formik.values.year}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.year && Boolean(formik.errors.year)}
          helperText={formik.touched.year && formik.errors.year}
          inputProps={{ 'data-testid': 'year-input' }}
          FormHelperTextProps={{ 'data-testid': 'year-error-text' }}
        >
          <MenuItem value="" />
          {getYears().map((year) => (
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
          error={formik.touched.quarter && Boolean(formik.errors.quarter)}
          helperText={formik.touched.quarter && formik.errors.quarter}
          inputProps={{ 'data-testid': 'quarter-input' }}
          FormHelperTextProps={{ 'data-testid': 'quarter-error-text' }}
        >
          <MenuItem value="" />
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="q1">Q1</MenuItem>
          <MenuItem value="q2">Q2</MenuItem>
          <MenuItem value="q3">Q3</MenuItem>
          <MenuItem value="q4">Q4</MenuItem>
        </ChplTextField>
        <div className={classes.fullWidth}>
          <Button
            color="primary"
            variant="contained"
            name="downloadResults"
            id="download-results"
            onClick={formik.handleSubmit}
          >
            Download Results
            <ArrowForwardOutlinedIcon
              className={classes.iconSpacing}
            />
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default ChplSurveillanceActivityReportingDateSelector;
