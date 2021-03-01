import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Tooltip} from '@material-ui/core';
import {bool, number, string} from 'prop-types';

const useStylesBootstrap = makeStyles((theme) => ({
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
    textAlign: 'center',
    fontSize: '12px',
  },
}));

function BootstrapTooltip (props) {
  const classes = useStylesBootstrap();

  return <Tooltip arrow placement="top" classes={classes} {...props} />;
}

function ChplEllipsis (props) {
  const [isShortened, setShortened] = useState(true);

  if (props.text.length <= props.maxLength) {
    return <span>{props.text}</span>;
  }

  let display = props.text.substr(0, props.maxLength).trim();
  if (props.wordBoundaries) {
    let parts = display.split(' ');
    if (parts.length > 1) {
      parts.splice(parts.length - 1, 1);
    }
    display = parts.join(' ');
  }

  return (
    <span>
      {isShortened ? display : props.text}
      {display !== props.text && isShortened &&
       <BootstrapTooltip title={props.text}>
         <button className="btn btn-link btn-xs" onClick={() => setShortened(false)}>
           <i className="fa fa-ellipsis-h"></i><span className="sr-only">Expand description</span>
         </button>
       </BootstrapTooltip>
      }
      {display !== props.text && !isShortened &&
       <button className="btn btn-link btn-xs" onClick={() => setShortened(true)}>
         <i className="fa fa-arrow-left"></i><span className="sr-only">Minimize description</span>
       </button>
      }
    </span>
  );
}

export {ChplEllipsis};

ChplEllipsis.propTypes = {
  text: string,
  maxLength: number,
  wordBoundaries: bool,
};
