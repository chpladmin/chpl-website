import React, { useState } from 'react';
import { bool, number, string } from 'prop-types';
import {
  IconButton,
  makeStyles,
} from '@material-ui/core';
import ChplTooltip from './chpl-tooltip';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

const useStyles = makeStyles({
chplEllipsis:{
  border: 'none',
  backgroundColor:'transparent',
  color: '#156dac',
  '&:hover': {
    color: '#00437c',
  },
},
});
function ChplEllipsis(props) {
  const [isShortened, setShortened] = useState(true);
  const { text } = props;
  const { wordBoundaries } = props;
  const { maxLength } = props;
  const classes = useStyles();

  if (!text) {
    return null;
  }

  if (text.length <= maxLength) {
    return <span>{text}</span>;
  }

  let display = text.substr(0, maxLength).trim();
  if (wordBoundaries) {
    const parts = display.split(' ');
    if (parts.length > 1) {
      parts.splice(parts.length - 1, 1);
    }
    display = parts.join(' ');
  }

  return (
    <>
      {isShortened ? display : text}
      {display !== text && isShortened
       && (
         <ChplTooltip title={text}>
           <IconButton size="small" className={classes.chplEllipsis}  onClick={() => setShortened(false)}>
             <MoreHorizIcon />
             <span className="sr-only">Expand description</span>
           </IconButton>
         </ChplTooltip>
       )}
      {display !== text && !isShortened
       && (
         <IconButton size="small" className={classes.chplEllipsis} onClick={() => setShortened(true)}>
           <ArrowBackIcon/>
           <span className="sr-only">Minimize description</span>
         </IconButton>
       )}
    </>
  );
}

export default ChplEllipsis;

ChplEllipsis.propTypes = {
  text: string.isRequired,
  maxLength: number,
  wordBoundaries: bool,
};

ChplEllipsis.defaultProps = {
  maxLength: 80,
  wordBoundaries: false,
};
