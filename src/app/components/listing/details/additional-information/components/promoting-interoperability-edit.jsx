import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  Delete, Add, Save, Clear,
} from '@material-ui/icons';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplTextField } from 'components/util';
import { getDisplayDateFormat } from 'services/date-util';
import { ListingContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  fullWidth: {
    width: '100%',
  },
  cancelAndSaveButton: {
    display: 'flex',
    flexDirection: 'row',
    gridGap: '8px',
    width: '100%',
  },
  twoColumnContainer: {
    display: 'flex',
    flexDirection: 'row',
    gridGap: '8px',
    alignItems: 'flex-start',
    width: '100%',
  },
});

const validationSchema = yup.object({
  userCount: yup.number()
    .required('Field is required'),
  userCountDate: yup.date()
    .required('Field is required'),
});

function ChplPromotingInteroperabilityEdit() {
  const { listing, setListing } = useContext(ListingContext);
  const [addingPromotingInteroperability, setAddingPromotingInteroperability] = useState(false);
  const classes = useStyles();
  let formik;

  const getKey = (item) => `${item.userCountDate}-${item.userCount}`;

  const handleItemAddition = () => {
    setListing((prev) => ({
      ...prev,
      promotingInteroperabilityUserHistory: prev.promotingInteroperabilityUserHistory.concat({
        userCount: formik.values.userCount,
        userCountDate: formik.values.userCountDate,
      }),
    }));
    setAddingPromotingInteroperability(false);
    formik.resetForm();
  };

  const handleItemRemoval = (item) => {
    setListing((prev) => ({
      ...prev,
      promotingInteroperabilityUserHistory: prev.promotingInteroperabilityUserHistory.filter((pi) => pi.userCount !== item.userCount || pi.userCountDate !== item.userCountDate),
    }));
  };

  const isAddDisabled = () => !!formik.errors.userCount || !!formik.errors.userCountDate || listing.promotingInteroperabilityUserHistory.some((item) => getKey(item) === getKey({
    userCount: formik.values.userCount,
    userCountDate: formik.values.userCountDate,
  }));

  formik = useFormik({
    initialValues: {
      userCount: 0,
      userCountDate: '',
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
      <Typography variant="subtitle1">Promoting Interoperability Users:</Typography>
      { listing.promotingInteroperabilityUserHistory.length > 0
        && (
          <Card className={classes.fullWidth}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Estimated Number of Promoting Interoperability Users</TableCell>
                  <TableCell>Effective Date</TableCell>
                  <TableCell className="sr-only">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listing.promotingInteroperabilityUserHistory
                  .sort((a, b) => (a.userCountDate < b.userCountDate ? 1 : -1))
                  .map((pi) => (
                    <TableRow key={getKey(pi)}>
                      <TableCell>
                        { pi.userCount }
                      </TableCell>
                      <TableCell>
                        { getDisplayDateFormat(pi.userCountDate) }
                      </TableCell>
                      <TableCell>
                        <IconButton variant="outlined" onClick={() => handleItemRemoval(pi)}>
                          <Delete color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Card>
        )}
      { !addingPromotingInteroperability
        && (
          <Button
            size="medium"
            color="primary"
            variant="outlined"
            onClick={() => setAddingPromotingInteroperability(true)}
            endIcon={<Add fontSize="medium" />}
          >
            Add User Count
          </Button>
        )}
      { addingPromotingInteroperability
        && (
          <>
            <Typography variant="subtitle2">Adding New User Count:</Typography>
            <Box className={classes.twoColumnContainer}>
              <ChplTextField
                type="number"
                id="user-count"
                name="userCount"
                label="New User Count"
                required
                value={formik.values.userCount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.userCount && !!formik.errors.userCount}
                helperText={formik.touched.userCount && formik.errors.userCount}
              />
              <ChplTextField
                type="date"
                id="user-count-date"
                name="userCountDate"
                label="Effective Date"
                required
                value={formik.values.userCountDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.userCountDate && !!formik.errors.userCountDate}
                helperText={formik.touched.userCountDate && formik.errors.userCountDate}
              />
            </Box>
            <Box className={classes.cancelAndSaveButton}>
              <Button
                size="medium"
                endIcon={<Clear fontSize="small" />}
                onClick={() => setAddingPromotingInteroperability(false)}
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
                onClick={() => handleItemAddition()}
                disabled={isAddDisabled()}
              >
                Save
              </Button>
            </Box>
          </>
        )}
    </>
  );
}

export default ChplPromotingInteroperabilityEdit;

ChplPromotingInteroperabilityEdit.propTypes = {
};
