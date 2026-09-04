import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
} from '@material-ui/core';
import CloudDownloadOutlinedIcon from '@material-ui/icons/CloudDownloadOutlined';
import { useSelector } from 'react-redux';
import { getAccessToken } from 'axios-jwt';

import { useFetchQuestionableActivity } from 'api/questionable-activity';
import ChplQuestionableActivityDetails from 'components/activity/questionable-activity-details';
import {
  ChplLink,
  ChplLoadingCards,
  ChplPagination,
  ChplPageBody,
  ChplPageHeader,
  ChplSearchResultCard,
  ChplSearchResultControls,
  ChplSortControls,
} from 'components/util';
import {
  ChplFilterLayout,
  ChplFilterSearchBar,
  useFilterContext,
} from 'components/filter';
import { getDisplayDateFormat } from 'services/date-util';
import { eventTrack } from 'services/analytics.service';
import { useSessionStorage as useStorage } from 'services/storage.service';
import { useAnalyticsContext } from 'shared/contexts';

function ChplQuestionableActivityView() {
  const apiKey = useSelector((state) => state.browserInfo.apiKey);
  const API = useSelector((state) => state.browserInfo.api);
  const storageKey = 'storageKey-questionableActivity';
  const { analytics } = useAnalyticsContext();
  const [activities, setActivities] = useState([]);
  const [downloadLink, setDownloadLink] = useState('');
  const [orderBy, setOrderBy] = useStorage(`${storageKey}-orderBy`, 'activity_date');
  const [pageNumber, setPageNumber] = useStorage(`${storageKey}-pageNumber`, 0);
  const [pageSize, setPageSize] = useStorage(`${storageKey}-pageSize`, 25);
  const [sortDescending, setSortDescending] = useStorage(`${storageKey}-sortDescending`, true);
  const [recordCount, setRecordCount] = useState(0);

  const filterContext = useFilterContext();
  const { data, isError, isLoading } = useFetchQuestionableActivity({
    orderBy,
    pageNumber,
    pageSize,
    sortDescending,
    query: filterContext.queryString(),
  });

  useEffect(() => {
    if (isLoading) { return; }
    if (isError || !data.results) {
      setActivities([]);
      return;
    }
    setActivities(data.results.map((activity) => ({
      ...activity,
    })));
    setRecordCount(data.recordCount);
  }, [data?.results, data?.recordCount, isError, isLoading]);

  useEffect(() => {
    if (data?.recordCount > 0 && pageNumber > 0 && data?.results?.length === 0) {
      setPageNumber(0);
    }
  }, [data?.recordCount, pageNumber, data?.results?.length]);

  useEffect(() => {
    setDownloadLink(`${API}/questionable-activity/download?api_key=${apiKey}`);
  }, [API, apiKey]);

  /* eslint object-curly-newline: ["error", { "minProperties": 5, "consistent": true }] */
  const sortOptions = [
    { property: 'developer', text: 'Developer' },
    { property: 'product', text: 'Product' },
    { property: 'version', text: 'Version' },
    { property: 'chpl_product_number', text: 'CHPL ID' },
    { property: 'activity_date', text: 'Activity Date', reverseDefault: true },
  ];

  const handleClick = async () => {
    eventTrack({
      ...analytics,
      event: 'Download Filtered results',
    });
    const accessToken = await getAccessToken();
    window.open(`${downloadLink}&authorization=Bearer%20${accessToken}&${filterContext.queryString()}`);
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

  const pageStart = (pageNumber * pageSize) + 1;
  const pageEnd = Math.min((pageNumber + 1) * pageSize, recordCount);

  return (
    <>
      <ChplPageHeader
        text="Questionable Activity"
        subtitle={(
          <Typography variant="body1">
            The Questionable Activity Report offers users the ability to monitor the activities performed on specific CHPL products by ONC-Authorized Certification Bodies and assess their adherence to ONC-established rules. This feature serves as an essential transparency mechanism, allowing ONC to identify any questionable actions that may warrant further investigation. Users can filter and search this list based on their specific interests or concerns.
          </Typography>
        )}
      />
      <ChplPageBody>
        <ChplFilterSearchBar sticky />
        <ChplFilterLayout>
          { isLoading && (<ChplLoadingCards />)}
          { !isLoading
          && (
            <>
              <ChplSearchResultControls
                recordCount={recordCount}
                pageStart={pageStart}
                pageEnd={pageEnd}
              >
                <ChplSortControls
                  sortOptions={sortOptions}
                  orderBy={orderBy}
                  order={sortDescending ? 'desc' : 'asc'}
                  onSort={handleSort}
                />
                { activities.length > 0
                  && (
                    <Button
                      color="secondary"
                      variant="contained"
                      size="small"
                      id="download-filtered-results"
                      onClick={handleClick}
                      endIcon={<CloudDownloadOutlinedIcon />}
                    >
                      Download Filtered Results
                    </Button>
                  )}
              </ChplSearchResultControls>
              { activities.length > 0
                && (
                  <>
                    <Box>
                      { activities.map((item) => (
                        <ChplSearchResultCard
                          key={item.id}
                          cardTitle="Developer"
                          cardTitleValue={item.developerId
                            ? (
                              <ChplLink
                                href={`#/organizations/developers/${item.developerId}`}
                                text={item.developerName}
                                analytics={{
                                  ...analytics,
                                  event: 'Go to Developer Page',
                                  label: item.developerName,
                                }}
                                external={false}
                                router={{ sref: 'organizations.developers.developer', options: { id: item.developerId } }}
                              />
                            )
                            : item.developerName || 'N/A'}
                          fieldGroups={[
                            [
                              { label: 'Product', value: item.productName },
                              { label: 'Version', value: item.versionName },
                              {
                                label: 'CHPL ID',
                                style: { flex: '2 1 320px' },
                                value: item.listingId
                                  ? (
                                    <ChplLink
                                      href={`#/listing/${item.listingId}`}
                                      text={item.chplProductNumber}
                                      analytics={{
                                        ...analytics,
                                        event: 'Go to Listing Details Page',
                                        label: item.chplProductNumber,
                                      }}
                                      external={false}
                                      router={{ sref: 'listing', options: { id: item.listingId } }}
                                    />
                                  )
                                  : item.chplProductNumber,
                              },
                            ],
                            [
                              { label: 'Activity', value: item.triggerName },
                              { label: 'Activity Date', value: getDisplayDateFormat(item.activityDate) },
                              {
                                label: 'Reason',
                                style: { flex: '2 1 320px' },
                                value: item.reason || item.certificationStatusChangeReason || 'N/A',
                              },
                            ],
                          ]}
                          actions={<ChplQuestionableActivityDetails activity={item} />}
                        />
                      ))}
                    </Box>
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
      </ChplPageBody>
    </>
  );
}

export default ChplQuestionableActivityView;

ChplQuestionableActivityView.propTypes = {
};
