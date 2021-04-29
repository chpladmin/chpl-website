import React, { useEffect, useState } from 'react';
import { arrayOf, func, object } from 'prop-types';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import {
  Button,
  Collapse,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { testProcedure, selectedTestProcedure } from '../../../../../shared/prop-types';

const validationSchema = yup.object({
});

function ChplTestProceduresEdit(props) {
  const [adding, setAdding] = useState(false);
  const [testProcedures, setTestProcedures] = useState(props.testProcedures.sort((a, b) => (a.name < b.name ? -1 : 1)));
  const [options, setOptions] = useState(props.options);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema,
    validateOnChange: false,
    validateOnMount: true,
  });

  const addNew = () => {
    const updated = [
      ...testProcedures,
      {
        name: formik.values.name,
        key: (new Date()).getTime(),
      },
    ];
    setTestProcedures(updated);
    setOptions(options.filter((option) => option.name !== formik.values.name));
    formik.resetForm();
    setAdding(false);
    update(updated);
  };

  const cancelAdd = () => {
    formik.resetForm();
    setAdding(false);
  };

  const removeItem = (item) => {
    const updated = testProcedures.filter((s) => !(s.id === item.id && s.key === item.key));
    setTestProcedures(updated);
    setOptions([...options, item]);
    update(updated);
  };

  const update = (updated) => {
    props.onChange({ key: 'testProcedures', data: updated });
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Grid container spacing={4}>
          <Grid item xs={11}>
            <Typography variant="subtitle2">Name</Typography>
          </Grid>
          <Grid item xs={1} />
        </Grid>
      </Grid>
      { testProcedures.map((item) => (
        <Grid item xs={12} key={item.id || item.key}>
          <Grid container spacing={4}>
            <Grid item xs={11}>
              <Typography variant="subtitle2">{ item.name }</Typography>
            </Grid>
            <Grid item xs={1}>
              { !adding
                && (
                <IconButton
                  onClick={() => removeItem(item)}
                >
                  <CloseOutlinedIcon
                    color="primary"
                    size="small"
                  />
                </IconButton>
                )}
            </Grid>
          </Grid>
        </Grid>
      ))}
      { !adding && options.length > 0
        && (
        <Grid item xs={12}>
          <Button
            onClick={() => setAdding(true)}
          >
            Add item
          </Button>
        </Grid>
        )}
      { adding
        && (
        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item xs={11}>
              <InputLabel id="name-label">Procedure Tested</InputLabel>
              <Select
                labelId="name-label"
                id="name"
                name="name"
                variant="outlined"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                { options.map((item) => (
                  <MenuItem value={item.name} key={item.id}>{item.name}</MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={1}>
              <Button
                color="primary"
                variant="outlined"
                onClick={addNew}
              >
                <CheckOutlinedIcon />
              </Button>
              <IconButton
                onClick={() => cancelAdd()}
              >
                <CloseOutlinedIcon
                  color="primary"
                  size="small"
                />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        )}
    </Grid>
  );
}

export { ChplTestProceduresEdit };

ChplTestProceduresEdit.propTypes = {
  testProcedures: arrayOf(selectedTestProcedure),
  options: arrayOf(testProcedure),
  onChange: func,
};
