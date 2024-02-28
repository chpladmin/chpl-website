import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  MenuItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { Clear, Save } from '@material-ui/icons';
import { func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { useFetchSedAgeRanges, useFetchSedEducation } from 'api/sed';
import { ChplTextField } from 'components/util';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  cancelAndSaveButton: {
    display: 'flex',
    flexDirection: 'row',
    gridGap: '8px',
    width: '100%',
    marginTop: '16px',
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
  educationType: yup.object()
    .required('Field is required'),
  productExperienceMonths: yup.number()
    .required('Field is required'),
  professionalExperienceMonths: yup.number()
    .required('Field is required'),
  computerExperienceMonths: yup.number()
    .required('Field is required'),
  age: yup.object()
    .required('Field is required'),
  gender: yup.string()
    .required('Field is required'),
  assistiveTechnologyNeeds: yup.string()
    .max(250, 'Field is too long')
    .required('Field is required'),
});

const getAgeSortValue = (age) => {
  if (age.name.length === 3) {
    return 0;
  } if (age.name.length === 4) {
    return 10;
  }
  return parseInt(age.name.charAt(0), 10);
};

function ChplSedParticipantAdd({ dispatch }) {
  const classes = useStyles();
  const ageRangesQuery = useFetchSedAgeRanges();
  const educationQuery = useFetchSedEducation();
  const [ageRanges, setAgeRanges] = useState([]);
  const [education, setEducation] = useState([]);
  let formik;

  useEffect(() => {
    if (ageRangesQuery.isLoading || !ageRangesQuery.isSuccess) {
      return;
    }
    setAgeRanges(ageRangesQuery.data.data
      .sort((a, b) => (getAgeSortValue(a) < getAgeSortValue(b) ? -1 : 1)));
  }, [ageRangesQuery.data, ageRangesQuery.isLoading, ageRangesQuery.isSuccess]);

  useEffect(() => {
    if (educationQuery.isLoading || !educationQuery.isSuccess) {
      return;
    }
    setEducation(educationQuery.data.data
      .sort((a, b) => (a.name < b.name ? -1 : 1)));
  }, [educationQuery.data, educationQuery.isLoading, educationQuery.isSuccess]);

  const close = () => {
    formik.setFieldValue('occupation', '');
    formik.setFieldValue('educationType', '');
    formik.setFieldValue('productExperienceMonths', '');
    formik.setFieldValue('professionalExperienceMonths', '');
    formik.setFieldValue('computerExperienceMonths', '');
    formik.setFieldValue('age', '');
    formik.setFieldValue('gender', '');
    formik.setFieldValue('assistiveTechnologyNeeds', '');
    dispatch({ action: 'close' });
  };

  const add = () => {
    const participant = {
      uniqueId: Date.now(),
      occupation: formik.values.occupation,
      educationType: formik.values.educationType,
      productExperienceMonths: formik.values.productExperienceMonths,
      professionalExperienceMonths: formik.values.professionalExperienceMonths,
      computerExperienceMonths: formik.values.computerExperienceMonths,
      age: formik.values.age,
      gender: formik.values.gender,
      assistiveTechnologyNeeds: formik.values.assistiveTechnologyNeeds,
    };
    dispatch({ action: 'add', payload: participant });
  };

  const isEnabled = () => !!formik.values.occupation
        && !!formik.values.educationType
        && formik.values.productExperienceMonths !== ''
        && formik.values.professionalExperienceMonths !== ''
        && formik.values.computerExperienceMonths !== ''
        && !!formik.values.age
        && !!formik.values.gender
        && !!formik.values.assistiveTechnologyNeeds;

  formik = useFormik({
    initialValues: {
      occupation: '',
      educationType: '',
      productExperienceMonths: '',
      professionalExperienceMonths: '',
      computerExperienceMonths: '',
      age: '',
      gender: '',
      assistiveTechnologyNeeds: '',
    },
    validationSchema,
  });

  return (
    <>
      <Typography gutterBottom variant="subtitle1">Adding Test Participant</Typography>
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
          select
          id="education-type"
          name="educationType"
          label="Education"
          required
          value={formik.values.educationType}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.educationType && !!formik.errors.educationType}
          helperText={formik.touched.educationType && formik.errors.educationType}
        >
          {education.map((e) => (
            <MenuItem value={e} key={e.id}>{e.name}</MenuItem>
          ))}
        </ChplTextField>
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
          select
          id="age"
          name="age"
          label="Age Range"
          required
          value={formik.values.age}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.age && !!formik.errors.age}
          helperText={formik.touched.age && formik.errors.age}
        >
          {ageRanges.map((ar) => (
            <MenuItem value={ar} key={ar.id}>{ar.name}</MenuItem>
          ))}
        </ChplTextField>
        <ChplTextField
          select
          id="gender"
          name="gender"
          label="Gender"
          required
          value={formik.values.gender}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.gender && !!formik.errors.gender}
          helperText={formik.touched.gender && formik.errors.gender}
        >
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Unknown">Unknown</MenuItem>
        </ChplTextField>
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
