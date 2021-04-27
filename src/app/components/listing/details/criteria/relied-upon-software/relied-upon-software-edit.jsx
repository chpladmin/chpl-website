import React, { useEffect, useState } from 'react';
import { arrayOf, func } from 'prop-types';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import {
  Button,
  Collapse,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
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

import { reliedUponSoftware } from '../../../../../shared/prop-types';

const validationSchema = yup.object({
});

function ChplReliedUponSoftwareEdit(props) {
  const [adding, setAdding] = useState(false);
  const [software, setSoftware] = useState(props.software);

  const formik = useFormik({
    initialValues: {
      name: '',
      version: '',
      certifiedProductNumber: '',
      grouping: '',
    },
    validationSchema: validationSchema,
    validateOnChange: false,
    validateOnMount: true,
  });

  const addNew = () => {
    const updated = [
      ...software,
      {
        name: formik.values.name,
        version: formik.values.version,
        certifiedProductNumber: formik.values.certifiedProductNumber,
        grouping: formik.values.grouping,
        key: (new Date()).getTime(),
      },
    ];
    setSoftware(updated);
    formik.resetForm();
    setAdding(false);
    update(updated);
  }

  const cancelAdd = () => {
    formik.resetForm();
    setAdding(false);
  }

  const removeItem = (item) => {
    const updated = software.filter((s) => !(s.id === item.id && s.key === item.key));
    setSoftware(updated);
    update(updated);
  }

  const update = (updated) => {
    props.onChange({key: 'additionalSoftware', data: updated});
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Grid container spacing={4}>
          <Grid item xs={3}>
            <Typography variant="subtitle2">Name</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="subtitle2">Version</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="subtitle2">CHPL ID</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="subtitle2">Group</Typography>
          </Grid>
          <Grid item xs={1} />
        </Grid>
      </Grid>
      { software.map((item) => (
        <Grid item xs={12} key={item.id || item.key}>
          <Grid container spacing={4}>
            <Grid item xs={3}>
              <Typography variant="subtitle2">{ item.name }</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="subtitle2">{ item.version }</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="subtitle2">{ item.certifiedProductNumber }</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle2">{ item.grouping }</Typography>
            </Grid>
            <Grid item xs={1}>
              { !adding &&
                <IconButton
                  onClick={() => removeItem(item)}>
                  <CloseOutlinedIcon
                    color="primary"
                    size="small" />
                </IconButton>}
            </Grid>
          </Grid>
        </Grid>
      ))}
      { !adding &&
        <Grid item xs={12}>
          <Button
            onClick={() => setAdding(true)}
          >Add item
          </Button>
        </Grid>}
      { adding &&
        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item xs={3}>
              <TextField
                id="name"
                name="name"
                label="Name"
                variant="outlined"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!!formik.values.certifiedProductNumber}
                error={formik.touched.name && formik.errors.name}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="version"
                name="version"
                label="Version"
                variant="outlined"
                value={formik.values.version}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!!formik.values.certifiedProductNumber}
                error={formik.touched.version && formik.errors.version}
                helperText={formik.touched.version && formik.errors.version}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="certified-product-number"
                name="certifiedProductNumber"
                label="Certified Product Number"
                variant="outlined"
                value={formik.values.certifiedProductNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!!(formik.values.name || formik.values.version)}
                error={formik.touched.certifiedProductNumber && formik.errors.certifiedProductNumber}
                helperText={formik.touched.certifiedProductNumber && formik.errors.certifiedProductNumber}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                id="grouping"
                name="grouping"
                label="Grouping"
                variant="outlined"
                value={formik.values.grouping}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.grouping && formik.errors.grouping}
                helperText={formik.touched.grouping && formik.errors.grouping}
              />
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
                onClick={() => cancelAdd()}>
                <CloseOutlinedIcon
                  color="primary"
                  size="small" />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      }
    </Grid>
  );
}

export { ChplReliedUponSoftwareEdit };

ChplReliedUponSoftwareEdit.propTypes = {
  onChange: func,
  software: arrayOf(reliedUponSoftware),
};
