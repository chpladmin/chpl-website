import React, { useEffect, useState } from 'react';
import {
  makeStyles,
} from '@material-ui/core';
import {
  func, string,
} from 'prop-types';

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr 1fr',
  },
  output: {
    gridColumn: '1 / -1',
    gridRow: '1 / 2',
  },
  everyDay: {
    gridColumn: '1 / 2',
    gridRow: '2 / 3',
  },
  selectDay: {
    gridColumn: '1 / 2',
    gridRow: '3 / 4',
  },
  time: {
    gridColumn: '2 / 3',
    gridRow: '2 / 4',
  },
});

function ChplCronGen(props) {
  const [cron, setCron] = useState('');
  const classes = useStyles();

  return (
    <div className={classes.content}>
      <div className={classes.output}>
        Cron value:
        {' '}
        <code>{cron}</code>
      </div>
      <div className={classes.everyDay}>
        <label><input type="radio" name="dayOfWeek" value="every" />Every day</label>
      </div>
      <div className={classes.selectDay}>
        <label><input type="radio" name="dayOfWeek" value="specific" />Specific day(s)</label>
        <label><input type="checkbox" value="Sun" />Sunday</label>
        <label><input type="checkbox" value="Mon" />Monday</label>
        <label><input type="checkbox" value="Tue" />Tuesday</label>
        <label><input type="checkbox" value="Wed" />Wednesday</label>
        <label><input type="checkbox" value="Thu" />Thursday</label>
        <label><input type="checkbox" value="Fri" />Friday</label>
        <label><input type="checkbox" value="Sat" />Saturday</label>
      </div>
      <div className={classes.time}>
        At:
        <label>Hour:
          <input type="number" min="1" max="12" />
        </label>
        <label>Minute:
          <input type="number" min="0" max="59" />
        </label>
        <select>
          <option>AM</option>
          <option>PM</option>
        </select>
      </div>
    </div>
  );
}

export default ChplCronGen;

ChplCronGen.propTypes = {
  value: string,
};

ChplCronGen.defaultProps = {
  value: '',
};
