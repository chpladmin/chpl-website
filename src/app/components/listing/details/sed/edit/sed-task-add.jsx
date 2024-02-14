import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { Clear, Save } from '@material-ui/icons';
import { func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import ChplSedTaskParticipantsView from '../sed-task-participants-view';

import { ChplTextField } from 'components/util';
import { sortCriteria } from 'services/criteria.service';
import { ListingContext } from 'shared/contexts';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  cancelAndSaveButton: {
    display: 'flex',
    flexDirection: 'row',
    gridGap: '8px',
    width: '100%',
  },
  criteriaForm: {
    width: '100%',
    gap: '16px',
  },
  criteriaList: {
    display: 'flex',
    flexDirection: 'row',
  },
  taskData: {
    display: 'grid',
    flexDirection: 'column',
    gridTemplateColumns: '1fr',
    gridGap: '16px',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: '1fr 1fr',
    },
  },
});

const validationSchema = yup.object({
  description: yup.string()
    .required('Field is required'),
  taskRatingScale: yup.string()
    .max(50, 'Field is too long')
    .required('Field is required'),
  taskRating: yup.number()
    .required('Field is required'),
  taskRatingStddev: yup.number()
    .required('Field is required'),
  taskTimeAvg: yup.number()
    .required('Field is required'),
  taskTimeStddev: yup.number()
    .required('Field is required'),
  taskTimeDeviationObservedAvg: yup.number()
    .required('Field is required'),
  taskTimeDeviationOptimalAvg: yup.number()
    .required('Field is required'),
  taskSuccessAverage: yup.number()
    .required('Field is required'),
  taskSuccessStddev: yup.number()
    .required('Field is required'),
  taskErrors: yup.number()
    .required('Field is required'),
  taskErrorsStddev: yup.number()
    .required('Field is required'),
  taskPathDeviationObserved: yup.number()
    .required('Field is required'),
  taskPathDeviationOptimal: yup.number()
    .required('Field is required'),
});

function ChplSedTaskAdd({ dispatch }) {
  const { listing, setListing } = useContext(ListingContext);
  const [availableCriteria, setAvailableCriteria] = useState([]);
  const [criteria, setCriteria] = useState(new Set());
  const [criteriaOptions, setCriteriaOptions] = useState([]);
  const [participants, setParticipants] = useState([]);
  const classes = useStyles();
  let formik;

  useEffect(() => {
    if (!listing) { return; }
    setAvailableCriteria(listing
      .certificationResults
      .filter((cert) => cert.success && cert.sed));
    setCriteriaOptions(listing
      .certificationResults
      .filter((cert) => cert.success && cert.sed)
      .map((cc) => cc.criterion.number));
  }, [listing]);

  const close = () => {
    formik.setFieldValue('newProcess', '');
    formik.setFieldValue('newProcessDetails', '');
    setCriteria(new Set());
    dispatch();
  };

  const add = () => {
    const task = {
      uniqueId: Date.now(),
      description: formik.values.description,
      taskRatingScale: formik.values.taskRatingScale,
      taskRating: formik.values.taskRating,
      taskRatingStddev: formik.values.taskRatingStddev,
      taskTimeAvg: formik.values.taskTimeAvg,
      taskTimeStddev: formik.values.taskTimeStddev,
      taskTimeDeviationObservedAvg: formik.values.taskTimeDeviationObservedAvg,
      taskTimeDeviationOptimalAvg: formik.values.taskTimeDeviationOptimalAvg,
      taskSuccessAverage: formik.values.taskSuccessAverage,
      taskSuccessStddev: formik.values.taskSuccessStddev,
      taskErrors: formik.values.taskErrors,
      taskErrorsStddev: formik.values.taskErrorsStddev,
      taskPathDeviationObserved: formik.values.taskPathDeviationObserved,
      taskPathDeviationOptimal: formik.values.taskPathDeviationOptimal,
      criteria: availableCriteria.filter((cc) => criteria.has(cc.criterion.number))
        .map((cr) => cr.criterion),
      participants: [],
    };
    setListing({
      ...listing,
      sed: {
        ...listing.sed,
        testTasks: [...listing.sed.testTasks]
          .concat(task),
      },
    });
    close();
  };

  const isEnabled = () => !!formik.values.description
        && !!formik.values.taskRatingScale
        && formik.values.taskRating !== ''
        && formik.values.taskRatingStddev !== ''
        && formik.values.taskTimeAvg !== ''
        && formik.values.taskTimeStddev !== ''
        && formik.values.taskTimeDeviationObservedAvg !== ''
        && formik.values.taskTimeDeviationOptimalAvg !== ''
        && formik.values.taskSuccessAverage !== ''
        && formik.values.taskSuccessStddev !== ''
        && formik.values.taskErrors !== ''
        && formik.values.taskErrorsStddev !== ''
        && formik.values.taskPathDeviationObserved !== ''
        && formik.values.taskPathDeviationOptimal !== ''
        && criteria.size > 0;
//        && participants.length >= 10;

  const toggleCriteria = (event) => {
    if (event.target.checked) {
      setCriteria((prev) => new Set(prev).add(event.target.name));
    } else {
      setCriteria((prev) => {
        const next = new Set(prev);
        next.delete(event.target.name);
        return next;
      });
    }
  };

  formik = useFormik({
    initialValues: {
      description: '',
      taskRatingScale: '',
      taskRating: '',
      taskRatingStddev: '',
      taskTimeAvg: '',
      taskTimeStddev: '',
      taskTimeDeviationObservedAvg: '',
      taskTimeDeviationOptimalAvg: '',
      taskSuccessAverage: '',
      taskSuccessStddev: '',
      taskErrors: '',
      taskErrorsStddev: '',
      taskPathDeviationObserved: '',
      taskPathDeviationOptimal: '',
    },
    validationSchema,
  });

  if (!listing) {
    return (
      <CircularProgress />
    );
  }

  return (
    <>
      <Typography variant="subtitle1">Adding Test Task</Typography>
      <Box className={classes.taskData}>
        <Card className={classes.fullWidthGridRow} id="summary">
          <CardHeader title="Summary" />
          <ChplTextField
            id="description"
            name="description"
            label="Description"
            required
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.description && !!formik.errors.description}
            helperText={formik.touched.description && formik.errors.description}
          />
          <Box className={classes.criteriaForm}>
            <FormControl required error={criteria.size === 0} component="fieldset">
              <FormLabel component="legend">Certification Criteria</FormLabel>
              <FormGroup className={classes.criteriaList}>
                { criteriaOptions.map((cc) => (
                  <FormControlLabel
                    control={<Checkbox color="primary" checked={criteria.has(cc)} onChange={toggleCriteria} name={cc} />}
                    label={cc}
                    key={cc}
                  />
                ))}
              </FormGroup>
              { criteria.size === 0
                && (
                  <FormHelperText>At least one must be selected</FormHelperText>
                )}
            </FormControl>
          </Box>
        </Card>
        <Card id="rating">
          <CardHeader title="Rating" />
          <ChplTextField
            id="task-rating-scale"
            name="taskRatingScale"
            label="Task Rating Scale"
            required
            value={formik.values.taskRatingScale}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.taskRatingScale && !!formik.errors.taskRatingScale}
            helperText={formik.touched.taskRatingScale && formik.errors.taskRatingScale}
          />
          <ChplTextField
            id="task-rating"
            name="taskRating"
            label="Task Rating"
            required
            type="number"
            value={formik.values.taskRating}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.taskRating && !!formik.errors.taskRating}
            helperText={formik.touched.taskRating && formik.errors.taskRating}
          />
          <ChplTextField
            id="task-rating-stddev"
            name="taskRatingStddev"
            label="Task Rating - Standard Deviation"
            required
            type="number"
            value={formik.values.taskRatingStddev}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.taskRatingStddev && !!formik.errors.taskRatingStddev}
            helperText={formik.touched.taskRatingStddev && formik.errors.taskRatingStddev}
          />
        </Card>
        <Card id="time">
          <CardHeader title="Task Time" />
          <ChplTextField
            id="task-time-avg"
            name="taskTimeAvg"
            label="Task Time - Mean (s)"
            required
            type="number"
            value={formik.values.taskTimeAvg}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.taskTimeAvg && !!formik.errors.taskTimeAvg}
            helperText={formik.touched.taskTimeAvg && formik.errors.taskTimeAvg}
          />
          <ChplTextField
            id="task-time-stddev"
            name="taskTimeStddev"
            label="Task Time - Standard Deviation (s)"
            required
            type="number"
            value={formik.values.taskTimeStddev}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.taskTimeStddev && !!formik.errors.taskTimeStddev}
            helperText={formik.touched.taskTimeStddev && formik.errors.taskTimeStddev}
          />
          <ChplTextField
            id="task-time-deviation-observed-avg"
            name="taskTimeDeviationObservedAvg"
            label="Task Time Deviation - Observed (s)"
            required
            type="number"
            value={formik.values.taskTimeDeviationObservedAvg}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.taskTimeDeviationObservedAvg && !!formik.errors.taskTimeDeviationObservedAvg}
            helperText={formik.touched.taskTimeDeviationObservedAvg && formik.errors.taskTimeDeviationObservedAvg}
          />
          <ChplTextField
            id="task-time-deviation-optimal-avg"
            name="taskTimeDeviationOptimalAvg"
            label="Task Time Deviation - Optimal (s)"
            required
            type="number"
            value={formik.values.taskTimeDeviationOptimalAvg}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.taskTimeDeviationOptimalAvg && !!formik.errors.taskTimeDeviationOptimalAvg}
            helperText={formik.touched.taskTimeDeviationOptimalAvg && formik.errors.taskTimeDeviationOptimalAvg}
          />
        </Card>
        <Card id="success">
          <CardHeader title="Task Success" />
          <ChplTextField
            id="task-success-average"
            name="taskSuccessAverage"
            label="Task Success - Mean (%)"
            required
            type="number"
            value={formik.values.taskSuccessAverage}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.taskSuccessAverage && !!formik.errors.taskSuccessAverage}
            helperText={formik.touched.taskSuccessAverage && formik.errors.taskSuccessAverage}
          />
          <ChplTextField
            id="task-success-stddev"
            name="taskSuccessStddev"
            label="Task Success - Standard Deviation (%)"
            required
            type="number"
            value={formik.values.taskSuccessStddev}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.taskSuccessStddev && !!formik.errors.taskSuccessStddev}
            helperText={formik.touched.taskSuccessStddev && formik.errors.taskSuccessStddev}
          />
        </Card>
        <Card id="errors">
          <CardHeader title="Task Errors" />
          <ChplTextField
            id="task-errors"
            name="taskErrors"
            label="Task Errors - Mean (%)"
            required
            type="number"
            value={formik.values.taskErrors}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.taskErrors && !!formik.errors.taskErrors}
            helperText={formik.touched.taskErrors && formik.errors.taskErrors}
          />
          <ChplTextField
            id="task-errors-stddev"
            name="taskErrorsStddev"
            label="Task Errors - Standard Deviation (%)"
            required
            type="number"
            value={formik.values.taskErrorsStddev}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.taskErrorsStddev && !!formik.errors.taskErrorsStddev}
            helperText={formik.touched.taskErrorsStddev && formik.errors.taskErrorsStddev}
          />
          <ChplTextField
            id="task-path-deviation-observed"
            name="taskPathDeviationObserved"
            label="Task Path Deviation - Observed (# of Steps)"
            required
            type="number"
            value={formik.values.taskPathDeviationObserved}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.taskPathDeviationObserved && !!formik.errors.taskPathDeviationObserved}
            helperText={formik.touched.taskPathDeviationObserved && formik.errors.taskPathDeviationObserved}
          />
          <ChplTextField
            id="task-path-deviation-optimal"
            name="taskPathDeviationOptimal"
            label="Task Path Deviation - Optimal (# of Steps)"
            required
            type="number"
            value={formik.values.taskPathDeviationOptimal}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.taskPathDeviationOptimal && !!formik.errors.taskPathDeviationOptimal}
            helperText={formik.touched.taskPathDeviationOptimal && formik.errors.taskPathDeviationOptimal}
          />
        </Card>
        <Card className={classes.fullWidthGridRow} id="participants">
          <CardHeader title="Participants" />
          <Box display="flex" flexDirection="row" justifyContent="flex-end" p={4}>
            <ChplSedTaskParticipantsView
              participants={[]}
            />
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Total Number of Participants</TableCell>
                <TableCell>{ 0 }</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </Box>
      <Box className={classes.cancelAndSaveButton}>
        <Button
          size="medium"
          endIcon={<Clear fontSize="small" />}
          onClick={() => close()}
          variant="contained"
          color="secondary"
        >
          Cancel
        </Button>
        <Button
          size="medium"
          endIcon={<Save fontSize="small" />}
          variant="contained"
          color="primary"
          disabled={!isEnabled()}
          onClick={() => add()}
        >
          Save
        </Button>
      </Box>
    </>
  );
}

export default ChplSedTaskAdd;

ChplSedTaskAdd.propTypes = {
  dispatch: func.isRequired,
};
