import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Button,
  CircularProgress,
  Typography,
} from '@material-ui/core';
import { number } from 'prop-types';
import CytoscapeComponent from 'react-cytoscapejs';

import { useFetchIcsFamilyData } from 'api/listing';
import { ChplLink } from 'components/util';

const layout = {
  name: 'breadthfirst',
  animate: true,
  directed: 'true',
  spacingFactor: 1.1,
};

const stylesheet = [
  {
    selector: 'node',
    style: {
      // width: 'label' ,
      // height: 'label',
      shape: 'roundrectangle',
      label: 'data(label)',
      color: 'white',
      'font-size': '12pt',
      'min-zoomed-font-size': '6pt',
      'text-halign': 'center',
      'text-valign': 'center',
      'text-wrap': 'wrap',
      'text-max-width': 1000,
      'border-width': 0,
      'background-color': 'blue',
      'padding-left': '10px',
      'padding-top': '15px',
      'padding-right': '10px',
      'padding-bottom': '15px',
    },
  },
  {
    selector: 'node[?active]',
    style: {
      'background-color': 'green',
    },
  },
  {
    selector: 'edge',
    style: {
      width: 6,
      'line-color': '#ccc',
      'target-arrow-color': '#ccc',
      'target-arrow-shape': 'triangle',
    },
  },
];

const generateElements = (listings, active) => {
  const nodes = listings.map((l) => ({
    data: {
      ...l,
      label: `${l.chplProductNumber}\n${l.certificationStatus.name}`,
      active: l.id === active,
    },
  }));
  const edges = listings.flatMap((l) => l.parents.map((p) => ({
    data: {
      source: p.id,
      target: l.id,
      label: `Edge from ${p.chplProductNumber} to ${l.chplProductNumber}`,
    },
  })));
  const data = nodes.concat([...edges]);
  return data;
};

function ChplIcsFamily(props) {
  const { id } = props;
  const { data, isLoading, isSuccess } = useFetchIcsFamilyData({ id });
  const [elements, setElements] = useState([]);
  const [isShowingDiagram, setIsShowingDiagram] = useState(false);
  const [isShowingListingDetails, setIsShowingListingDetails] = useState(false);
  const [listing, setListing] = useState({});
  const [listingId, setListingId] = useState(undefined);
  const [listings, setListings] = useState([]);
  const cy = useRef(null);

  useEffect(() => () => {
    if (cy.current) {
      cy.current.removeAllListeners();
      cy.current = null;
    }
  }, []);

  useEffect(() => {
    if (cy.current && !isShowingDiagram) {
      cy.current.removeAllListeners();
      cy.current = null;
    }
  }, [isShowingDiagram]);

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    setListings(data);
    setElements(generateElements(data, id));
  }, [data, isLoading, isSuccess]);

  useEffect(() => {
    const selected = listings.find((l) => `${l.id}` === listingId);
    setListing(selected);
    setIsShowingListingDetails(!!selected);
  }, [listingId]);

  const setCytoscape = useCallback((ref) => {
    if (cy.current) return;
    cy.current = ref;
    cy.current.on('tap', 'node', (e) => {
      setListingId(e.target.id());
    });
  }, [cy]);

  if (!isLoading && !isSuccess) {
    return (
      <Typography>Error</Typography>
    );
  }

  return (
    <>
      <Button
        disabled={isLoading}
        onClick={() => setIsShowingDiagram(!isShowingDiagram)}
      >
        { isShowingDiagram ? 'Hide' : 'Show' }
        {' '}
        ICS Relationships
        { isLoading && <CircularProgress /> }
      </Button>
      { isShowingDiagram
        && (
          <>
            <CytoscapeComponent
              elements={elements}
              style={{ width: '600px', height: '600px' }}
              minZoom={0.3}
              maxZoom={3}
              autoungrabify
              layout={layout}
              stylesheet={stylesheet}
              cy={setCytoscape}
            />
            { isShowingListingDetails
              && (
                <>
                  <Typography variant="h5">{ listing?.chplProductNumber }</Typography>
                  <Typography>
                    <strong>Developer:</strong>
                    <ChplLink
                      href={`#/organizations/developers/${listing?.developer.id}`}
                      text={listing?.developer.name}
                      external={false}
                    />
                  </Typography>
                  <Typography>
                    <strong>Product:</strong>
                    {' '}
                    { listing?.product.name }
                  </Typography>
                  <Typography>
                    <strong>Version:</strong>
                    {' '}
                    { listing?.version.name }
                  </Typography>
                  <Typography>
                    <strong>Certification Status:</strong>
                    {' '}
                    { listing?.certificationStatus.name }
                  </Typography>
                  <Typography>
                    <ChplLink
                      href={`#/listing/${listing?.id}?panel=additional`}
                      text="View full details"
                      external={false}
                    />
                  </Typography>
                  <Button
                    onClick={() => setIsShowingListingDetails(false)}
                  >
                    Hide Details
                  </Button>
                </>
              )}
          </>
        )}
    </>
  );
}

export default ChplIcsFamily;

ChplIcsFamily.propTypes = {
  id: number.isRequired,
};
