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
import { svap, selectedSvap } from '../../../../../shared/prop-types';

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
  svap: yup.object()
    .required('Standards Version Advancement Process is required'),
});

function ChplSvapsEdit(props) {
  /* eslint-disable react/destructuring-assignment */
  const [adding, setAdding] = useState(false);
  const [svaps, setSvaps] = useState(props.svaps);
  const [options, setOptions] = useState(
    props.options
      .filter((option) => !(props.svaps.find((used) => used.svapId === option.svapId))),
  );
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  let addNew;

  const formik = useFormik({
    initialValues: {
      svap: '',
    },
    onSubmit: () => {
      addNew();
    },
    validationSchema,
    validateOnChange: false,
    validateOnMount: true,
  });

  const update = (updated) => {
    props.onChange({ key: 'svaps', data: updated });
  };

  addNew = () => {
    const updated = [
      ...svaps,
      {
        ...formik.values.svap,
        key: (new Date()).getTime(),
      },
    ];
    const removed = formik.values.svap.svapId;
    setAdding(false);
    formik.resetForm();
    setSvaps(updated);
    setOptions(options.filter((option) => option.svapId !== removed));
    update(updated);
  };

  const cancelAdd = () => {
    formik.resetForm();
    setAdding(false);
  };

  const removeItem = (item) => {
    const updated = svaps.filter((s) => !(s.svapId === item.svapId));
    setSvaps(updated);
    setOptions([...options, item]);
    update(updated);
  };

  return (
    <div className={classes.container}>
      { svaps.length > 0
        && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography variant="body2">Regulatory Text Citation</Typography></TableCell>
                  <TableCell><Typography variant="body2">Approved Standard Version</Typography></TableCell>
                  <TableCell><Typography variant="srOnly">Actions</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { svaps.map((item, index) => (
                  <TableRow key={item.id || item.key || index}>
                    <TableCell>
                      <Typography variant="body2">{ item.regulatoryTextCitation }</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{ item.approvedStandardVersion }</Typography>
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
                id="svaps-add-item"
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
                id="svap"
                name="svap"
                label="Standards Version Advancement Process"
                required
                value={formik.values.svap}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.svap && !!formik.errors.svap}
                helperText={formik.touched.svap && formik.errors.svap}
              >
                { options.map((item) => (
                  <MenuItem value={item} key={item.svapId}>{item.regulatoryTextCitation}</MenuItem>
                ))}
              </ChplTextField>
              <ButtonGroup
                color="primary"
                className={classes.dataEntryActions}
              >
                <Button
                  onClick={formik.handleSubmit}
                  aria-label="Confirm adding item"
                  id="svaps-check-item"
                >
                  <CheckIcon />
                </Button>
                <Button
                  onClick={() => cancelAdd()}
                  aria-label="Cancel adding item"
                  id="svaps-close-item"
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

export default ChplSvapsEdit;

ChplSvapsEdit.propTypes = {
  svaps: arrayOf(selectedSvap).isRequired,
  options: arrayOf(svap).isRequired,
  onChange: func.isRequired,
};
