import React, { useEffect, useState } from 'react';
import { func } from 'prop-types';

import ChplOncOrganizationEdit from './onc-organization-edit';
import ChplOncOrganizationView from './onc-organization-view';

import { acb as acbPropType } from 'shared/prop-types';

function ChplOncOrganization(props) {
  const {
    organization,
    dispatch,
  } = props;
  const [isEditing, setIsEditing] = useState(false);

  const handleDispatch = (action, payload) => {
    console.log({action, payload});
    dispatch(action, payload);
  };

  if (isEditing) {
    return (
      <ChplOncOrganizationEdit
        organization={organization}
        dispatch={handleDispatch}
      />
    );
  }

  return (
    <ChplOncOrganizationView
      organization={organization}
      dispatch={handleDispatch}
    />
  );
}

export default ChplOncOrganization;

ChplOncOrganization.propTypes = {
  organization: acbPropType.isRequired,
  dispatch: func,
};

ChplOncOrganization.defaultProps = {
  dispatch: () => {},
};
