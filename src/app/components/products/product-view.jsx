import React, { useContext, useEffect, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  Box,
  CardContent,
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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {
  ChplLink,
  ChplTextField,
} from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { getDisplayDateFormat } from 'services/date-util';
import { UserContext, useAnalyticsContext } from 'shared/contexts';
import { product as productPropType } from 'shared/prop-types';
import { palette, theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
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
  tableResultsHeaderContainer: {
    display: 'grid',
    gap: '8px',
    margin: '16px 32px',
    gridTemplateColumns: '1fr',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: 'auto auto',
    },
  },
  resultsContainer: {
    display: 'grid',
    gap: '8px',
    justifyContent: 'start',
    gridTemplateColumns: 'auto auto',
    alignItems: 'center',
  },
  wrap: {
    flexFlow: 'wrap',
  },
  tableFirstColumn: {
    position: 'sticky',
    left: 0,
    boxShadow: 'rgba(149, 157, 165, 0.1) 0px 4px 8px',
    backgroundColor: '#ffffff',
  },
  tableDeveloperCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  developerName: {
    fontWeight: '600',
  },
  noResultsContainer: {
    padding: '16px 32px',
  },
});

function ChplProductView({ product }) {
  const { analytics } = useAnalyticsContext();
  const { hasAnyRole } = useContext(UserContext);
  const [expanded, setExpanded] = useState(false);
  const [listings, setListings] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState('All');
  const [options, setOptions] = useState(['All']);
  const classes = useStyles();

  useEffect(() => {
    setOptions(
      ['All']
        .concat(product.versions
          .filter((version) => version.version !== 'All') // remove when angularJS component is removed
          .map((v) => (v.version))),
    );
  }, [product]);

  useEffect(() => {
    setListings(product.versions
      .filter((version) => version.version !== 'All') // remove when angularJS component is removed
      .filter((version) => selectedVersion === 'All' || version.version === selectedVersion)
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
        <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%">
          <Typography variant="body1">
            { product.name }
          </Typography>
          <Typography variant="body2">
            (
            { product.versions.length }
            {' '}
            version
            { product.versions.length !== 1 ? 's ' : ' ' }
            found)
          </Typography>
        </Box>
      </AccordionSummary>
      <CardContent>
        <ChplTextField
          id="version"
          name="version"
          label="Version"
          select
          value={selectedVersion}
          onChange={(event) => setSelectedVersion(event.target.value)}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </ChplTextField>
        <TableContainer component={Paper}>
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
                  <TableCell>{item.chplProductNumber}</TableCell>
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
      </CardContent>
    </Accordion>
  );
}

export default ChplProductView;

ChplProductView.propTypes = {
  product: productPropType.isRequired,
};
