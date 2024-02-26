import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
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

import { useFetchUcdProcesses } from 'api/standards';
import { ChplTextField } from 'components/util';
import { sortCriteria } from 'services/criteria.service';
import { ListingContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  cancelAndSaveButton: {
    display: 'flex',
    flexDirection: 'row',
    gridGap: '8px',
    width: '100%',
  },
  criteriaForm: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: '100%',
    paddingTop: '16px',
    paddingBottom: '16px',
  },
  criteriaList: {
    display: 'flex',
    flexDirection: 'row',
  },
  addContainer: {
    alignItems: 'baseline',
    display: 'flex',
    width: '100%',
    gap: '16px',
  },
  formLegend: {
    marginBottom: '0',
  },
});

const validationSchema = yup.object({
  newProcess: yup.object()
    .required('Field is required'),
  newProcessDetails: yup.string()
    .required('Field is required'),
});

function ChplUcdProcessAdd({ dispatch }) {
  const { listing, setListing } = useContext(ListingContext);
  const [processes, setProcesses] = useState([]);
  const [criteria, setCriteria] = useState(new Set());
  const [criteriaOptions, setCriteriaOptions] = useState([]);
  const [availableCriteria, setAvailableCriteria] = useState([]);
  const processesQuery = useFetchUcdProcesses();
  const classes = useStyles();
  let formik;

  useEffect(() => {
    if (!listing) { return; };
    setAvailableCriteria(listing
      .certificationResults
      .filter((cert) => cert.success && cert.sed));
    setCriteriaOptions(listing
      .certificationResults
      .filter((cert) => cert.success && cert.sed)
      .map((cc) => cc.criterion.number));
  }, [listing]);

  useEffect(() => {
    if (processesQuery.isLoading || !processesQuery.isSuccess) {
      return;
    }
    setProcesses(processesQuery.data
      .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0)));
  }, [processesQuery.data, processesQuery.isLoading, processesQuery.isSuccess]);

  const close = () => {
    formik.setFieldValue('newProcess', '');
    formik.setFieldValue('newProcessDetails', '');
    setCriteria(new Set());
    dispatch();
  };

  const add = () => {
    const process = {
      name: formik.values.newProcess.name,
      details: formik.values.newProcessDetails,
      criteria: availableCriteria.filter((cc) => criteria.has(cc.criterion.number))
        .map((cr) => cr.criterion),
    };
    setListing({
      ...listing,
      sed: {
        ...listing.sed,
        ucdProcesses: [...listing.sed.ucdProcesses]
          .concat(process),
      },
    });
    close();
  };

  const isEnabled = () => !!formik.values.newProcess
        && !!formik.values.newProcessDetails
        && criteria.size > 0;

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
      newProcess: '',
      newProcessDetails: '',
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
      <Typography variant="subtitle1" gutterBottom>Adding UCD Process</Typography>
      <Box className={classes.addContainer}>
        <ChplTextField
          select
          id="new-process"
          name="newProcess"
          label="New UCD Process"
          required
          value={formik.values.newProcess}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.newProcess && !!formik.errors.newProcess}
          helperText={formik.touched.newProcess && formik.errors.newProcess}
        >
          { processes
            .map((item) => (
              <MenuItem value={item} key={item.id}>{item.name}</MenuItem>
            ))}
        </ChplTextField>
        <ChplTextField
          id="new-process-details"
          name="newProcessDetails"
          label="UCD Process Details"
          required
          value={formik.values.newProcessDetails}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.newProcessDetails && !!formik.errors.newProcessDetails}
          helperText={formik.touched.newProcessDetails && formik.errors.newProcessDetails}
        />
      </Box>
      <Box className={classes.criteriaForm}>
        <FormControl required error={criteria.size === 0} component="fieldset">
          <FormLabel className={classes.formLegend} component="legend">Certification Criteria</FormLabel>
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

export default ChplUcdProcessAdd;

ChplUcdProcessAdd.propTypes = {
  dispatch: func.isRequired,
};
