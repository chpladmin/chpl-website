import React, { useEffect, useState } from 'react';
import { bool, func, string } from 'prop-types';

import ChplOncOrganizationEdit from './onc-organization-edit';
import ChplOncOrganizationView from './onc-organization-view';

import { usePostAcb, usePutAcb } from 'api/acbs';
import { usePostAtl, usePutAtl } from 'api/atls';
import { acb as acbPropType } from 'shared/prop-types';

function ChplOncOrganization(props) {
  const {
    dispatch,
    organization: initialOrg,
    orgType,
    isCreating,
  } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [organization, setOrganization] = useState(undefined);
  const { mutate: postAcb } = usePostAcb();
  const { mutate: putAcb } = usePutAcb();
  const { mutate: postAtl } = usePostAtl();
  const { mutate: putAtl } = usePutAtl();

  useEffect(() => {
    setIsEditing(isCreating);
  }, [isCreating]);

  useEffect(() => {
    setOrganization(initialOrg);
    setIsEditing(false);
  }, [initialOrg]);

  const handleDispatch = (action, payload) => {
    const mutate = isCreating ? (orgType === 'acb' ? postAcb : postAtl) : (orgType === 'acb' ? putAcb : putAtl);
    switch (action) {
      case 'cancel':
        setIsEditing(false);
        dispatch('edit', '');
        break;
      case 'edit':
        setIsEditing(true);
        dispatch('edit', 'org');
        break;
      case 'save':
        setIsProcessing(true);
        mutate(payload, {
          onSuccess: () => {
            setIsEditing(false);
            setIsProcessing(false);
            dispatch('edit', '');
          },
          onError: (error) => {
            console.log({ error });
          },
        });
        break;
        // no default
    }
  };

  if (!organization) { return null; }

  if (isEditing) {
    return (
      <ChplOncOrganizationEdit
        organization={organization}
        dispatch={handleDispatch}
        isProcessing={isProcessing}
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
  orgType: string.isRequired,
  isCreating: bool,
};

ChplOncOrganization.defaultProps = {
  isCreating: false,
};
