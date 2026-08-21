import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  makeStyles,
} from '@material-ui/core';
import CloudDownloadOutlinedIcon from '@material-ui/icons/CloudDownloadOutlined';

import ChplMessaging from './messaging/messaging';

import { useFetchDevelopersBySearch } from 'api/developer';
import {
  ChplFilterLayout,
  ChplFilterSearchBar,
  useFilterContext,
} from 'components/filter';
import {
  ChplLink,
  ChplLoadingCards,
  ChplPagination,
  ChplSearchResultCard,
  ChplSearchResultControls,
  ChplSortControls,
} from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { getAngularService } from 'services/angular-react-helper';
import { useSessionStorage as useStorage } from 'services/storage.service';
import { UserContext, useAnalyticsContext } from 'shared/contexts';
import { palette, utilStyles } from 'themes';

const sortOptions = [
  { property: 'developer_name', text: 'Developer' },
  { property: 'developer_code', text: 'Developer Code' },
];

const useStyles = makeStyles({
  ...utilStyles,
  developerView: {
    display: 'grid',
    borderRadius: 4,
    gridTemplateRows: '1fr',
  },
});

function ChplDevelopersView() {
  const storageKey = 'storageKey-developersView';
  const API = getAngularService('API');
  const { getApiKey, getToken } = getAngularService('authService');
  const { analytics } = useAnalyticsContext();
  const { hasAnyRole } = useContext(UserContext);
  const { dispatch, queryString } = useFilterContext();
  const [developers, setDevelopers] = useState([]);
  const [orderBy, setOrderBy] = useStorage(`${storageKey}-orderBy`, 'developer_name');
  const [pageNumber, setPageNumber] = useStorage(`${storageKey}-pageNumber`, 0);
  const [pageSize, setPageSize] = useStorage(`${storageKey}-pageSize`, 25);
  const [sortDescending, setSortDescending] = useStorage(`${storageKey}-sortDescending`, false);
  const [messaging, setMessaging] = useState(false);
  const [recordCount, setRecordCount] = useState(0);
  const classes = useStyles();

  const {
    data, isError, isLoading,
  } = useFetchDevelopersBySearch({
    orderBy,
    pageNumber,
    pageSize,
    sortDescending,
    query: queryString(),
  });

  useEffect(() => {
    if (isLoading) { return; }
    if (isError || !data.results) {
      setDevelopers([]);
      return;
    }
    if (isLoading || !data.results) { return; }
    setDevelopers(data.results.map((developer) => ({
      ...developer,
      oncAcbDisplay: developer.acbsForActiveListings.map((acb) => acb.name).sort((a, b) => (a < b ? -1 : 1)).join(', '),
    })));
    setRecordCount(data.recordCount);
  }, [data?.results, data?.recordCount, isError, isLoading]);

  useEffect(() => {
    if (data?.recordCount > 0 && pageNumber > 0 && data?.results?.length === 0) {
      setPageNumber(0);
    }
  }, [data?.recordCount, pageNumber, data?.results?.length]);

  const downloadDevelopers = () => {
    eventTrack({
      ...analytics,
      event: 'Download Developers',
      label: recordCount,
    });
    let url = `${API}/developers/search/download?api_key=${getApiKey()}&${queryString()}`;
    if (hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb'])) {
      url += `&authorization=Bearer%20${getToken()}`;
    }
    window.open(url);
  };

  const handleDispatch = () => {
    setMessaging(false);
  };

  const handleSort = (property, orderDirection) => {
    eventTrack({
      ...analytics,
      event: 'Sort Column',
      label: `${property} - ${orderDirection === 'desc' ? 'DESC' : 'ASC'}`,
    });
    setOrderBy(property);
    setSortDescending(orderDirection === 'desc');
  };

  const notYetPublishedAttestations = {
    display: 'Not Yet Published Attestations',
    toggle: () => {
      dispatch('resetAll');
      dispatch('toggle', { key: 'activeListingsOptions' }, { value: 'had_any_active_during_most_recent_past_attestation_period' });
      dispatch('toggle', { key: 'attestationsOptions' }, { value: 'has_not_published' });
      dispatch('toggleOperator', { key: 'activeListingsOptions', operator: 'and' });
    },
  };

  const notYetSubmittedAttestations = {
    display: 'Not Yet Submitted Attestations',
    toggle: () => {
      dispatch('resetAll');
      dispatch('toggle', { key: 'activeListingsOptions' }, { value: 'had_any_active_during_most_recent_past_attestation_period' });
      dispatch('toggle', { key: 'attestationsOptions' }, { value: 'has_not_submitted' });
      dispatch('toggleOperator', { key: 'activeListingsOptions', operator: 'and' });
    },
  };

  const bonusQuickFilters = [notYetPublishedAttestations, notYetSubmittedAttestations];

  const pageStart = (pageNumber * pageSize) + 1;
  const pageEnd = Math.min((pageNumber + 1) * pageSize, recordCount);

  if (messaging) {
    return (
      <ChplMessaging
        dispatch={handleDispatch}
      />
    );
  }

  return (
    <>
      <div className={classes.developerView} id="main-content" tabIndex="-1">
        <ChplFilterSearchBar
          sticky
          filterGridMinColWidth={600}
          placeholder="Search by Developer Name or Code..."
          toggleMultipleFilters={bonusQuickFilters}
        />
        <ChplFilterLayout>
          { isLoading && (<ChplLoadingCards />)}
          { !isLoading
          && (
            <>
              <ChplSearchResultControls
                recordCount={recordCount}
                pageStart={pageStart}
                pageEnd={pageEnd}
                wrapActions
              >
                <ChplSortControls
                  sortOptions={sortOptions}
                  orderBy={orderBy}
                  order={sortDescending ? 'desc' : 'asc'}
                  onSort={handleSort}
                />
                <Button
                  onClick={downloadDevelopers}
                  id="download-developers"
                  variant="outlined"
                  color="primary"
                  endIcon={<CloudDownloadOutlinedIcon />}
                >
                  Download information for
                  {' '}
                  { recordCount }
                  {' '}
                  {`Developer${recordCount !== 1 ? 's' : ''}`}
                </Button>
                { hasAnyRole(['chpl-admin', 'chpl-onc'])
                  && (
                    <Button
                      onClick={() => setMessaging(true)}
                      id="compose-message"
                      variant="outlined"
                      color="primary"
                    >
                      Send message to
                      {' '}
                      { recordCount }
                      {' '}
                      {`Developer${recordCount !== 1 ? 's' : ''}`}
                    </Button>
                  )}
              </ChplSearchResultControls>
              { developers.length > 0
              && (
                <>
                  { developers.map((item) => (
                    <ChplSearchResultCard
                      key={item.id}
                      fieldGroups={[[
                        {
                          label: 'Developer',
                          value: (
                            <ChplLink
                              href={`#/organizations/developers/${item.id}`}
                              text={item.name}
                              analytics={{
                                ...analytics,
                                event: 'Navigate to Developer Page',
                                label: item.name,
                              }}
                              external={false}
                              router={{ sref: 'organizations.developers.developer', options: { id: item.id } }}
                            />
                          ),
                        },
                        {
                          label: 'Developer Code',
                          value: item.code,
                        },
                        {
                          label: 'ONC-ACB for Active Listings',
                          value: item.oncAcbDisplay,
                        },
                      ]]}
                    />
                  ))}
                  <ChplPagination
                    count={recordCount}
                    page={pageNumber}
                    rowsPerPage={pageSize}
                    rowsPerPageOptions={[25, 50, 100]}
                    setPage={setPageNumber}
                    setRowsPerPage={setPageSize}
                  />
                </>
              )}
            </>
          )}
        </ChplFilterLayout>
      </div>
    </>
  );
}

export default ChplDevelopersView;

ChplDevelopersView.propTypes = {
};
