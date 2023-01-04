import React, { useState } from 'react';
import { arrayOf, func } from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import {
  Button,
  ButtonGroup,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplTextField } from '../../../../util';
import { functionalitiesTested, selectedFunctionalitiesTested } from '../../../../../shared/prop-types';

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    gap: '8px',
  },
  dataEntry: {
    display: 'grid',
    gridTemplateColumns: '4fr 1fr',
    gap: '4px',
  },
  dataEntryActions: {
    alignSelf: 'center',
    justifySelf: 'center',
  },
  dataEntryAddNew: {
    gridColumn: '1 / -1',
  },
}));

const validationSchema = yup.object({
  tf: yup.object()
    .required('Test Functionality is required'),
});

function ChplFunctionalitiesTestedEdit(props) {
  /* eslint-disable react/destructuring-assignment */
  const [adding, setAdding] = useState(false);
  const [functionalitiesTestedUsed, setFunctionalitiesTestedUsed] = useState(props.functionalitiesTested.sort((a, b) => (a.name < b.name ? -1 : 1)));
  const [options, setOptions] = useState(props.options.filter((option) => props.functionalitiesTested.filter((used) => used.functionalityTestedId === option.id).length === 0));
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  let addNew;

  const formik = useFormik({
    initialValues: {
      tf: '',
    },
    onSubmit: () => {
      addNew();
    },
    validationSchema,
    validateOnChange: false,
    validateOnMount: true,
  });

  const update = (updated) => {
    props.onChange({ key: 'functionalitiesTested', data: updated });
  };

  addNew = () => {
    const updated = [
      ...functionalitiesTestedUsed,
      {
        description: formik.values.tf.description,
        id: undefined,
        name: formik.values.tf.name,
        functionalityTestedId: formik.values.tf.id,
        key: Date.now(),
      },
    ];
    const removed = formik.values.tf.id;
    setAdding(false);
    formik.resetForm();
    setFunctionalitiesTestedUsed(updated);
    setOptions(options.filter((option) => option.id !== removed));
    update(updated);
  };

  const cancelAdd = () => {
    formik.resetForm();
    setAdding(false);
  };

  const removeItem = (item) => {
    const updated = functionalitiesTestedUsed.filter((used) => used.functionalityTestedId !== item.functionalityTestedId);
    setFunctionalitiesTestedUsed(updated);
    setOptions([...options, {
      ...item,
      id: item.functionalityTestedId,
    }]);
    update(updated);
  };

  return (
    <div className={classes.container}>
      { functionalitiesTestedUsed.length > 0
        && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography variant="body2">Name</Typography></TableCell>
                  <TableCell><Typography variant="srOnly">Actions</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { functionalitiesTestedUsed.map((item, index) => (
                  <TableRow key={item.id || item.key || index}>
                    <TableCell>
                      <Typography variant="body2">{ item.name }</Typography>
                    </TableCell>
                    <TableCell align="right">
                      { !adding
                        && (
                          <IconButton
                            onClick={() => removeItem(item)}
                            aria-label="Remove item"
                          >
                            <CloseIcon
                              color="primary"
                              size="small"
                            />
                          </IconButton>
                        )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      <div className={classes.dataEntry}>
        { !adding && options.length > 0
          && (
            <div className={classes.dataEntryAddNew}>
              <Button
                color="primary"
                variant="outlined"
                onClick={() => setAdding(true)}
                id="test-functionality-add-item"
              >
                Add item
                {' '}
                <AddIcon />
              </Button>
            </div>
          )}
        { adding
          && (
            <>
              <ChplTextField
                select
                id="tf"
                name="tf"
                label="Functionality Tested"
                value={formik.values.tf}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.tf && !!formik.errors.tf}
                helperText={formik.touched.tf && formik.errors.tf}
              >
                { options.map((item) => (
                  <MenuItem value={item} key={item.id}>{item.name}</MenuItem>
                ))}
              </ChplTextField>
              <ButtonGroup
                color="primary"
                className={classes.dataEntryActions}
              >
                <Button
                  onClick={formik.handleSubmit}
                  aria-label="Confirm adding item"
                  id="test-functionality-check-item"
                >
                  <CheckIcon />
                </Button>
                <Button
                  onClick={() => cancelAdd()}
                  aria-label="Cancel adding item"
                  id="test-functionality-close-item"
                >
                  <CloseIcon />
                </Button>
              </ButtonGroup>
            </>
          )}
      </div>
    </div>
  );
}

export default ChplFunctionalitiesTestedEdit;

ChplFunctionalitiesTestedEdit.propTypes = {
  functionalitiesTested: arrayOf(selectedFunctionalitiesTested).isRequired,
  options: arrayOf(functionalitiesTested).isRequired,
  onChange: func.isRequired,
};
