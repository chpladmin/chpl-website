import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  MenuItem,
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

import { useFetchQmsStandards } from 'api/standards';
import { ChplTextField } from 'components/util';
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
  newQmsStandard: yup.object()
    .required('Field is required'),
  newQmsModification: yup.string(),
  newQmsApplicableCriteria: yup.string(),
});

function ChplQmsStandardsEdit() {
  const { listing, setListing } = useContext(ListingContext);
  const [addingQmsStandard, setAddingQmsStandard] = useState(false);
  const [qmsStandards, setQmsStandards] = useState([]);
  const qmsStandardsQuery = useFetchQmsStandards();
  const classes = useStyles();
  let formik;

  useEffect(() => {
    if (qmsStandardsQuery.isLoading || !qmsStandardsQuery.isSuccess) {
      return;
    }
    setQmsStandards(qmsStandardsQuery.data
      .sort((a, b) => (a.name < b.name ? -1 : 1)));
  }, [qmsStandardsQuery.data, qmsStandardsQuery.isLoading, qmsStandardsQuery.isSuccess]);

  const handleItemAddition = () => {
    setListing((prev) => ({
      ...prev,
      qmsStandards: prev.qmsStandards.concat({
        qmsStandardId: formik.values.newQmsStandard.id,
        qmsStandardName: formik.values.newQmsStandard.name,
        qmsModification: formik.values.newQmsModification,
        applicableCriteria: formik.values.newQmsApplicableCriteria,
      }),
    }));
    setAddingQmsStandard(false);
    formik.setFieldValue('newQmsStandard', '');
    formik.setFieldValue('newQmsModification', '');
    formik.setFieldValue('newQmsApplicableCriteria', '');
  };

  const handleItemRemoval = (item) => {
    setListing((prev) => ({
      ...prev,
      qmsStandards: prev.qmsStandards.filter((qms) => qms.qmsStandardName !== item.qmsStandardName),
    }));
  };

  formik = useFormik({
    initialValues: {
      newQmsStandard: '',
      newQmsModification: '',
      newQmsApplicableCriteria: '',
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
      <Typography variant="subtitle1">QMS Standards:</Typography>
      { listing.qmsStandards?.length > 0
        && (
          <>
            <Card className={classes.fullWidth}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>QMS Standard</TableCell>
                    <TableCell>QMS Modification</TableCell>
                    <TableCell>Applicable Criteria</TableCell>
                    <TableCell className="sr-only">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listing.qmsStandards
                    .sort((a, b) => (a.qmsStandardName < b.qmsStandardName ? 1 : -1))
                    .map((qms) => (
                      <TableRow key={qms.qmsStandardName}>
                        <TableCell>
                          { qms.qmsStandardName }
                        </TableCell>
                        <TableCell>
                          { qms.qmsModification }
                        </TableCell>
                        <TableCell>
                          { qms.applicableCriteria }
                        </TableCell>
                        <TableCell>
                          <IconButton variant="outlined" onClick={() => handleItemRemoval(qms)}>
                            <Delete color="error" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Card>
          </>
        )}
      { !addingQmsStandard
        && (
          <Button
            size="medium"
            color="primary"
            variant="outlined"
            onClick={() => setAddingQmsStandard(true)}
            endIcon={<Add fontSize="medium" />}
          >
            Add QMS Standard
          </Button>
        )}
      { addingQmsStandard
        && (
          <>
            <Typography variant="subtitle2">Adding New QMS Standard:</Typography>
            <Box className={classes.twoColumnContainer}>
              <ChplTextField
                select
                id="new-qms-standard"
                name="newQmsStandard"
                label="New QMS Standard"
                required
                value={formik.values.newQmsStandard}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.newQmsStandard && !!formik.errors.newQmsStandard}
                helperText={formik.touched.newQmsStandard && formik.errors.newQmsStandard}
              >
                { qmsStandards.map((item) => (
                  <MenuItem value={item} key={item.id}>{item.name}</MenuItem>
                ))}
              </ChplTextField>
              <ChplTextField
                id="new-qms-modification"
                name="newQmsModification"
                label="New QMS Modification"
                value={formik.values.newQmsModification}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.newQmsModification && !!formik.errors.newQmsModification}
                helperText={formik.touched.newQmsModification && formik.errors.newQmsModification}
              />
              <ChplTextField
                id="new-qms-applicable-criteria"
                name="newQmsApplicableCriteria"
                label="Applicable Criteria"
                value={formik.values.newQmsApplicableCriteria}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.newQmsApplicableCriteria && !!formik.errors.newQmsApplicableCriteria}
                helperText={formik.touched.newQmsApplicableCriteria && formik.errors.newQmsApplicableCriteria}
              />
            </Box>
            <Box className={classes.cancelAndSaveButton}>
              <Button
                size="medium"
                endIcon={<Clear fontSize="small" />}
                onClick={() => setAddingQmsStandard(false)}
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
                disabled={formik.values.newQmsStandard === ''}
              >
                Save
              </Button>
            </Box>
          </>
        )}
    </>
  );
}

export default ChplQmsStandardsEdit;

ChplQmsStandardsEdit.propTypes = {
};
