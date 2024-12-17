import React, { useContext, useEffect, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import CallSplitIcon from '@material-ui/icons/CallSplit';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CallMergeIcon from '@material-ui/icons/CallMerge';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { func } from 'prop-types';

import ChplProductHistory from 'components/activity/product-history';
import { ChplLink, ChplTextField, ChplTooltip } from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { getDisplayDateFormat } from 'services/date-util';
import { UserContext, useAnalyticsContext } from 'shared/contexts';
import { product as productPropType } from 'shared/prop-types';
import { palette, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  buttonGroupMenu: {
    width: '200px !important',
    right: '200px !important',
  },
  products: {
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    borderColor: palette.divider,
    borderWidth: '.5px',
    borderStyle: 'solid',
    padding: '0px',
    backgroundColor: palette.white,
  },
  productsSummary: {
    backgroundColor: `${palette.white} !important`,
    borderRadius: '4px',
    borderBottom: `.5px solid ${palette.divider}`,
    width: '100%',
    padding: '0 4px',
  },
  chplIdFirstColumn: {
    width: '132px',
  },
});

function ChplProductView({ product, dispatch }) {
  const { analytics } = useAnalyticsContext();
  const { hasAnyRole } = useContext(UserContext);
  const [active, setActive] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [listings, setListings] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState('all');
  const [surveillance, setSurveillance] = useState('');
  const [options, setOptions] = useState([{ id: 'all', version: 'All' }]);
  const classes = useStyles();

  const [editAnchorEl, setEditAnchorEl] = useState(null);
  const [splitAnchorEl, setSplitAnchorEl] = useState(null);
  const [mergeAnchorEl, setMergeAnchorEl] = useState(null);

  const handleMenuClick = (setter) => (event) => {
    setter(event.currentTarget);
  };

  const handleMenuClose = (setter) => () => {
    setter(null);
  };

  const handleAction = (action, payload) => () => {
    dispatch({ action, payload });
    setEditAnchorEl(null);
    setSplitAnchorEl(null);
    setMergeAnchorEl(null);
  };
  useEffect(() => {
    setOptions([{ id: 'all', version: 'All' }].concat(product.versions.sort((a, b) => (a.id < b.id ? 1 : -1))));
    const rollup = product.versions
      .flatMap((version) => version.listings)
      .reduce((obj, l) => ({
        ...obj,
        open: obj.open + l.openSurveillanceCount,
        closed: obj.closed + l.closedSurveillanceCount,
        active: obj.active + (['Active', 'Suspended by ONC', 'Suspended by ONC-ACB'].includes(l.certificationStatus) ? 1 : 0),
        total: obj.total + 1,
      }), {
        open: 0, closed: 0, active: 0, total: 0,
      });
    setSurveillance(`${rollup.open} open / ${rollup.open + rollup.closed} surveillance${(rollup.open + rollup.closed) !== 1 ? 's' : ''}`);
    setActive(`${rollup.active} active / ${rollup.total} listing${rollup.total !== 1 ? 's' : ''}`);
  }, [product]);

  useEffect(() => {
    setListings(product.versions
      .filter((version) => selectedVersion === 'all' || version.id === selectedVersion)
      .flatMap((version) => version.listings)
      .sort((a, b) => (a.certificationDay < b.certificationDay ? 1 : (a.certificationDay > b.certificationDay ? -1 : (a.chplProductNumber < b.chplProductNumber ? -1 : 1)))));
  }, [product, selectedVersion]);

  const getIcon = () => (expanded
    ? (
      <>
        <Typography color="primary" variant="body2">Hide Details</Typography>
        <ExpandMoreIcon color="primary" fontSize="large" className={classes.rotate} />
      </>
    )
    : (
      <>
        <Typography color="primary" variant="body2">Show Details</Typography>
        <ExpandMoreIcon color="primary" fontSize="large" />
      </>
    ));

  const handleAccordionChange = () => {
    eventTrack({
      ...analytics,
      event: expanded ? 'Hide Product' : 'Show Product',
    });
    setExpanded((prev) => !prev);
  };

  return (
    <Accordion
      className={classes.products}
      onChange={() => handleAccordionChange(product)}
    >
      <AccordionSummary
        expandIcon={getIcon(product)}
        className={classes.productsSummary}
      >
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" width="100%">
          <Typography className={classes.chplIdFirstColumn} variant="body1">
            { product.name }
          </Typography>
          <Typography variant="body2">
            { surveillance }
          </Typography>
          <Typography variant="body2">
            { active }
          </Typography>
          <Typography variant="body2">
            { product.versions.length }
            {' '}
            version
            { product.versions.length !== 1 ? 's' : '' }
          </Typography>
        </Box>
      </AccordionSummary>
      <CardContent>
        <Box display="flex" mb={4} flexDirection="row" justifyContent="space-between">
          <Box minWidth="35%">
            <ChplTextField
              id="version"
              name="version"
              label="Version"
              select
              value={selectedVersion}
              onChange={(event) => setSelectedVersion(event.target.value)}
            >
              {options.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.version}
                </MenuItem>
              ))}
            </ChplTextField>
          </Box>
          <Box display="flex" mb={4} flexDirection="row" gridGap={4}>
            { hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb'])
              && (
                <ChplProductHistory
                  product={product}
                />
              )}
            { product.contact
              && (
                <>
                  <Typography variant="body1">Contact Information</Typography>
                  <Typography variant="body2">{ product.contact.fullName }</Typography>
                  <Typography variant="body2">{ product.contact.email }</Typography>
                  <Typography variant="body2">{ product.contact.phoneNumber }</Typography>
                </>
              )}
            { hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb'])
              && (
                <>
                  <ButtonGroup color="primary">
                    <ChplTooltip title={`Edit ${product.name}`}>
                      <Button
                        variant="contained"
                        aria-label={`Edit ${product.name}`}
                        id={`product-edit-${product.id}`}
                        onClick={handleMenuClick(setEditAnchorEl)}
                      >
                        <EditOutlinedIcon />
                      </Button>
                    </ChplTooltip>
                    <Menu
                      anchorEl={editAnchorEl}
                      open={Boolean(editAnchorEl)}
                      onClose={handleMenuClose(setEditAnchorEl)}
                      className={classes.buttonGroupMenu}
                    >
                      <MenuItem onClick={handleAction('edit', product)}>Edit Product</MenuItem>
                      <MenuItem onClick={handleAction('editVersion', { product, version: selectedVersion })}>Edit Version</MenuItem>
                    </Menu>

                    <ChplTooltip title={`Split ${product.name}`}>
                      <Button
                        variant="outlined"
                        aria-label={`Split ${product.name}`}
                        id={`product-split-${product.id}`}
                        onClick={handleMenuClick(setSplitAnchorEl)}
                      >
                        <CallSplitIcon />
                      </Button>
                    </ChplTooltip>
                    <Menu
                      anchorEl={splitAnchorEl}
                      open={Boolean(splitAnchorEl)}
                      onClose={handleMenuClose(setSplitAnchorEl)}
                      className={classes.buttonGroupMenu}
                    >
                      <MenuItem onClick={handleAction('split', product)}>Split Product</MenuItem>
                      <MenuItem onClick={handleAction('splitVersion', { product, version: selectedVersion })}>Split Version</MenuItem>
                    </Menu>

                    <ChplTooltip title={`Merge ${product.name}`}>
                      <Button
                        variant="outlined"
                        aria-label={`Merge ${product.name}`}
                        id={`product-merge-${product.id}`}
                        onClick={handleMenuClick(setMergeAnchorEl)}
                      >
                        <CallMergeIcon />
                      </Button>
                    </ChplTooltip>
                    <Menu
                      anchorEl={mergeAnchorEl}
                      open={Boolean(mergeAnchorEl)}
                      onClose={handleMenuClose(setMergeAnchorEl)}
                      className={classes.buttonGroupMenu}
                    >
                      <MenuItem onClick={handleAction('merge', product)}>Merge Product</MenuItem>
                      <MenuItem onClick={handleAction('mergeVersion', { product, version: selectedVersion })}>Merge Version</MenuItem>
                    </Menu>
                  </ButtonGroup>
                </>
              )}
          </Box>
        </Box>
        <Card>
          <TableContainer>
            <Table aria-label="Listings table">
              <TableHead>
                <TableRow>
                  <TableCell>CHPL ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell># Non-conformities</TableCell>
                  <TableCell>Certification Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { listings.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <ChplLink
                        href={`#/listing/${item.id}`}
                        text={item.chplProductNumber}
                        analytics={{
                          ...analytics,
                          event: 'Navigate to Listing Details Page',
                          label: item.chplProductNumber,
                          aggregationName: product.name,
                        }}
                        external={false}
                        router={{ sref: 'listing', options: { id: item.id } }}
                      />
                    </TableCell>
                    <TableCell>{item.certificationStatus}</TableCell>
                    <TableCell>
                      { item.openSurveillanceNonConformityCount }
                      {' open / '}
                      { item.closedSurveillanceNonConformityCount }
                      {' closed'}
                    </TableCell>
                    <TableCell>{getDisplayDateFormat(item.certificationDay)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </CardContent>
    </Accordion>
  );
}

export default ChplProductView;

ChplProductView.propTypes = {
  product: productPropType.isRequired,
  dispatch: func.isRequired,
};
