import React, { useState } from 'react';
import { arrayOf, func } from 'prop-types';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import {
  Button,
  Grid,
  IconButton,
  MenuItem,
  Typography,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplTextField } from '../../../../util';
import { testFunctionality, selectedTestFunctionality } from '../../../../../shared/prop-types';

const validationSchema = yup.object({
});

function ChplTestFunctionalityEdit(props) {
  /* eslint-disable react/destructuring-assignment */
  const [adding, setAdding] = useState(false);
  const [testFunctionalityUsed, setTestFunctionalityUsed] = useState(props.testFunctionality.sort((a, b) => (a.name < b.name ? -1 : 1)));
  const [options, setOptions] = useState(props.options.filter((option) => props.testFunctionality.filter((used) => used.testFunctionalityId === option.id).length === 0));
  /* eslint-enable react/destructuring-assignment */

  const formik = useFormik({
    initialValues: {
      tf: '',
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
        description: formik.values.tf.description,
        id: undefined,
        name: formik.values.tf.name,
        testFunctionalityId: formik.values.tf.id,
        key: Date.now(),
      },
    ];
    setTestFunctionalityUsed(updated);
    setOptions(options.filter((option) => option.id !== formik.values.tf.id));
    formik.resetForm();
    setAdding(false);
    update(updated);
  };

  const cancelAdd = () => {
    formik.resetForm();
    setAdding(false);
  };

  const removeItem = (item) => {
    const updated = testFunctionalityUsed.filter((used) => used.testFunctionalityId !== item.testFunctionalityId);
    setTestFunctionalityUsed(updated);
    setOptions([...options, {
      ...item,
      id: item.testFunctionalityId,
    }]);
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
              <ChplTextField
                select
                id="tf"
                name="tf"
                label="Functionality Tested"
                value={formik.values.tf}
                onChange={formik.handleChange}
              >
                { options.map((item) => (
                  <MenuItem value={item} key={item.id}>{item.name}</MenuItem>
                ))}
              </ChplTextField>
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
