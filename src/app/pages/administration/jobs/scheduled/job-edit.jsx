import React from 'react';
import { func } from 'prop-types';

import ChplEditableJobEdit from './editable-job-edit';
import ChplSystemJobEdit from './system-job-edit';
import ChplUserJobEdit from './user-job-edit';

import { jobType } from 'shared/prop-types';

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

  if (job.group === 'systemJobs') {
    return (
      <ChplSystemJobEdit
        job={job}
        dispatch={dispatch}
      />
    );
  }

  if (job.group === 'chplJobs') {
    return (
      <ChplUserJobEdit
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
  job: jobType.isRequired,
  dispatch: func.isRequired,
};
