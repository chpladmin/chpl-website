import React from 'react';
import { arrayOf, func } from 'prop-types';

import ChplEditableJobEdit from './editable-job-edit';
import ChplSystemTriggerCreate from './system-trigger-create';
import ChplUserTriggerEdit from './user-trigger-edit';

import { acb as acbPropType, job as jobType } from 'shared/prop-types';

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
      <ChplSystemTriggerCreate
        job={job}
        dispatch={dispatch}
      />
    );
  }

  if (job.job.group === 'chplJobs') {
    return (
      <ChplUserTriggerEdit
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
