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
  newUserCount: yup.number()
    .required('Field is required'),
  newUserCountDate: yup.date()
    .required('Field is required'),
});

function ChplPromotingInteroperabilityEdit() {
  const { listing, setListing } = useContext(ListingContext);
  const [addingPromotingInteroperability, setAddingPromotingInteroperability] = useState(false);
  const classes = useStyles();
  let formik;

  const handleItemAddition = () => {
    setListing((prev) => ({
      ...prev,
      promotingInteroperabilityUserHistory: prev.promotingInteroperabilityUserHistory.concat({
        userCount: formik.values.newUserCount,
        userCountDate: formik.values.newUserCountDate,
      }),
    }));
    setAddingPromotingInteroperability(false);
    formik.setFieldValue('newUserCount', 0);
    formik.setFieldValue('newUserCountDate', '');
  };

  const handleItemRemoval = (item) => {
    setListing((prev) => ({
      ...prev,
      promotingInteroperabilityUserHistory: prev.promotingInteroperabilityUserHistory.filter((pi) => pi.userCount !== item.userCount && pi.userCountDate !== item.userCountDate),
    }));
  };

  formik = useFormik({
    initialValues: {
      newUserCount: 0,
      newUserCountDate: '',
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
                    <TableRow key={pi.userCountDate}>
                      <TableCell>
                        { pi.userCount }
                      </TableCell>
                      <TableCell>
                        { getDisplayDateFormat(pi.userCountDate) }
                      </TableCell>
                      <TableCell>
                        <IconButton variant="outlined" onClick={() => handleItemRemoval('promotingInteroperability', pi)}>
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
                id="new-user-count"
                name="newUserCount"
                label="New User Count"
                required
                value={formik.values.newUserCount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.newUserCount && !!formik.errors.newUserCount}
                helperText={formik.touched.newUserCount && formik.errors.newUserCount}
              />
              <ChplTextField
                type="date"
                id="new-user-count-date"
                name="newUserCountDate"
                label="Effective Date"
                required
                value={formik.values.newUserCountDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.newUserCountDate && !!formik.errors.newUserCountDate}
                helperText={formik.touched.newUserCountDate && formik.errors.newUserCountDate}
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
                onClick={() => handleItemAddition('promotingInteroperability')}
                disabled={formik.values.newUserCount === '' || formik.values.newUserCountDate === ''}
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
