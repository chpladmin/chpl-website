import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Switch,
  makeStyles,
} from '@material-ui/core';
import { func, object } from 'prop-types';

import ChplEditableJobEdit from './editable-job-edit';

function ChplJobEdit(props) {
  const { job, dispatch } = props;

  if (job.jobDataMap.editableJobFields) {
    return (
      <ChplEditableJobEdit
        job={job}
        dispatch={dispatch}
      />
    );
  }

  return (
    <>
      unknown
    </>
  );
}

export default ChplJobEdit;

ChplJobEdit.propTypes = {
  job: object.isRequired,
  dispatch: func.isRequired,
};
