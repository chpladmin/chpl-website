import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  FormControlLabel,
  IconButton,
  MenuItem,
  Switch,
  Typography,
  makeStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { arrayOf, func, object, string } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { isCures, sortCriteria } from 'services/criteria.service';
import { job as jobType } from 'shared/prop-types';
import theme from 'themes/theme';

const useStyles = makeStyles({
  container: {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: '1fr',
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '1fr 2fr',
    },
  },
  divSpacing: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '8px',
    alignItems: 'center',
  },
  iconSpacing: {
    marginLeft: '4px',
  },
  subHeaderColor: {
    color: '#000000',
  },
});

const validationSchema = yup.object({
  regulatoryTextCitation: yup.string()
    .required('Field is required'),
  approvedStandardVersion: yup.string()
    .required('Field is required'),
});

function ChplSvapEdit(props) {
  const { criterionOptions, dispatch } = props;
  const [criteria, setCriteria] = useState([]);
  const [errors, setErrors] = useState([]);
  const [selectedCriterion, setSelectedCriterion] = useState('');
  const [svap, setSvap] = useState({});
  const classes = useStyles();
  let formik;

  useEffect(() => {
    setSvap(props.svap);
    setCriteria(props.svap.criteria?.map((c) => ({
      ...c,
    })) || []);
  }, [props.svap]); // eslint-disable-line react/destructuring-assignment

  useEffect(() => {
    setErrors(props.errors.sort((a, b) => a < b ? -1 : 1));
  }, [props.errors]);

  const add = (criterion) => {
    setCriteria((prev) => prev.concat(criterion));
    setSelectedCriterion('');
  };

  const buildPayload = () => ({
    ...svap,
    regulatoryTextCitation: formik.values.regulatoryTextCitation,
    approvedStandardVersion: formik.values.approvedStandardVersion,
    criteria,
    replaced: formik.values.replaced,
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

  const remove = (item) => {
    setCriteria((prev) => prev.filter((ele) => ele.id !== item.id));
  };

  formik = useFormik({
    initialValues: {
      regulatoryTextCitation: props.svap?.regulatoryTextCitation || '',
      approvedStandardVersion: props.svap?.approvedStandardVersion || '',
      replaced: props.svap?.replaced || false,
    },
    onSubmit: () => {
      props.dispatch({ action: 'save', payload: buildPayload() });
    },
    validationSchema,
  });

  return (
    <>
      <ChplTextField
        id="regulatory-text-citation"
        name="regulatoryTextCitation"
        label="Regulatory Text Citation"
        value={formik.values.regulatoryTextCitation}
        required
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.regulatoryTextCitation && !!formik.errors.regulatoryTextCitation}
        helperText={formik.touched.regulatoryTextCitation && formik.errors.regulatoryTextCitation}
      />
      <ChplTextField
        id="approved-standard-version"
        name="approvedStandardVersion"
        label="Approved Standard Version"
        value={formik.values.approvedStandardVersion}
        multiline
        required
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.approvedStandardVersion && !!formik.errors.approvedStandardVersion}
        helperText={formik.touched.approvedStandardVersion && formik.errors.approvedStandardVersion}
      />
      <ChplTextField
        select
        id="criteria-select"
        name="criteriaSelect"
        label="Select a criterion to associate"
        value={selectedCriterion}
        onChange={(event) => add(event.target.value)}
      >
        { criterionOptions
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
      <FormControlLabel
        control={(
          <Switch
            id="replaced"
            name="replaced"
            color="primary"
            checked={formik.values.replaced}
            onChange={formik.handleChange}
          />
        )}
        label="Replaced"
      />
      <ChplActionBar
        dispatch={handleDispatch}
        canDelete={false && !!svap.svapId}
        errors={errors}
      />
    </>
  );
}

export default ChplSvapEdit;

ChplSvapEdit.propTypes = {
  criterionOptions: arrayOf(object).isRequired,
  dispatch: func.isRequired,
  svap: object.isRequired,
  errors: arrayOf(string).isRequired,
};
