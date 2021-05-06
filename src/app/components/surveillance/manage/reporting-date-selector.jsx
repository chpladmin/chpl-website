import React from 'react';
import {
  Button,
  MenuItem,
  Typography,
} from '@material-ui/core';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import { useFormik } from 'formik';
import { LocalDate } from '@js-joda/core';
import { getAngularService } from '.';
import ChplTextField from '../../util/chpl-text-field';
import theme from '../../../themes/theme';

const useStyles = makeStyles(() => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    columnGap: '8px',
    gridRowGap: '8px',
  },
  fullWidth: {
    gridColumn: 'span 2',
  },
}));

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
    for (i = startYear; i <= currentYear; i += 1) {
      years.push(i);
    }
    years.sort((a, b) => b - a);
    return years;
  };

  const dateRange = (year, quarter) => {
    switch (quarter) {
      case 'all':
        return {
          startDate: LocalDate.of(year, 1, 1),
          endDate: LocalDate.of(year, 12, 31),
        };
      case 'q1':
        return {
          startDate: LocalDate.of(year, 1, 1),
          endDate: LocalDate.of(year, 3, 31),
        };
      case 'q2':
        return {
          startDate: LocalDate.of(year, 4, 1),
          endDate: LocalDate.of(year, 6, 30),
        };
      case 'q3':
        return {
          startDate: LocalDate.of(year, 7, 1),
          endDate: LocalDate.of(year, 9, 30),
        };
      case 'q4':
        return {
          startDate: LocalDate.of(year, 10, 1),
          endDate: LocalDate.of(year, 12, 31),
        };
      default:
        return {};
    }
  };

  const submitRequest = (values) => {
    networkService
      .getSurveillanceActivityReport(dateRange(values.year, values.quarter))
      .then((response) => {
        if (response.success) {
          toaster.pop({
            type: 'success',
            body: 'Something good happened',
          });
        }
      });
  };

  formik = useFormik({
    initialValues: { year: '', quarter: '' },
    onSubmit: (values) => {
      submitRequest(values);
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.grid}>
        <div className={classes.fullWidth}>
          <Typography variant="subtitle1">
            Select a Date Range to Download Reports
          </Typography>
        </div>
        <div className={classes.fullWidth}>
          <Typography variant="subtitle2">Choose a Preset Range</Typography>
        </div>
        <ChplTextField
          select
          id="year"
          name="year"
          label="year"
          value={formik.values.year}
          onChange={formik.handleChange}
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
          id="quarter"
          name="quarter"
          label="Quarter"
          value={formik.values.quarter}
          onChange={formik.handleChange}
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
            size="small"
            onClick={formik.handleSubmit}
          >
            Download Results
            <ArrowForwardOutlinedIcon
              className={classes.iconSpacing}
              fontSize="small"
            />
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
}

export { ChplSurveillanceActivityReportingDateSelector };
