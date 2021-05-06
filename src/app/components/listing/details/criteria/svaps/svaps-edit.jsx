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
import { svap, selectedSvap } from '../../../../../shared/prop-types';

const validationSchema = yup.object({
});

function ChplSvapsEdit(props) {
  /* eslint-disable react/destructuring-assignment */
  const [adding, setAdding] = useState(false);
  const [svaps, setSvaps] = useState(props.svaps);
  const [options, setOptions] = useState(props.options);
  /* eslint-enable react/destructuring-assignment */

  const formik = useFormik({
    initialValues: {
      regulatoryTextCitation: '',
    },
    validationSchema,
    validateOnChange: false,
    validateOnMount: true,
  });

  const update = (updated) => {
    props.onChange({ key: 'svaps', data: updated });
  };

  const addNew = () => {
    const updated = [
      ...svaps,
      {
        regulatoryTextCitation: formik.values.regulatoryTextCitation,
        approvedStandardVersion: options.filter((option) => option.regulatoryTextCitation === formik.values.regulatoryTextCitation)[0].approvedStandardVersion,
        key: (new Date()).getTime(),
        svapId: options.filter((option) => option.regulatoryTextCitation === formik.values.regulatoryTextCitation)[0].svapId,
      },
    ];
    setSvaps(updated);
    setOptions(options.filter((option) => option.regulatoryTextCitation !== formik.values.regulatoryTextCitation));
    formik.resetForm();
    setAdding(false);
    update(updated);
  };

  const cancelAdd = () => {
    formik.resetForm();
    setAdding(false);
  };

  const removeItem = (item) => {
    const updated = svaps.filter((s) => !(s.id === item.id && s.key === item.key));
    setSvaps(updated);
    setOptions([...options, item]);
    update(updated);
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Grid container spacing={4}>
          <Grid item xs={3}>
            <Typography variant="subtitle2">Regulatory Text Citation</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="subtitle2">Approved Standard Version</Typography>
          </Grid>
          <Grid item xs={1} />
        </Grid>
      </Grid>
      { svaps.map((item) => (
        <Grid item xs={12} key={item.id || item.key}>
          <Grid container spacing={4}>
            <Grid item xs={3}>
              <Typography variant="subtitle2">{ item.regulatoryTextCitation }</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="subtitle2">{ item.approvedStandardVersion }</Typography>
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
                id="regulatory-text-citation"
                name="regulatoryTextCitation"
                label="Standards Version Advancement Process"
                value={formik.values.regulatoryTextCitation}
                onChange={formik.handleChange}
              >
                { options.map((item) => (
                  <MenuItem value={item.regulatoryTextCitation} key={item.id}>{item.regulatoryTextCitation}</MenuItem>
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

export default ChplSvapsEdit;

ChplSvapsEdit.propTypes = {
  svaps: arrayOf(selectedSvap).isRequired,
  options: arrayOf(svap).isRequired,
  onChange: func.isRequired,
};
