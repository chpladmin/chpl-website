import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  CircularProgress,
  FormControlLabel,
  List,
  ListSubheader,
  Popover,
  Switch,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { number } from 'prop-types';
import CytoscapeComponent from 'react-cytoscapejs';

import { useFetchIcsFamilyData } from 'api/listing';

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
  const [isShowingDetails, setIsShowingDetails] = useState(false);
  const [isShowingDiagram, setIsShowingDiagram] = useState(false);

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
        //width: 'label' ,
        //height: 'label',
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

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    setElements(generateElements(data, id));
  }, [data, isLoading, isSuccess]);

  if (!isLoading && !isSuccess) {
    return (
      <Typography>Error</Typography>
    );
  }

  return (
    <>
      <Button
        disabled={isLoading}
        onClick={() => setIsShowingDiagram(!isShowingDiagram)}>
        { isShowingDiagram ? 'Hide' : 'Show' }
        {' '}
        ICS Relationships
      </Button>
      {isShowingDiagram &&
       (
         <>
           <CytoscapeComponent
             elements={elements}
             style={ { width: '600px', height: '600px' } }
             minZoom={0.3}
             maxZoom={3}
             autoungrabify={true}
             layout={layout}
             stylesheet={stylesheet}
           />
           <Button
             onClick={() => setIsShowingDetails(!isShowingDetails)}>
             { isShowingDetails ? 'Hide' : 'Show' }
             {' '}
             Details
           </Button>
         </>
       )}
      {isShowingDetails && 'Details - TBD'}
    </>
  );
}

export default ChplIcsFamily;

ChplIcsFamily.propTypes = {
  id: number.isRequired,
};
