import React from 'react';
import {
  Divider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { bool, func } from 'prop-types';

import { address as addressProp, formik as formikProp } from '../../../shared/prop-types';
import { ChplTextField } from '../../util';

const useStyles = makeStyles(() => ({
  formSubContainer: {
    display: 'grid',
    gap: '16px',
    flexDirection: 'row',
    gridTemplateColumns: 'auto auto',
  },
}));

function ChplConfirmDeveloperAddress({
  address, editing, formik, handleChange,
}) {
  const classes = useStyles();

  return (
    <>
      { (address || !editing)
        && (
          <div>
            <Typography variant="subtitle1">
              Address
            </Typography>
            <Divider />
          </div>
        )}
      <div className={classes.formSubContainer}>
        { editing
          ? (
            <div>
              <ChplTextField
                id="line1"
                name="line1"
                label="Line 1"
                value={formik.values.line1}
                error={formik.touched.line1 && !!formik.errors.line1}
                helperText={formik.touched.line1 && formik.errors.line1}
                onChange={handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          )
          : (
            <div>
              <Typography variant="subtitle2">Line 1</Typography>
              <Typography variant="body1">{ address?.line1 }</Typography>
            </div>
          )}
        { editing
          ? (
            <div>
              <ChplTextField
                id="line2"
                name="line2"
                label="Line 2"
                value={formik.values.line2}
                onChange={handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          )
          : (
            <div>
              <Typography variant="subtitle2">Line 2</Typography>
              <Typography variant="body1">{ address?.line2 }</Typography>
            </div>
          )}
      </div>
      <div className={classes.formSubContainer}>
        { editing
          ? (
            <div>
              <ChplTextField
                id="city"
                name="city"
                label="City"
                value={formik.values.city}
                error={formik.touched.city && !!formik.errors.city}
                helperText={formik.touched.city && formik.errors.city}
                onChange={handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          )
          : (
            <div>
              <Typography variant="subtitle2">City</Typography>
              <Typography variant="body1">{ address?.city }</Typography>
            </div>
          )}
        { editing
          ? (
            <div>
              <ChplTextField
                id="state"
                name="state"
                label="State"
                value={formik.values.state}
                error={formik.touched.state && !!formik.errors.state}
                helperText={formik.touched.state && formik.errors.state}
                onChange={handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          )
          : (
            <div>
              <Typography variant="subtitle2">State</Typography>
              <Typography variant="body1">{ address?.state }</Typography>
            </div>
          )}
      </div>
      <div className={classes.formSubContainer}>
        { editing
          ? (
            <div>
              <ChplTextField
                id="zipcode"
                name="zipcode"
                label="Zip"
                value={formik.values.zipcode}
                error={formik.touched.zipcode && !!formik.errors.zipcode}
                helperText={formik.touched.zipcode && formik.errors.zipcode}
                onChange={handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          )
          : (
            <div>
              <Typography variant="subtitle2">Zip</Typography>
              <Typography variant="body1">{ address?.zipcode }</Typography>
            </div>
          )}
        { editing
          ? (
            <div>
              <ChplTextField
                id="country"
                name="country"
                label="Country"
                value={formik.values.country}
                error={formik.touched.country && !!formik.errors.country}
                helperText={formik.touched.country && formik.errors.country}
                onChange={handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          )
          : (
            <div>
              <Typography variant="subtitle2">Country</Typography>
              <Typography variant="body1">{ address?.country }</Typography>
            </div>
          )}
      </div>
    </>
  );
}

export default ChplConfirmDeveloperAddress;

ChplConfirmDeveloperAddress.propTypes = {
  address: addressProp.isRequired,
  editing: bool.isRequired,
  formik: formikProp.isRequired,
  handleChange: func,
};

ChplConfirmDeveloperAddress.defaultProps = {
  handleChange: () => {},
};
