import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Typography,
} from '@material-ui/core';

import { useFetchListings } from 'api/search';
import ChplActionButton from 'components/action-widget/action-button';
import ChplCertificationStatusLegend from 'components/certification-status/certification-status';
import ChplDownloadListings from 'components/download-listings/download-listings';
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
import { eventTrack } from 'services/analytics.service';
import { getDisplayDateFormat } from 'services/date-util';
import { getStatusIcon } from 'services/listing.service';
import { useSessionStorage as useStorage } from 'services/storage.service';
import { FlagContext, useAnalyticsContext } from 'shared/contexts';

const sortOptions = [
  { property: 'chpl_id', text: 'CHPL ID' },
  { property: 'developer', text: 'Developer' },
  { property: 'product', text: 'Product' },
  { property: 'version', text: 'Version' },
];

function ChplRealWorldTestingSearchView() {
  const storageKey = 'storageKey-realWorldTestingView';
  const { hti5ErdIsOn } = useContext(FlagContext);
  const { analytics } = useAnalyticsContext();
  const [listings, setListings] = useState([]);
  const [orderBy, setOrderBy] = useStorage(`${storageKey}-orderBy`, 'developer');
  const [pageNumber, setPageNumber] = useStorage(`${storageKey}-pageNumber`, 0);
  const [pageSize, setPageSize] = useStorage(`${storageKey}-pageSize`, 25);
  const [sortDescending, setSortDescending] = useStorage(`${storageKey}-sortDescending`, false);
  const [recordCount, setRecordCount] = useState(0);
  const toggledCsvDefaults = ['rwt'];

  const filterContext = useFilterContext();
  const { data, isError, isLoading } = useFetchListings({
    orderBy,
    pageNumber,
    pageSize,
    sortDescending,
    query: filterContext.queryString(),
  });

  useEffect(() => {
    if (isLoading) { return; }
    if (isError || !data.results) {
      setListings([]);
      return;
    }
    setListings(data.results.map((listing) => ({
      ...listing,
    })));
    setRecordCount(data.recordCount);
  }, [data?.results, data?.recordCount, isError, isLoading]);

  useEffect(() => {
    if (data?.recordCount > 0 && pageNumber > 0 && data?.results?.length === 0) {
      setPageNumber(0);
    }
  }, [data?.recordCount, pageNumber, data?.results?.length]);

  const handleSort = (property, orderDirection) => {
    eventTrack({
      ...analytics,
      event: 'Sort Column',
      label: `${property} - ${orderDirection === 'desc' ? 'DESC' : 'ASC'}`,
    });
    setOrderBy(property);
    setSortDescending(orderDirection === 'desc');
  };

  const buildSearchResultCard = (item) => (hti5ErdIsOn ? (
    <ChplSearchResultCard
      key={item.id}
      fieldGroups={[[{
        label: 'Developer',
        value: (
          <ChplLink
            href={`#/organizations/developers/${item.developer.id}`}
            text={item.developer.name}
            analytics={{
              ...analytics,
              event: 'Navigate to Developer Page',
              label: item.developer.name,
            }}
            external={false}
            router={{ sref: 'organizations.developers.developer', options: { id: item.developer.id } }}
          />
        ),
      }, {
        label: 'Product',
        value: item.product.name,
      }, {
        label: 'Version',
        value: item.version.name,
      }], [{
        label: 'CHPL ID',
        value: (
          <ChplLink
            href={`#/listing/${item.id}`}
            text={item.chplProductNumber}
            analytics={{
              ...analytics,
              event: 'Navigate to Listing Details Page',
              label: item.chplProductNumber,
              aggregationName: item.product.name,
            }}
            external={false}
            router={{ sref: 'listing', options: { id: item.id } }}
          />
        ),
      }, {
        label: 'Certification Date',
        value: getDisplayDateFormat(item.certificationDate),
      }, {
        label: 'Status',
        value: getStatusIcon(item.certificationStatus),
        iconButton: <ChplCertificationStatusLegend />,
      }], [{
        label: 'Real World Testing Results URL',
        value: item.rwtResultsUrl
          ? (
            <ChplLink
              href={item.rwtResultsUrl}
              analytics={{
                ...analytics,
                event: 'Go to Real World Testing Results URL',
                label: item.chplProductNumber,
                aggregationName: item.product.name,
              }}
            />
          )
          : 'N/A',
      }]]}
      actions={<ChplActionButton listing={item} />}
    />
  ) : (
    <ChplSearchResultCard
      key={item.id}
      fieldGroups={[[{
        label: 'Developer',
        value: (
          <ChplLink
            href={`#/organizations/developers/${item.developer.id}`}
            text={item.developer.name}
            analytics={{
              ...analytics,
              event: 'Navigate to Developer Page',
              label: item.developer.name,
            }}
            external={false}
            router={{ sref: 'organizations.developers.developer', options: { id: item.developer.id } }}
          />
        ),
      }, {
        label: 'Product',
        value: item.product.name,
      }, {
        label: 'Version',
        value: item.version.name,
      }], [{
        label: 'CHPL ID',
        value: (
          <ChplLink
            href={`#/listing/${item.id}`}
            text={item.chplProductNumber}
            analytics={{
              ...analytics,
              event: 'Navigate to Listing Details Page',
              label: item.chplProductNumber,
              aggregationName: item.product.name,
            }}
            external={false}
            router={{ sref: 'listing', options: { id: item.id } }}
          />
        ),
      }, {
        label: 'Certification Date',
        value: getDisplayDateFormat(item.certificationDate),
      }, {
        label: 'Status',
        value: getStatusIcon(item.certificationStatus),
        iconButton: <ChplCertificationStatusLegend />,
      }], [{
        label: 'Real World Testing Plans URL',
        value: item.rwtPlansUrl
          ? (
            <ChplLink
              href={item.rwtPlansUrl}
              analytics={{
                ...analytics,
                event: 'Go to Real World Testing Plans URL',
                label: item.chplProductNumber,
                aggregationName: item.product.name,
              }}
            />
          )
          : 'N/A',
      }, {
        label: 'Real World Testing Results URL',
        value: item.rwtResultsUrl
          ? (
            <ChplLink
              href={item.rwtResultsUrl}
              analytics={{
                ...analytics,
                event: 'Go to Real World Testing Results URL',
                label: item.chplProductNumber,
                aggregationName: item.product.name,
              }}
            />
          )
          : 'N/A',
      }]]}
      actions={<ChplActionButton listing={item} />}
    />
  ));

  const pageStart = (pageNumber * pageSize) + 1;
  const pageEnd = Math.min((pageNumber + 1) * pageSize, recordCount);

  return (
    <>
      <ChplPageHeader
        text="Real World Testing"
        subtitle={(
          <>
            <Typography variant="body1" gutterBottom>
              This list includes Health IT Module(s) eligible for Real World Testing, which is an annual
              {' '}
              <ChplLink
                href="https://www.healthit.gov/topic/certification-ehrs/conditions-maintenance-certification"
                text="Condition and Maintenance of Certification requirement"
                analytics={{
                  ...analytics,
                  event: 'Go to Condition and Maintenance of Certification requirement',
                }}
                external={false}
                inline
              />
              {' '}
              for health IT developers participating in the ONC Health IT Certification Program. Certified Health IT Developers with one or more Health IT Module(s) certified to any of the certification criteria outlined in &sect;170.405(a) of
              {' '}
              <ChplLink
                href="https://www.healthit.gov/curesrule/"
                text="ONC&apos;s Cures Act Final Rule"
                analytics={{
                  ...analytics,
                  event: 'Go to ONC&apos;s Cures Act Final Rule',
                }}
                external={false}
                inline
              />
              {' '}
              must successfully test their real world use.
              {' '}
              {!hti5ErdIsOn && 'If applicable, Real World Testing plans are required to be made publicly available on the CHPL annually by December 15th. Additionally, '}
              Real World Testing results are to be made publicly available on the CHPL by March 15th of the subsequent year.
            </Typography>
            <br />
            <Typography variant="body1" gutterBottom>
              For more information, please visit the
              {' '}
              <ChplLink
                href="https://www.healthit.gov/topic/certification-ehrs/real-world-testing"
                text="Real World Testing resources"
                analytics={{
                  ...analytics,
                  event: 'Go to Real World Testing resources',
                }}
                external={false}
                inline
              />
              . Real World Testing summary data is also available through
              {' '}
              <ChplLink
                href="#/resources/download"
                text="Download the CHPL"
                analytics={{
                  ...analytics,
                  event: 'Navigate to Download the CHPL',
                }}
                external={false}
                router={{ sref: 'resources.download' }}
                inline
              />
              . Please note that by default, only listings that are active or suspended are shown in the search results.
            </Typography>
          </>
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
                <ChplDownloadListings
                  listings={listings}
                  toggled={toggledCsvDefaults}
                />
              </ChplSearchResultControls>
              { listings.length > 0
              && (
                <>
                  <Box>
                    {listings.map((item) => buildSearchResultCard(item))}
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

export default ChplRealWorldTestingSearchView;

ChplRealWorldTestingSearchView.propTypes = {
};
