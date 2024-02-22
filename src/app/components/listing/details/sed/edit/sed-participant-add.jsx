import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  MenuItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { Clear, Save } from '@material-ui/icons';
import { func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplTextField } from 'components/util';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  cancelAndSaveButton: {
    display: 'flex',
    flexDirection: 'row',
    gridGap: '8px',
    width: '100%',
  },
  participantData: {
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
  occupation: yup.string()
    .max(250, 'Field is too long')
    .required('Field is required'),
  education: yup.object()
    .required('Field is required'),
  productExperienceMonths: yup.number()
    .required('Field is required'),
  professionalExperienceMonths: yup.number()
    .required('Field is required'),
  computerExperienceMonths: yup.number()
    .required('Field is required'),
  ageRange: yup.object()
    .required('Field is required'),
  gender: yup.object()
    .required('Field is required'),
  assistiveTechnologyNeeds: yup.string()
    .max(250, 'Field is too long')
    .required('Field is required'),
});

function ChplSedParticipantAdd({ dispatch }) {
  const classes = useStyles();
  let formik;

  const close = () => {
    formik.setFieldValue('occupation', '');
    formik.setFieldValue('education', '');
    formik.setFieldValue('productExperienceMonths', '');
    formik.setFieldValue('professionalExperienceMonths', '');
    formik.setFieldValue('computerExperienceMonths', '');
    formik.setFieldValue('ageRangeObj', '');
    formik.setFieldValue('gender', '');
    formik.setFieldValue('assistiveTechnologyNeeds', '');
    dispatch({ action: 'close' });
  };

  const add = () => {
    const participant = {
      uniqueId: Date.now(),
      occupation: formik.values.occupation,
      education: formik.values.education,
      productExperienceMonths: formik.values.productExperienceMonths,
      professionalExperienceMonths: formik.values.professionalExperienceMonths,
      computerExperienceMonths: formik.values.computerExperienceMonths,
      ageRange: formik.values.ageRange,
      gender: formik.values.gender,
      assistiveTechnologyNeeds: formik.values.assistiveTechnologyNeeds,
    };
    dispatch({ action: 'add', payload: participant });
  };

  const isEnabled = () => !!formik.values.occupation
        && !!formik.values.education
        && formik.values.productExperienceMonths !== ''
        && formik.values.professionalExperienceMonths !== ''
        && formik.values.computerExperienceMonths !== ''
        && !!formik.values.ageRange
        && !!formik.values.gender
        && !!formik.values.assistiveTechnologyNeeds;

  formik = useFormik({
    initialValues: {
      occupation: '',
      education: '',
      productExperienceMonths: '',
      professionalExperienceMonths: '',
      computerExperienceMonths: '',
      ageRange: '',
      gender: '',
      assistiveTechnologyNeeds: '',
    },
    validationSchema,
  });

  return (
    <>
      <Typography variant="subtitle1">Adding Test Participant</Typography>
      <Box className={classes.participantData}>
        <ChplTextField
          id="occupation"
          name="occupation"
          label="Occupation"
          required
          value={formik.values.occupation}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.occupation && !!formik.errors.occupation}
          helperText={formik.touched.occupation && formik.errors.occupation}
        />
        <ChplTextField
          id="education"
          name="education"
          label="Education"
          required
          value={formik.values.education}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.education && !!formik.errors.education}
          helperText={formik.touched.education && formik.errors.education}
        />
        <ChplTextField
          id="product-experience-months"
          name="productExperienceMonths"
          label="Product Experience (Months)"
          required
          type="number"
          value={formik.values.productExperienceMonths}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.productExperienceMonths && !!formik.errors.productExperienceMonths}
          helperText={formik.touched.productExperienceMonths && formik.errors.productExperienceMonths}
        />
        <ChplTextField
          id="professional-experience-months"
          name="professionalExperienceMonths"
          label="Professional Experience (Months)"
          required
          type="number"
          value={formik.values.professionalExperienceMonths}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.professionalExperienceMonths && !!formik.errors.professionalExperienceMonths}
          helperText={formik.touched.professionalExperienceMonths && formik.errors.professionalExperienceMonths}
        />
        <ChplTextField
          id="computer-experience-months"
          name="computerExperienceMonths"
          label="Computer Experience (Months)"
          required
          type="number"
          value={formik.values.computerExperienceMonths}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.computerExperienceMonths && !!formik.errors.computerExperienceMonths}
          helperText={formik.touched.computerExperienceMonths && formik.errors.computerExperienceMonths}
        />
        <ChplTextField
          id="age-range"
          name="ageRange"
          label="Age Range"
          required
          value={formik.values.ageRange}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.ageRange && !!formik.errors.ageRange}
          helperText={formik.touched.ageRange && formik.errors.ageRange}
        />
        <ChplTextField
          id="gender"
          name="gender"
          label="Gender"
          required
          value={formik.values.gender}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.gender && !!formik.errors.gender}
          helperText={formik.touched.gender && formik.errors.gender}
        />
        <ChplTextField
          id="assistive-technology-needs"
          name="assistiveTechnologyNeeds"
          label="Assistive Technology Needs"
          required
          value={formik.values.assistiveTechnologyNeeds}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.assistiveTechnologyNeeds && !!formik.errors.assistiveTechnologyNeeds}
          helperText={formik.touched.assistiveTechnologyNeeds && formik.errors.assistiveTechnologyNeeds}
        />
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

export default ChplSedParticipantAdd;

ChplSedParticipantAdd.propTypes = {
  dispatch: func.isRequired,
};
