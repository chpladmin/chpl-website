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

import { ChplEllipsis, ChplTextField } from '../../../../util';
import { optionalStandard, selectedOptionalStandard } from '../../../../../shared/prop-types';

const validationSchema = yup.object({
});

function ChplOptionalStandardsEdit(props) {
  /* eslint-disable react/destructuring-assignment */
  const [adding, setAdding] = useState(false);
  const [optionalStandards, setOptionalStandards] = useState(props.optionalStandards.sort((a, b) => (a.name < b.name ? -1 : 1)));
  const [options, setOptions] = useState(
    props.options
      .filter((option) => props.optionalStandards.filter((used) => (used.testStandardId === option.id).length === 0))
      .sort((a, b) => (a.name < b.name ? -1 : 1)),
  );
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
    setOptions(options.filter((option) => option.id !== formik.values.os.testStandardId));
    formik.resetForm();
    setAdding(false);
    update(updated);
  };

  const cancelAdd = () => {
    formik.resetForm();
    setAdding(false);
  };

  const removeItem = (item) => {
    const updated = optionalStandards.filter((s) => !(s.testStandardId === item.testStandardId));
    setOptionalStandards(updated);
    setOptions([
      ...options,
      {
        description: item.testStandardDescription,
        id: item.testStandardId,
        name: item.testStandardName,
      },
    ]);
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
      { optionalStandards.map((item) => (
        <Grid item xs={12} key={item.id || item.key}>
          <Grid container spacing={4}>
            <Grid item xs={11}>
              <Typography variant="subtitle2"><ChplEllipsis text={item.testStandardName} maxLength={100} wordBoundaries /></Typography>
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
      { !adding
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

export default ChplOptionalStandardsEdit;

ChplOptionalStandardsEdit.propTypes = {
  optionalStandards: arrayOf(selectedOptionalStandard).isRequired,
  options: arrayOf(optionalStandard).isRequired,
  onChange: func.isRequired,
};
