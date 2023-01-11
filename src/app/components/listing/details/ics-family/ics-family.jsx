import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { number } from 'prop-types';
import CytoscapeComponent from 'react-cytoscapejs';

import { useFetchIcsFamilyData } from 'api/listing';
import { ChplLink } from 'components/util';

const useStyles = makeStyles({
  cardContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '16px',
  },
  detailContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    gap: '4px',
  },
  directionContainer: {
    width: '50%',
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    gap: '32px',
  },
  figureContainer: {
    width: '50%',
    height: '475px',
    borderLeft: '1px solid #ccc',
  },
  spacingforshowButton: {
    marginBottom: '8px',
  },
});

const layout = {
  name: 'breadthfirst',
  animate: true,
  directed: 'true',
  spacingFactor: 0.75,
};

const stylesheet = [{
  selector: 'node',
  style: {
    width: 200,
    shape: 'roundrectangle',
    label: 'data(label)',
    color: 'black',
    'font-size': '12pt',
    'min-zoomed-font-size': '6pt',
    'text-halign': 'center',
    'text-valign': 'center',
    'text-wrap': 'wrap',
    'text-max-width': 1000,
    'border-width': 0,
    'background-color': '#eee',
    'padding-left': '15px',
    'padding-top': '15px',
    'padding-right': '15px',
    'padding-bottom': '15px',
  },
}, {
  selector: 'node[?active]',
  style: {
    'background-color': '#2E7D32',
    color: 'white',
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
  const classes = useStyles();

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
  }, [data, isLoading, isSuccess, id]);

  useEffect(() => {
    const selected = listings.find((l) => `${l.id}` === listingId);
    setListing(selected);
    setIsShowingListingDetails(!!selected);
  }, [listings, listingId]);

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
      <div className={classes.spacingforshowButton}>
        <Button
          variant="contained"
          color="secondary"
          disabled={isLoading}
          onClick={() => setIsShowingDiagram(!isShowingDiagram)}
          endIcon={isShowingDiagram ? <VisibilityOffIcon /> : <VisibilityIcon />}
          id="toggle-ics-relationship-diagram-button"
        >
          { isLoading && <CircularProgress size={20} /> }
          {' '}
          { isShowingDiagram ? 'Hide' : 'Show' }
          {' '}
          ICS Relationships
        </Button>
      </div>
      { isShowingDiagram
        && (
          <Card>
            <CardContent>
              <div className={classes.cardContainer}>
                <div className={classes.directionContainer}>
                  <div>
                    <Typography gutterBottom>
                      Select a listing to the right to view more information. You can also click and drag to scroll through the listings.
                    </Typography>
                    <ChplLink
                      href={compare}
                      text="Compare all listings"
                      external={false}
                    />
                  </div>
                  { isShowingListingDetails
                    && (
                      <div>
                        <Card className={classes.detailContainer}>
                          <CardHeader title="Details" />
                          <CardContent className={classes.detailContainer}>
                            <Typography>
                              <strong>CHPL Product Number:</strong>
                            </Typography>
                            { listing?.id === id
                              ? (
                                <Typography>{ listing?.chplProductNumber }</Typography>
                              ) : (
                                <ChplLink
                                  href={`#/listing/${listing?.id}?panel=additional`}
                                  text={listing?.chplProductNumber}
                                  external={false}
                                  router={{ sref: 'listing', options: { id: listing?.id, panel: 'additional' } }}
                                />
                              )}
                            <Typography>
                              <strong>Developer:</strong>
                              <ChplLink
                                href={`#/organizations/developers/${listing?.developer.id}`}
                                text={listing?.developer.name}
                                external={false}
                                router={{ sref: 'organizations.developers.developer', options: { id: listing?.developer.id } }}
                              />
                            </Typography>
                            <Typography>
                              <strong>Product:</strong>
                            </Typography>
                            <Typography>{ listing?.product.name }</Typography>
                            <Typography>
                              <strong>Version:</strong>
                            </Typography>
                            <Typography>
                              { listing?.version.name }
                            </Typography>
                            <Typography>
                              <strong>Certification Status:</strong>
                            </Typography>
                            <Typography>
                              { listing?.certificationStatus.name }
                            </Typography>
                          </CardContent>
                          <CardActions>
                            <Button
                              endIcon={<CloseIcon />}
                              size="small"
                              variant="contained"
                              color="secondary"
                              onClick={() => setListingId(undefined)}
                            >
                              Close Details
                            </Button>
                          </CardActions>
                        </Card>
                      </div>
                    )}
                </div>
                <div className={classes.figureContainer}>
                  <figure>
                    <CytoscapeComponent
                      elements={elements}
                      style={{ width: '100%', height: '475px' }}
                      minZoom={0.5}
                      maxZoom={0.9}
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
                </div>
              </div>
            </CardContent>
          </Card>
        )}
    </>
  );
}

export default ChplIcsFamily;

ChplIcsFamily.propTypes = {
  id: number.isRequired,
};
