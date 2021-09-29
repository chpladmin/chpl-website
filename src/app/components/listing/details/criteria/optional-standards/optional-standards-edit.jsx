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

import { ChplEllipsis, ChplTextField } from '../../../../util';
import { optionalStandard, selectedOptionalStandard } from '../../../../../shared/prop-types';

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
  os: yup.object()
    .required('Optional Standard is required'),
});

function ChplOptionalStandardsEdit(props) {
  /* eslint-disable react/destructuring-assignment */
  const [adding, setAdding] = useState(false);
  const [optionalStandards, setOptionalStandards] = useState(props.optionalStandards.sort((a, b) => (a.citation < b.citation ? -1 : 1)));
  const [options, setOptions] = useState(
    props.options
      .filter((option) => !(props.optionalStandards.find((used) => used.optionalStandardId === option.id)))
      .sort((a, b) => (a.citation < b.citation ? -1 : 1)),
  );
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  let formik;

  const update = (updated) => {
    props.onChange({ key: 'optionalStandards', data: updated });
  };

  const addNew = () => {
    const updated = [
      ...optionalStandards,
      {
        optionalStandardId: formik.values.os.id,
        citation: formik.values.os.citation,
        description: formik.values.os.description,
        key: Date.now(),
      },
    ];
    const removed = formik.values.os.id;
    setAdding(false);
    formik.resetForm();
    setOptionalStandards(updated);
    setOptions(options.filter((option) => option.id !== removed));
    update(updated);
  };

  const cancelAdd = () => {
    formik.resetForm();
    setAdding(false);
  };

  const removeItem = (item) => {
    const updated = optionalStandards.filter((s) => {
      if (s.optionalStandardId) {
        return s.optionalStandardId !== item.optionalStandardId;
      }
      return s.citation !== item.citation;
    });
    setOptionalStandards(updated);
    setOptions([
      ...options,
      {
        citation: item.citation,
        description: item.description,
        id: item.optionalStandardId,
      },
    ].sort((a, b) => (a.citation < b.citation ? -1 : 1)));
    update(updated);
  };

  formik = useFormik({
    initialValues: {
      os: '',
    },
    onSubmit: () => {
      addNew();
    },
    validationSchema,
    validateOnChange: false,
    validateOnMount: true,
  });

  return (
    <div className={classes.container}>
      { optionalStandards.length > 0
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
                { optionalStandards.map((item, index) => (
                  <TableRow key={item.id || item.key || index}>
                    <TableCell>
                      <Typography variant="body2"><ChplEllipsis text={item.description || item.citation} maxLength={100} wordBoundaries /></Typography>
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
                id="optional-standards-add-item"
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
                id="os"
                name="os"
                label="Optional Standard"
                required
                value={formik.values.os}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.os && !!formik.errors.os}
                helperText={formik.touched.os && formik.errors.os}
              >
                { options.map((item) => (
                  <MenuItem value={item} key={item.id}>{item.citation}</MenuItem>
                ))}
              </ChplTextField>
              <ButtonGroup
                color="primary"
                className={classes.dataEntryActions}
              >
                <Button
                  onClick={formik.handleSubmit}
                  aria-label="Confirm adding item"
                  id="optional-standards-check-item"
                >
                  <CheckIcon />
                </Button>
                <Button
                  onClick={() => cancelAdd()}
                  aria-label="Cancel adding item"
                  id="optional-standards-close-item"
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

export default ChplOptionalStandardsEdit;

ChplOptionalStandardsEdit.propTypes = {
  optionalStandards: arrayOf(selectedOptionalStandard).isRequired,
  options: arrayOf(optionalStandard).isRequired,
  onChange: func.isRequired,
};
