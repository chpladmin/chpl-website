import React, { useContext, useEffect } from 'react';
import {
  Divider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplTextField } from 'components/util';
import { ChangeRequestContext, UserContext } from 'shared/contexts';
import { changeRequest as changeRequestProp } from 'shared/prop-types';

const useStyles = makeStyles({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
  },
  detailsContainer: {
    display: 'grid',
    gap: '8px',
  },
  detailsSubContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },
});

const validationSchema = yup.object({
  url: yup.string()
    .url('URL is not in a valid format')
    .required('URL is required'),
});

function ChplChangeRequestSBULEdit() {
  const { details, setDetails } = useContext(ChangeRequestContext);
  const { hasAnyRole } = useContext(UserContext);
  const classes = useStyles();
  let formik;

  useEffect(() => {
    if (!formik) { return; }
    console.log({id: 5, v: formik.values });
    setDetails({
      url: formik.values.url,
    });
  }, [formik?.values]);

  formik = useFormik({
    initialValues: {
      url: details.url || '',
    },
    validationSchema,
  });

  return (
    <div className={classes.container}>
      <div className={classes.detailsContainer}>
        <Typography variant="subtitle1">Current details</Typography>
        <Typography>
          { details.listing.certificationResults.find((cr) => cr.criterion.id === 182)?.serviceBaseUrlList }
        </Typography>
        <Typography>
          { details.listing.chplProductNumber }
        </Typography>
      </div>
      <Divider />
      <div className={classes.detailsContainer}>
        <Typography variant="subtitle1">Submitted details</Typography>
        <ChplTextField
          id="url"
          name="url"
          label="url"
          required
          disabled={!hasAnyRole(['chpl-developer'])}
          value={formik.values.url}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.url && !!formik.errors.url}
          helperText={formik.touched.url && formik.errors.url}
        />
      </div>
    </div>
  );
}

export default ChplChangeRequestSBULEdit;

ChplChangeRequestSBULEdit.propTypes = {
};
