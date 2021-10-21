import React, { useContext, useEffect, useState } from 'react';
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

import { ChplEllipsis, ChplTextField } from '../../../../util';
import { testStandard, selectedTestStandard } from '../../../../../shared/prop-types';
import { FlagContext } from '../../../../../shared/contexts';

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
  ts: yup.object()
    .required('Test Standard is required'),
});

function ChplTestStandardsEdit(props) {
  /* eslint-disable react/destructuring-assignment */
  const [adding, setAdding] = useState(false);
  const [testStandards, setTestStandards] = useState(props.testStandards.sort((a, b) => (a.testStandardName < b.testStandardName ? -1 : 1)));
  const [options, setOptions] = useState(
    props.options
      .filter((option) => !(props.testStandards.find((used) => used.testStandardId === option.id)))
      .sort((a, b) => (a.name < b.name ? -1 : 1)),
  );
  const classes = useStyles();
  const { optionalStandardsIsOn } = useContext(FlagContext);
  /* eslint-enable react/destructuring-assignment */

  useEffect(() => {
    if (optionalStandardsIsOn) {
      setOptions(options.filter((option) => testStandards.find((s) => s.testStandardId === option.id)));
    }
  }, []);

  let addNew;

  const formik = useFormik({
    initialValues: {
      ts: '',
    },
    onSubmit: () => {
      addNew();
    },
    validationSchema,
    validateOnChange: false,
    validateOnMount: true,
  });

  const update = (updated) => {
    props.onChange({ key: 'testStandards', data: updated });
  };

  addNew = () => {
    const updated = [
      ...testStandards,
      {
        testStandardDescription: formik.values.ts.description,
        testStandardId: formik.values.ts.id,
        testStandardName: formik.values.ts.name,
        key: Date.now(),
      },
    ];
    const removed = formik.values.ts.id;
    setAdding(false);
    formik.resetForm();
    setTestStandards(updated);
    setOptions(options.filter((option) => option.id !== removed));
    update(updated);
  };

  const cancelAdd = () => {
    formik.resetForm();
    setAdding(false);
  };

  const removeItem = (item) => {
    const updated = testStandards.filter((s) => s.testStandardId !== item.testStandardId);
    setTestStandards(updated);
    setOptions([
      ...options,
      {
        description: item.testStandardDescription,
        id: item.testStandardId,
        name: item.testStandardName,
      },
    ].sort((a, b) => (a.name < b.name ? -1 : 1)));
    update(updated);
  };

  return (
    <div className={classes.container}>
      { testStandards.length > 0
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
                { testStandards.map((item, index) => (
                  <TableRow key={item.id || item.key || index}>
                    <TableCell>
                      <Typography variant="body2"><ChplEllipsis text={item.testStandardName} maxLength={100} wordBoundaries /></Typography>
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
                id="test-standards-add-item"
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
                id="ts"
                name="ts"
                label="Test Standard"
                required
                value={formik.values.ts}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.ts && !!formik.errors.ts}
                helperText={formik.touched.ts && formik.errors.ts}
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
                  id="test-standards-check-item"
                >
                  <CheckIcon />
                </Button>
                <Button
                  onClick={() => cancelAdd()}
                  aria-label="Cancel adding item"
                  id="test-standards-close-item"
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

export default ChplTestStandardsEdit;

ChplTestStandardsEdit.propTypes = {
  testStandards: arrayOf(selectedTestStandard).isRequired,
  options: arrayOf(testStandard).isRequired,
  onChange: func.isRequired,
};
