import React from 'react';
import { arrayOf, func } from 'prop-types';

import ChplEditableJobEdit from './editable-job-edit';
import ChplSystemJobEdit from './system-job-edit';
import ChplUserJobEdit from './user-job-edit';

import { acb as acbPropType, jobType } from 'shared/prop-types';

function ChplJobEdit(props) {
  const { acbs, dispatch, job } = props;

  if (job.jobDataMap?.editableJobFields) {
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

  if (job.job.group === 'chplJobs') {
    return (
      <ChplUserJobEdit
        acbs={acbs}
        trigger={job}
        dispatch={dispatch}
      />
    );
  }

  return null;
}

export default ChplJobEdit;

ChplJobEdit.propTypes = {
  acbs: arrayOf(acbPropType).isRequired,
  dispatch: func.isRequired,
  job: jobType.isRequired,
};
