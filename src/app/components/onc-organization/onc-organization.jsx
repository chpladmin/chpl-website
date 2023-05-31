import React, { useEffect, useState } from 'react';
import { func } from 'prop-types';

import ChplOncOrganizationEdit from './onc-organization-edit';
import ChplOncOrganizationView from './onc-organization-view';

import { acb as acbPropType } from 'shared/prop-types';

function ChplOncOrganization(props) {
  const {
    dispatch,
    organization,
  } = props;
  const [isEditing, setIsEditing] = useState(false);

  const handleDispatch = (action, payload) => {
    switch (action) {
      case 'cancel':
        setIsEditing(false);
        dispatch('cancel');
        break;
      case 'edit':
        setIsEditing(true);
        dispatch('edit', 'acb');
        break;
      case 'save':
        console.error('todo: set up saving');
        setIsEditing(false);
        dispatch('cancel');
        break;
      default:
        console.log({action, payload});
    }
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
  dispatch: func.isRequired,
  organization: acbPropType.isRequired,
};
