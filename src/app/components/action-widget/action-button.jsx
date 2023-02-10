import React, { useContext } from 'react';
import {
  Button,
} from '@material-ui/core';
import { node } from 'prop-types';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

import CompareButton from 'components/compare-widget/compare-button';
import CmsButton from 'components/cms-widget/cms-button';
import { UserContext } from 'shared/contexts';
import { listing as listingPropType } from 'shared/prop-types';
import { getAngularService } from 'services/angular-react-helper';

function ChplActionButton(props) {
  const { children, listing } = props;
  const { hasAnyRole } = useContext(UserContext);
  const API = getAngularService('API');
  const authService = getAngularService('authService');

  const handleClick = () => {
    const downloadLink = `${API}/listings/${listing.id}/uploaded-file?api_key=${authService.getApiKey()}`;
    window.open(downloadLink);
  };

  return (
    <>
      { children }
      <CompareButton listing={listing} />
      <CmsButton listing={listing} />
      { hasAnyRole(['ROLE_ADMIN'])
        && (
          <Button
            color="secondary"
            variant="contained"
            size="small"
            id={`download-csv-${listing.id}`}
            onClick={handleClick}
            endIcon={<CloudDownloadIcon />}
            fullWidth
          >
            Download CSV
          </Button>
        )}
    </>
  );
}

export default ChplActionButton;

ChplActionButton.propTypes = {
  listing: listingPropType.isRequired,
  children: node,
};

ChplActionButton.defaultProps = {
  children: undefined,
};
