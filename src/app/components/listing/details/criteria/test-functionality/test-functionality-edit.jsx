import React, { useState } from 'react';
import { arrayOf, func } from 'prop-types';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import {
  Button,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { testFunctionality, selectedTestFunctionality } from '../../../../../shared/prop-types';

const validationSchema = yup.object({
});

function ChplTestFunctionalityEdit(props) {
  /* eslint-disable react/destructuring-assignment */
  const [adding, setAdding] = useState(false);
  const [testFunctionalityUsed, setTestFunctionalityUsed] = useState(props.testFunctionality.sort((a, b) => (a.name < b.name ? -1 : 1)));
  const [options, setOptions] = useState(props.options);
  /* eslint-enable react/destructuring-assignment */

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema,
    validateOnChange: false,
    validateOnMount: true,
  });

  const update = (updated) => {
    props.onChange({ key: 'testFunctionality', data: updated });
  };

  const addNew = () => {
    const updated = [
      ...testFunctionalityUsed,
      {
        name: formik.values.name,
        key: (new Date()).getTime(),
      },
    ];
    setTestFunctionalityUsed(updated);
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
    const updated = testFunctionalityUsed.filter((s) => !(s.id === item.id && s.key === item.key));
    setTestFunctionalityUsed(updated);
    setOptions([...options, item]);
    update(updated);
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
      { testFunctionalityUsed.map((item) => (
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
              <InputLabel id="name-label">Functionality Tested</InputLabel>
              <Select
                fullWidth
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

export default ChplTestFunctionalityEdit;

ChplTestFunctionalityEdit.propTypes = {
  testFunctionality: arrayOf(selectedTestFunctionality).isRequired,
  options: arrayOf(testFunctionality).isRequired,
  onChange: func.isRequired,
};
