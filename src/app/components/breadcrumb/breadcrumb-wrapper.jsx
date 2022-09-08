import React, { useState } from 'react';
import {
  Breadcrumbs,
} from '@material-ui/core';
import { node } from 'prop-types';

import { BreadcrumbContext } from 'shared/contexts';

function BreadcrumbWrapper(props) {
  const { children } = props;
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const append = (crumb) => {
    setBreadcrumbs((crumbs) => crumbs.concat(crumb));
  };

  const drop = (key) => {
    setBreadcrumbs((crumbs) => crumbs.filter((crumb) => crumb.key !== key));
  };

  const dropAll = (key) => {
    setBreadcrumbs([]);
  };

  const breadcrumbState = {
    append,
    drop,
    dropAll,
  };

  return (
    <>
      <Breadcrumbs>
        { breadcrumbs }
      </Breadcrumbs>
      <BreadcrumbContext.Provider value={breadcrumbState}>
        { children }
      </BreadcrumbContext.Provider>
    </>
  );
}

export default BreadcrumbWrapper;

BreadcrumbWrapper.propTypes = {
  children: node,
};

BreadcrumbWrapper.defaultProps = {
  children: undefined,
};
