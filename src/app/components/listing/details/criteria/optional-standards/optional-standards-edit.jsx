import React, { useState } from 'react';
import { arrayOf, func } from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import {
  Button,
  ButtonGroup,
  Container,
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
    gridTemplateColumns: '2fr 1fr',
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
});

function ChplOptionalStandardsEdit(props) {
  /* eslint-disable react/destructuring-assignment */
  const [adding, setAdding] = useState(false);
  const [optionalStandards, setOptionalStandards] = useState(props.optionalStandards.sort((a, b) => (a.name < b.name ? -1 : 1)));
  const [options, setOptions] = useState(
    props.options
      .filter((option) => !(props.optionalStandards.find((used) => used.testStandardId === option.id)))
      .sort((a, b) => (a.name < b.name ? -1 : 1)),
  );
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  const formik = useFormik({
    initialValues: {
      os: '',
    },
    validationSchema,
    validateOnChange: false,
    validateOnMount: true,
  });

  const update = (updated) => {
    props.onChange({ key: 'testStandards', data: updated });
  };

  const addNew = () => {
    const updated = [
      ...optionalStandards,
      {
        testStandardDescription: formik.values.os.description,
        testStandardId: formik.values.os.id,
        testStandardName: formik.values.os.name,
        key: Date.now(),
      },
    ];
    setOptionalStandards(updated);
    setOptions(options.filter((option) => option.id !== formik.values.os.id));
    formik.resetForm();
    setAdding(false);
    update(updated);
  };

  const cancelAdd = () => {
    formik.resetForm();
    setAdding(false);
  };

  const removeItem = (item) => {
    const updated = optionalStandards.filter((s) => s.testStandardId !== item.testStandardId);
    setOptionalStandards(updated);
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
    <Container className={classes.container}>
      { optionalStandards.length > 0
        && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography variant="subtitle2">Name</Typography></TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                { optionalStandards.map((item) => (
                  <TableRow key={item.id || item.key}>
                    <TableCell>
                      <Typography variant="subtitle2"><ChplEllipsis text={item.testStandardName} maxLength={100} wordBoundaries /></Typography>
                    </TableCell>
                    <TableCell align="right">
                      { !adding
                        && (
                          <IconButton
                            onClick={() => removeItem(item)}
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
                value={formik.values.os}
                onChange={formik.handleChange}
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
                  onClick={addNew}
                >
                  <CheckIcon />
                </Button>
                <Button
                  onClick={() => cancelAdd()}
                >
                  <CloseIcon />
                </Button>
              </ButtonGroup>
            </>
          )}
      </div>
    </Container>
  );
}

export default ChplOptionalStandardsEdit;

ChplOptionalStandardsEdit.propTypes = {
  optionalStandards: arrayOf(selectedOptionalStandard).isRequired,
  options: arrayOf(optionalStandard).isRequired,
  onChange: func.isRequired,
};
