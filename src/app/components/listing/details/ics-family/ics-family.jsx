import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Button,
  CircularProgress,
  List,
  ListItem,
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
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
  spacingFactor: 0.5,
};

const stylesheet = [{
  selector: 'node',
  style: {
    width: 170,
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
}, {
  selector: 'node[?active]',
  style: {
    'background-color': 'green',
  },
}, {
  selector: 'edge',
  style: {
    width: 6,
    'line-color': '#ccc',
    'mid-target-arrow-color': '#ccc',
    'mid-target-arrow-shape': 'triangle',
  },
}];

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
  const [compare, setCompare] = useState('');
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
    setListings(data.sort((a, b) => (a.chplProductNumber < b.chplProductNumber ? -1 : 1)));
    setElements(generateElements(data, id));
    setCompare(`#/compare/${data.map((l) => l.id).join('&')}`);
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
            <figure>
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
              <figcaption className="sr-only">
                <Typography variant="h5">Overview</Typography>
                <Typography>The image shows the ICS relationships between related Products</Typography>
                <Typography variant="h5">Values</Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>CHPL Product Number</TableCell>
                      <TableCell>Certification Status</TableCell>
                      <TableCell>Inherits from</TableCell>
                      <TableCell>Source for</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    { listings.map((l) => (
                      <TableRow key={l.id}>
                        <TableCell>
                          { l.id === id
                            ? (
                              <>
                                { l.chplProductNumber }
                              </>
                            ) : (
                              <ChplLink
                                href={`#/listing/${l.id}?panel=additional`}
                                text={l.chplProductNumber}
                                external={false}
                              />
                            )}
                        </TableCell>
                        <TableCell>{ l.certificationStatus.name }</TableCell>
                        <TableCell>
                          <List>
                            { l.parents.map((p) => (
                              <ListItem key={p.chplProductNumber}>
                                {p.chplProductNumber}
                              </ListItem>
                            ))}
                          </List>
                        </TableCell>
                        <TableCell>
                          <List>
                            { l.children.map((c) => (
                              <ListItem key={c.chplProductNumber}>
                                {c.chplProductNumber}
                              </ListItem>
                            ))}
                          </List>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </figcaption>
            </figure>
            { !isLoading
              && (
                <ChplLink
                  href={compare}
                  text="Compare"
                  external={false}
                />
              )}
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
                  { listing?.id && (id !== listing.id)
                    && (
                      <Typography>
                        <ChplLink
                          href={`#/listing/${listing?.id}?panel=additional`}
                          text="View full details"
                          external={false}
                        />
                      </Typography>
                    )}
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
