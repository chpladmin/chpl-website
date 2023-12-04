import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Divider,
  Menu,
  MenuItem,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, shape, string } from 'prop-types';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckIcon from '@material-ui/icons/Check';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { ExportToCsv } from 'export-to-csv';

import { useFetchSvaps } from 'api/standards';
import { ChplTooltip } from 'components/util';
import { listing as listingPropType } from 'shared/prop-types';
import { getAngularService } from 'services/angular-react-helper';
import { sortCqms } from 'services/cqms.service';
import { sortCriteria } from 'services/criteria.service';
import { FlagContext, UserContext } from 'shared/contexts';
import { palette } from 'themes';

const useStyles = makeStyles({
  noMargin: {
    margin: '0',
  },
});

const csvOptions = {
  filename: 'listings',
  showLabels: true,
};

const allHeaders = [
  { headerName: 'CHPL ID', objectKey: 'chplProductNumber' },
  { headerName: 'Certification Edition', objectKey: 'fullEdition' },
  { headerName: 'Developer', objectKey: 'developerName', group: 'productData' },
  { headerName: 'Product', objectKey: 'productName', group: 'productData' },
  { headerName: 'Version', objectKey: 'versionName', group: 'productData' },
  { headerName: 'Certification Date', objectKey: 'certificationDate' },
  { headerName: 'Certification Status', objectKey: 'certificationStatusName' },
  { headerName: 'Details', objectKey: 'detailsLink' },
  { headerName: 'API Documentation - 170.315 (g)(7)', objectKey: 'apiDocumentation56', group: 'apiDocumentation' },
  { headerName: 'API Documentation - 170.315 (g)(9)', objectKey: 'apiDocumentation181', group: 'apiDocumentation' },
  { headerName: 'API Documentation - 170.315 (g)(10)', objectKey: 'apiDocumentation182', group: 'apiDocumentation' },
  { headerName: 'Service Base URL List', objectKey: 'serviceBaseUrlList', group: 'apiDocumentation' },
  { headerName: 'Mandatory Disclosures URL', objectKey: 'mandatoryDisclosures', group: 'apiDocumentation' },
  { headerName: 'Certification Criteria', objectKey: 'criteria' },
  { headerName: 'Clinical Quality Measures', objectKey: 'cqms' },
  { headerName: 'Total Surveillance', objectKey: 'surveillanceCount', group: 'compliance' },
  { headerName: 'Open Surveillance Non-conformities', objectKey: 'openSurveillanceNonConformityCount', group: 'compliance' },
  { headerName: 'Closed Surveillance Non-conformities', objectKey: 'closedSurveillanceNonConformityCount', group: 'compliance' },
  { headerName: 'Total Direct Reviews', objectKey: 'directReviewCount', group: 'compliance' },
  { headerName: 'Open Direct Review Non-conformities', objectKey: 'openDirectReviewNonConformityCount', group: 'compliance' },
  { headerName: 'Closed Direct Review Non-conformities', objectKey: 'closedDirectReviewNonConformityCount', group: 'compliance' },
  { headerName: 'Decertification Date', objectKey: 'decertificationDate' },
  { headerName: 'ONC-ACB', objectKey: 'acb' },
  { headerName: 'Practice Type', objectKey: 'practiceTypeName' },
  { headerName: 'Real World Testing Plans URL', objectKey: 'rwtPlansUrl', group: 'rwt' },
  { headerName: 'Real World Testing Results URL', objectKey: 'rwtResultsUrl', group: 'rwt' },
  { headerName: 'SVAP', objectKey: 'svap', group: 'svap' },
  { headerName: 'SVAP Notice URL', objectKey: 'svapNoticeUrl', group: 'svap' },
];

/* eslint object-curly-newline: ["error", { "minProperties": 5, "consistent": true }] */
const allCategories = [
  { name: 'CHPL ID', key: 'chplProductNumber', selected: true },
  { name: 'Certification Edition', key: 'fullEdition', selected: true },
  { name: 'Product data', key: 'productData', selected: true },
  { name: 'Certification Date', key: 'certificationDate', selected: true },
  { name: 'Certification Status', key: 'certificationStatusName', selected: true },
  { name: 'Details', key: 'detailsLink', selected: true, hasDivider: true },
  { name: 'API Documentation', key: 'apiDocumentation' },
  { name: 'Certification Criteria', key: 'criteria' },
  { name: 'Clinical Quality Measures', key: 'cqms' },
  { name: 'Compliance', key: 'compliance' },
  { name: 'Decertification Date', key: 'decertificationDate' },
  { name: 'ONC-ACB', key: 'acb' },
  { name: 'Practice Type', key: 'practiceTypeName' },
  { name: 'Real World Testing', key: 'rwt' },
  { name: 'SVAP', key: 'svap' },
];

const parseSvapCsv = ({ svaps }, data) => {
  if (svaps.length === 0) { return 'N/A'; }
  return svaps
    .map((item) => ({
      ...item,
      display: item.criterion.number,
      svaps: item.values.map((id) => data.find((s) => s.svapId === id)),
    }))
    .sort((a, b) => sortCriteria(a.criterion, b.criterion))
    .map((item) => `${item.display} - ${item.svaps.map((svap) => `${svap?.replaced ? 'Replaced | ' : ''}${svap?.regulatoryTextCitation}: ${svap?.approvedStandardVersion}`).join(';')}`)
    .join('\n');
};

function ChplDownloadListings(props) {
  const { analytics, toggled } = props;
  const $analytics = getAngularService('$analytics');
  const { isOn } = useContext(FlagContext);
  const { hasAnyRole } = useContext(UserContext);
  const [anchor, setAnchor] = useState(null);
  const [categories, setCategories] = useState(allCategories.map((h) => ({
    ...h,
    selected: toggled.includes(h.key) ? !h.selected : h.selected,
  })));
  const [editionlessIsOn, setEditionlessIsOn] = useState(false);
  const [listings, setListings] = useState([]);
  const [open, setOpen] = useState(false);
  const [svaps, setSvaps] = useState([]);
  const svapQuery = useFetchSvaps();
  const classes = useStyles();

  useEffect(() => {
    setListings(props.listings.map((listing) => ({
      ...listing,
      fullEdition: listing.edition ? `${listing.edition.name}${listing.curesUpdate ? ' Cures Update' : ''}` : '',
      developerName: listing.developer.name,
      productName: listing.product.name,
      versionName: listing.version.name,
      decertificationDate: listing.decertificationDate ?? '',
      certificationStatusName: listing.certificationStatus.name,
      acb: listing.certificationBody.name,
      practiceTypeName: listing.practiceType?.name ?? '',
      detailsLink: `https://chpl.healthit.gov/#/listing/${listing.id}`,
      criteria: listing.criteriaMet.sort(sortCriteria).map((cc) => `${cc.number}: ${cc.title}`).join('\n'),
      cqms: listing.cqmsMet.map((cqm) => ({ ...cqm, name: cqm.number })).sort(sortCqms).map((cqm) => cqm.number).join('\n'),
      apiDocumentation56: listing.apiDocumentation.find((cc) => cc.criterion.id === 56)?.value || '',
      apiDocumentation181: listing.apiDocumentation.find((cc) => cc.criterion.id === 181)?.value || '',
      apiDocumentation182: listing.apiDocumentation.find((cc) => cc.criterion.id === 182)?.value || '',
      serviceBaseUrlList: listing.serviceBaseUrlList?.value || '',
      rwtPlansUrl: listing.rwtPlansUrl || '',
      rwtResultsUrl: listing.rwtResultsUrl || '',
      svap: parseSvapCsv(listing, svaps),
      svapNoticeUrl: listing.svapNoticeUrl || '',
    })));
  }, [props.listings]); // eslint-disable-line react/destructuring-assignment

  useEffect(() => {
    if (svapQuery.isLoading || !svapQuery.isSuccess) {
      return;
    }
    setSvaps(svapQuery.data);
  }, [svapQuery.data, svapQuery.isLoading, svapQuery.isSuccess]);

  useEffect(() => {
    setEditionlessIsOn(isOn('editionless'));
  }, [isOn]);

  const canDownload = () => categories.some((cat) => cat.selected);

  const handleClick = (e) => {
    if (analytics) {
      $analytics.eventTrack('Open Download Filter', { category: analytics.category });
    }
    setAnchor(e.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setAnchor(null);
    setOpen(false);
  };

  const handleDownload = () => {
    const activeCategories = categories.filter((cat) => cat.selected && (cat.key !== 'fullEdition' || !editionlessIsOn)).map((cat) => cat.key);
    const csvExporter = new ExportToCsv({
      ...csvOptions,
      headers: allHeaders.filter((h) => activeCategories.includes(h.objectKey) || activeCategories.includes(h.group)),
    });
    if (analytics) {
      const defaulted = allCategories.filter((cat) => cat.selected || toggled.includes(cat.key));
      const added = categories.filter((cat) => cat.selected && !defaulted.some((def) => def.key === cat.key));
      const removed = defaulted.filter((def) => !categories.find((cat) => cat.selected && cat.key === def.key));
      if (added.length === 0 && removed.length === 0) {
        $analytics.eventTrack('Download Results With Default Data', { category: analytics.category });
      } else {
        added.forEach((cat) => {
          $analytics.eventTrack('Download Results With Additional Data', { category: analytics.category, label: cat.name });
        });
        removed.forEach((cat) => {
          $analytics.eventTrack('Download Results With Less Data', { category: analytics.category, label: cat.name });
        });
      }
    }
    csvExporter.generateCsv(listings);
  };

  const toggle = (header) => {
    setCategories((previous) => previous.map((p) => ({
      ...p,
      selected: header.key === p.key ? !p.selected : p.selected,
    })));
  };

  return (
    <>
      <ButtonGroup>
        <Button
          onClick={handleDownload}
          disabled={!canDownload()}
          color="secondary"
          variant="contained"
          size="small"
          id="download-listings"
        >
          Download
          {' '}
          { listings.length }
          {' '}
          Result
          { listings.length !== 1 ? 's' : '' }
        </Button>
        <ChplTooltip title="Select columns to download">
          <Button
            aria-controls="download-listings-menu"
            aria-haspopup="true"
            onClick={handleClick}
            color="secondary"
            variant="contained"
            size="small"
            id="open-download-listings-menu"
            className={classes.noMargin}
          >
            <ExpandMoreIcon />
          </Button>
        </ChplTooltip>
      </ButtonGroup>
      <Menu
        id="download-listings-menu"
        open={open}
        anchorEl={anchor}
        getContentAnchorEl={null}
        keepMounted
        onClose={handleClose}
        variant="selectedMenu"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          style: {
            alignItems: 'center',
            borderRadius: '0 0 8px 8px',
            border: `1px solid ${palette.grey}`,
            boxShadow: 'rgb(149 157 165 / 40%) 0px 6px 16px 6px',
            backgroundColor: '#fff',
          },
        }}
      >
        { categories.filter((c) => (c.key !== 'svap' || hasAnyRole(['chpl-admin', 'ROLE_ONC'])) && (c.key !== 'fullEdition' || !editionlessIsOn)).map((c) => [
          <MenuItem
            onClick={() => toggle(c)}
            key={c.key}
            selected={c.selected}
            style={{ gap: '8px', padding: '8px 16px' }}
          >
            <span className="sr-only">{ c.selected ? 'selected: ' : 'not selected: '}</span>
            { c.selected ? <CheckIcon /> : <CheckBoxOutlineBlankIcon color="primary" /> }
            { c.name }
          </MenuItem>,
          c.hasDivider && <Divider className={classes.noMargin} />,
        ])}
      </Menu>
    </>
  );
}

export default ChplDownloadListings;

ChplDownloadListings.propTypes = {
  listings: arrayOf(listingPropType),
  analytics: shape({
    category: string.isRequired,
  }),
  toggled: arrayOf(string),
};

ChplDownloadListings.defaultProps = {
  listings: [],
  analytics: undefined,
  toggled: [],
};
