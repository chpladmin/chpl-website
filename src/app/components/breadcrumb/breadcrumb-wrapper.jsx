import React, { useEffect, useState } from 'react';
import {
  Breadcrumbs,
} from '@material-ui/core';
import { node } from 'prop-types';

import { BreadcrumbContext } from 'shared/contexts';

function BreadcrumbWrapper(props) {
  const { children } = props;
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [visible, setVisible] = useState(new Set());

  useEffect(() => {
    setDisplayed(breadcrumbs
      .filter((crumb) => visible.has(crumb.key))
      .sort((a, b) => a.props.depth - b.props.depth));
  }, [breadcrumbs, visible]);

  const append = (crumb) => {
    setBreadcrumbs((crumbs) => crumbs.filter((c) => c.key !== crumb.key).concat(crumb));
  };

  const display = (key) => {
    setVisible((prev) => (new Set(prev)).add(key));
  };

  const hide = (key) => {
    setVisible((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  const breadcrumbState = {
    append,
    display,
    hide,
  };

  return (
    <>
      <Breadcrumbs>
        { displayed }
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
