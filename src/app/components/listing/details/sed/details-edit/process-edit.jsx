import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  MenuItem,
  makeStyles,
  ButtonGroup,
} from '@material-ui/core';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';

import { arrayOf, func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplTextField } from 'components/util';
import { isCures, sortCriteria } from 'services/criteria.service';
import { criterion as criterionPropType, ucdProcessType as ucdProcessPropType, ucdProcessType } from 'shared/prop-types';

const validationSchema = yup.object({
  ucdProcess: yup.object()
    .required('Field is required'),
});

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  chips: {
    display: 'flex',
    flexDirection: 'row',
    gap: '8px',
    flexWrap: 'wrap',
  },
  cardActionSpacing : {
    padding: '16px',
  },
  deleteButton: {
    backgroundColor: '#c44f65 !important',
    color: '#ffffff!important',
    '&:hover': {
      backgroundColor: '#853544!important',
    },
  },
});

function ChplUcdProcessEdit(props) {
  const { criteriaOptions, dispatch, ucdProcessOptions } = props;
  const [canDelete, setCanDelete] = useState(false);
  const [criteria, setCriteria] = useState([]);
  const [selectedCriterion, setSelectedCriterion] = useState('');
  const classes = useStyles();
  let formik;

  useEffect(() => {
    setCriteria(props.ucdProcess.criteria?.map((criterion) => ({
      ...criterion,
    })) || []);
    setCanDelete(!!props.ucdProcess.id);
  }, [props.ucdProcess]); // eslint-disable-line react/destructuring-assignment

  const add = (criterion) => {
    setCriteria((prev) => prev.concat(criterion));
    setSelectedCriterion('');
  };

  const buildPayload = () => ({
    ...formik.values.ucdProcess,
    details: formik.values.details,
    criteria,
  });

  const getDisplay = (criterion) => criterion.number + (isCures(criterion) ? ' (Cures Update)' : '');

  const handleDispatch = (action) => {
    switch (action) {
      case 'cancel':
        dispatch({ action: 'cancel' });
        break;
      case 'delete':
        dispatch({ action: 'delete', payload: buildPayload() });
        break;
      case 'save':
        formik.submitForm();
        break;
      // no default
    }
  };

  const isDisabled = (criterion) => criteria.filter((c) => c.id === criterion.id).length > 0;

  const isValid = () => formik.isValid && criteria.length > 0;

  const remove = (item) => {
    setCriteria((prev) => prev.filter((ele) => ele.id !== item.id));
  };

  formik = useFormik({
    initialValues: {
      ucdProcess: ucdProcessOptions.find((process) => process.id === props.ucdProcess.id) || '',
      details: props.ucdProcess?.details || '', // eslint-disable-line react/destructuring-assignment
    },
    onSubmit: () => {
      props.dispatch({ action: 'save', payload: buildPayload() });
    },
    validationSchema,
  });

  return (
    <Card>
    <CardContent className={classes.container}>
      <ChplTextField
        select
        id="ucd-process"
        name="ucdProcess"
        label="UCD Process"
        required
        value={formik.values.ucdProcess}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.name && !!formik.errors.name}
        helperText={formik.touched.name && formik.errors.name}
      >
        { ucdProcessOptions
          .sort((a, b) => (a.name < b.name ? -1 : 1))
          .map((item) => (
            <MenuItem
              value={item}
              key={item.id}
            >
              {item.name}
            </MenuItem>
          ))}
      </ChplTextField>
      <ChplTextField
        id="details"
        name="details"
        label="UCD Process Details"
        value={formik.values.details}
        multiline
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.details && !!formik.errors.details}
        helperText={formik.touched.details && formik.errors.details}
      />
      <ChplTextField
        select
        id="criteria-select"
        name="criteriaSelect"
        label="Select a criterion to associate"
        value={selectedCriterion}
        onChange={(event) => add(event.target.value)}
        helperText={criteria.length === 0 && 'At least one Criteria must be selected'}
      >
        { criteriaOptions
          .sort(sortCriteria)
          .map((item) => (
            <MenuItem
              value={item}
              key={item.id}
              disabled={isDisabled(item)}
            >
              {`${item.number}: ${item.title}`}
            </MenuItem>
          ))}
      </ChplTextField>
      <div className={classes.chips}>
        { criteria
          .sort(sortCriteria)
          .map((item) => (
            <Chip
              key={item.id}
              label={getDisplay(item)}
              onDelete={() => remove(item)}
              color="primary"
              variant="outlined"
            />
          ))}
      </div>
      </CardContent>
      <CardActions className={classes.cardActionSpacing}>
        <ButtonGroup>
          <Button
            color="secondary"
            variant="contained"
            endIcon={<CloseOutlinedIcon />}
            onClick={() => handleDispatch('cancel')}
          >
            Cancel
          </Button>
        { canDelete
          && (
            <Button
              className={classes.deleteButton}
              endIcon={<DeleteOutlinedIcon />}
              onClick={() => handleDispatch('delete')}
            >
              Delete
            </Button>
          )}
            <Button
              color="primary"
              variant="contained"
              endIcon={<CheckOutlinedIcon />}
              onClick={() => handleDispatch('save')}
              disabled={!isValid()}
            >
              Accept
            </Button>
          </ButtonGroup>
        </CardActions>
    </Card>
  );
}

export default ChplUcdProcessEdit;

ChplUcdProcessEdit.propTypes = {
  criteriaOptions: arrayOf(criterionPropType).isRequired,
  dispatch: func.isRequired,
  ucdProcess: ucdProcessPropType.isRequired,
  ucdProcessOptions: arrayOf(ucdProcessType).isRequired,
};
