import React, { useContext } from 'react';
import {
  Box,
  Button,
  makeStyles,
} from '@material-ui/core';
import { bool, node } from 'prop-types';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

import CompareButton from 'components/compare-widget/compare-button';
import CmsButton from 'components/cms-widget/cms-button';
import { UserContext } from 'shared/contexts';
import { isListingActive } from 'services/listing.service';
import { listing as listingPropType } from 'shared/prop-types';
import { getAngularService } from 'services/angular-react-helper';

const useStyles = makeStyles({
  tableActions: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
    alignContent: 'stretch',
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  tableActionsHorizontal: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
});

function ChplActionButton(props) {
  const { children, horizontal, listing } = props;
  const { hasAnyRole } = useContext(UserContext);
  const API = getAngularService('API');
  const {
    getApiKey,
    getToken,
  } = getAngularService('authService');
  const classes = useStyles();

  const downloadOriginalCsv = () => {
    const downloadLink = `${API}/listings/${listing.id}/uploaded-file?api_key=${getApiKey()}&authorization=Bearer%20${getToken()}`;
    window.open(downloadLink);
  };

  const downloadCurrentCsv = () => {
    const downloadLink = `${API}/certified_products/${listing.id}/download?api_key=${getApiKey()}&authorization=Bearer%20${getToken()}`;
    window.open(downloadLink);
  };

  return (
    <>
      <Box className={horizontal ? classes.tableActionsHorizontal : classes.tableActions}>
        {children}
        <CompareButton listing={listing} />
        <CmsButton listing={listing} />
        { hasAnyRole(['chpl-admin']) && listing.id >= 10912
          && (
            <Button
              color="secondary"
              variant="contained"
              size="small"
              id={`download-original-csv-${listing.id}`}
              onClick={downloadOriginalCsv}
              endIcon={<CloudDownloadIcon />}
            >
              Original CSV
            </Button>
          )}
        { hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']) && (isListingActive(listing))
          && (
            <Button
              color="secondary"
              variant="contained"
              size="small"
              id={`download-current-csv-${listing.id}`}
              onClick={downloadCurrentCsv}
              endIcon={<CloudDownloadIcon />}
            >
              Current CSV
            </Button>
          )}
      </Box>
    </>
  );
}

export default ChplActionButton;

ChplActionButton.propTypes = {
  listing: listingPropType.isRequired,
  children: node,
  horizontal: bool,
};

ChplActionButton.defaultProps = {
  children: undefined,
  horizontal: false,
};
