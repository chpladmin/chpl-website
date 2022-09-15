import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import Moment from 'react-moment';
import { shape, string } from 'prop-types';

import { theme, utilStyles } from 'themes';
import {
  useFetchBannedDevelopersCollection,
} from 'api/collections';
import {
  ChplLink,
  ChplPagination,
  ChplSortableHeaders,
} from 'components/util';
import {
  ChplFilterChips,
  ChplFilterPanel,
  ChplFilterSearchTerm,
  useFilterContext,
} from 'components/filter';
import { getAngularService } from 'services/angular-react-helper';
import { FlagContext } from 'shared/contexts';

const useStyles = makeStyles({
  ...utilStyles,
  pageHeader: {
    padding: '32px',
    backgroundColor: '#ffffff',
  },
  pageBody: {
    display: 'grid',
    gridTemplateColumns: ' 1fr',
    gap: '16px',
    padding: '16px 32px',
    backgroundColor: '#f9f9f9',
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '2fr 1fr',
    },
  },
  pageContent: {
    display: 'grid',
    gridTemplateRows: '3fr 1fr',
  },
  searchContainer: {
    backgroundColor: '#c6d5e5',
    padding: '16px 32px',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: 'auto 10fr auto',
    },
  },
  stickyColumn: {
    position: 'sticky',
    left: 0,
    boxShadow: 'rgba(149, 157, 165, 0.1) 0px 4px 8px',
    backgroundColor: '#ffffff',
    overflowWrap: 'anywhere',
    [theme.breakpoints.up('sm')]: {
      minWidth: '275px',
    },
  },
  tableContainer: {
    overflowWrap: 'normal',
    border: '.5px solid #c2c6ca',
    margin: '0px 32px',
    width: 'auto',
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
  noResultsContainer: {
    padding: '16px 32px',
  },
});

const parseBannedDevelopers = ({ apiDocumentation }, analytics, erdPhase2IsOn) => {
  if (apiDocumentation.length === 0) { return 'N/A'; }
  const items = Object.entries(apiDocumentation
    .filter((item) => !erdPhase2IsOn || (item.criterion.id !== 57 && item.criterion.id !== 58))
    .map((item) => ({
      id: item.criterion.id,
      url: item.value,
    }))
    .reduce((map, { id, url }) => ({
      ...map,
      [url]: (map[url] || []).concat(id),
    }), {}))
    .map(([url, ids]) => ({
      url,
      criteria: ids
        .sort((a, b) => criteriaLookup(erdPhase2IsOn)[a].sort - criteriaLookup(erdPhase2IsOn)[b].sort)
        .map((id) => criteriaLookup(erdPhase2IsOn)[id].display)
        .join(', '),
    }));
  return (
    <dl>
      {items.map(({ url, criteria }) => (
        <React.Fragment key={url}>
          <dt>{ criteria }</dt>
          <dd>
            <ChplLink
              key={url}
              href={url}
              analytics={{ event: 'Go to API Documentation Website', category: analytics.category, label: url }}
            />
          </dd>
        </React.Fragment>
      ))}
    </dl>
  );
};

function ChplBannedDevelopersCollectionView(props) {
  const $analytics = getAngularService('$analytics');
  const authService = getAngularService('authService');
  const { analytics } = props;
  const [developers, setDevelopers] = useState([]);
  const [orderBy, setOrderBy] = useState('developer');
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [sortDescending, setSortDescending] = useState(false);
  const classes = useStyles();

  const filterContext = useFilterContext();
  const { isLoading, data } = useFetchBannedDevelopersCollection({
    orderBy,
    pageNumber,
    pageSize,
    sortDescending,
    query: filterContext.queryString(),
  });

  useEffect(() => {
    if (isLoading || !data.results) { return; }
    setDevelopers(data.results.map((developer) => ({
      ...developer,
      oncAcbDisplay: developer.associatedAcbs.map((acb) => acb.name).join(', '),
    })));
  }, [isLoading, data?.results]);

  useEffect(() => {
    if (data?.recordCount > 0 && pageNumber > 0 && data?.results?.length === 0) {
      setPageNumber(0);
    }
  }, [data?.recordCount, pageNumber, data?.results?.length]);

  /* eslint object-curly-newline: ["error", { "minProperties": 5, "consistent": true }] */
  const headers = [
    { property: 'developer', text: 'Developer', sortable: true },
    { property: 'decertificationDate', text: 'Decertification Date', sortable: true, reverse: true },
    { text: 'ONC-ACB' },
  ];

  const handleTableSort = (event, property) => {
    $analytics.eventTrack('Sort', { category: analytics.category, label: property });
    if (orderBy === property) {
      setSortDescending(!sortDescending);
    } else {
      setOrderBy(property);
    }
  };

  const pageStart = (pageNumber * pageSize) + 1;
  const pageEnd = Math.min((pageNumber + 1) * pageSize, data?.recordCount);

  return (
    <>
      <div className={classes.pageHeader}>
        <Typography variant="h1">
          Developers Under Certification Ban
        </Typography>
      </div>
      <div className={classes.pageBody}>
        <div>
          <Typography variant="body1" gutterBottom>
            This is a list of health IT developers currently precluded from certifying any health IT products under the ONC Health IT Certification Program - including new products as well as upgraded versions of current products. ONC may lift these statuses if it determines that the developer has taken appropriate steps to remedy problems or issues for all affected products and users and prevent their recurrence. A developer may be precluded from certifying products for two reasons:
          </Typography>
          <ol>
            <li><strong>Developer Failure to Take Appropriate Corrective Action</strong> A developer may be precluded from the Program if the developer or one of its products fails to comply with any requirements of certification and the developer fails to take appropriate actions to correct the non-compliance.</li>
            <li><strong>Product Withdrawn While Under Surveillance</strong> A developer may also be precluded if it fails to cooperate with the surveillance or other oversight of its certified products. ONC may lift the ban if it determines that the developer has taken appropriate steps to remedy problems or issues for all affected products and users and prevent their recurrence.</li>
          </ol>
          <Typography variant="body1">
            Health IT products currently listed on the CHPL will maintain their listed certification status regardless of whether their developer is precluded from the program. Please consult your health IT product’s details page to confirm its certification status by <a href="https://chpl.healthit.gov/#/search">searching for the product</a>
          </Typography>
        </div>
      </div>
      <div className={classes.searchContainer} component={Paper}>
        <ChplFilterSearchTerm />
        <ChplFilterPanel />
      </div>
      <div>
        <ChplFilterChips />
      </div>
      { isLoading
        && (
          <>Loading</>
        )}
      { !isLoading && developers.length === 0
        && (
          <Typography className={classes.noResultsContainer}>
            No results found
          </Typography>
        )}
      { !isLoading && developers.length > 0
       && (
       <>
         <div className={classes.tableResultsHeaderContainer}>
           <div className={`${classes.resultsContainer} ${classes.wrap}`}>
             <Typography variant="subtitle2">Search Results:</Typography>
             <Typography variant="body2">
               {`(${pageStart}-${pageEnd} of ${data?.recordCount} Results)`}
             </Typography>
           </div>
         </div>
         <TableContainer className={classes.tableContainer} component={Paper}>
           <Table
             stickyHeader
             aria-label="Developers Under Certification Ban table"
           >
             <ChplSortableHeaders
               headers={headers}
               onTableSort={handleTableSort}
               orderBy={orderBy}
               order={sortDescending ? 'desc' : 'asc'}
               stickyHeader
             />
             <TableBody>
               { developers
                 .map((item) => (
                   <TableRow key={item.id}>
                     <TableCell className={classes.stickyColumn}>
                       <strong>
                         <ChplLink
                           href={`#/organizations/developer/${item.id}`}
                           text={item.name}
                           analytics={{ event: 'Go to Developer Details Page', category: analytics.category, label: item.name }}
                           external={false}
                           router={{ sref: 'organizations.developers.developer', options: { id: item.id } }}
                         />
                       </strong>
                     </TableCell>
                     <TableCell>
                       { item.decertificationDate }
                     </TableCell>
                     <TableCell>
                       { item.oncAcbDisplay }
                     </TableCell>
                   </TableRow>
                 ))}
             </TableBody>
           </Table>
         </TableContainer>
         <ChplPagination
           count={data.recordCount}
           page={pageNumber}
           rowsPerPage={pageSize}
           rowsPerPageOptions={[25, 50, 100]}
           setPage={setPageNumber}
           setRowsPerPage={setPageSize}
           analytics={analytics}
         />
       </>
       )}
    </>
  );
}

export default ChplBannedDevelopersCollectionView;

ChplBannedDevelopersCollectionView.propTypes = {
  analytics: shape({
    category: string.isRequired,
  }).isRequired,
};
