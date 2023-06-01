import React, { useState } from 'react';
import { bool, func } from 'prop-types';

import ChplOncOrganizationEdit from './onc-organization-edit';
import ChplOncOrganizationView from './onc-organization-view';

import { usePostAcb, usePutAcb } from 'api/acbs';
import { acb as acbPropType } from 'shared/prop-types';

function ChplOncOrganization(props) {
  const {
    dispatch,
    organization,
    isCreating,
  } = props;
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: post } = usePostAcb();
  const { mutate: put } = usePutAcb();

  const handleDispatch = (action, payload) => {
    const mutate = isCreating ? post : put;
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
        mutate(payload, {
          onSuccess: () => {
            setIsEditing(false);
            dispatch('cancel');
          },
          onError: (error) => {
            console.log({ error });
          },
        });
        break;
      default:
        console.log({ action, payload });
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
  isCreating: bool,
};

ChplOncOrganization.defaultProps = {
  isCreating: false,
};
