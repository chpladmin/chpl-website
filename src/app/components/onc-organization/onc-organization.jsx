import React, { useContext, useEffect, useState } from 'react';
import { bool, func, string } from 'prop-types';
import ReactGA from 'react-ga4';

import ChplOncOrganizationEdit from './onc-organization-edit';
import ChplOncOrganizationView from './onc-organization-view';

import { usePostAcb, usePutAcb } from 'api/acbs';
import { usePostAtl, usePutAtl } from 'api/atls';
import { UserContext } from 'shared/contexts';
import { acb as acbPropType } from 'shared/prop-types';

function ChplOncOrganization(props) {
  const {
    dispatch,
    organization: initialOrg,
    orgType,
    isCreating,
  } = props;
  const { hasAnyRole } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [organization, setOrganization] = useState(undefined);
  const { mutate: postAcb } = usePostAcb();
  const { mutate: putAcb } = usePutAcb();
  const { mutate: postAtl } = usePostAtl();
  const { mutate: putAtl } = usePutAtl();

  useEffect(() => {
    setOrganization(initialOrg);
    setIsEditing(isCreating);
  }, [initialOrg, isCreating]);

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
            ReactGA.event('Save', {
              category: 'Logged In Users',
              label: organization.name,
              group: hasAnyRole(['chpl-admin']) ? 'chpl-admin' : (hasAnyRole['chpl-onc'] ? 'chpl-onc' : 'chpl-onc-acb'),
            });
          // New ReactGA event for creating * Not working 
          // if (isCreating) {
          //   ReactGA.event('Create', {
          //     category: 'Logged In Users',
          //     label: organization.name,
          //     group: hasAnyRole(['chpl-admin']) ? 'chpl-admin' : (hasAnyRole['chpl-onc'] ? 'chpl-onc' : 'chpl-onc-acb'),
          //   });
          // }

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
