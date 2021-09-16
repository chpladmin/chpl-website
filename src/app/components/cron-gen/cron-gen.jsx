import React, { useEffect, useState } from 'react';
import {
  Checkbox,
  FormControlLabel,
  Radio,
  ThemeProvider,
  makeStyles,
} from '@material-ui/core';
import {
  func, string,
} from 'prop-types';
import theme from '../../themes/theme';

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
  const [daySelection, setDaySelection] = React.useState('every');
  const [cron, setCron] = useState('');
  const classes = useStyles();

  const handleDay = (event) => {
    setDaySelection(event.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.content}>
        <div className={classes.output}>
          Cron value:
          {' '}
          <code>{cron}</code>
        </div>
        <div className={classes.everyDay}>
          <FormControlLabel
            label="Every day"
            control={
              <Radio
                checked={daySelection === 'every'}
                onChange={handleDay}
                value="every"
                name="daySelection"
                inputProps={{ 'aria-label': 'every' }}
              />
            } />
        </div>
        <div className={classes.selectDay}>
          <FormControlLabel
            label="Specific Day(s)"
            control={
              <Radio
                checked={daySelection === 'specific'}
                onChange={handleDay}
                value="specific"
                name="daySelection"
                inputProps={{ 'aria-label': 'specific days' }}
              />
            } />
          <FormControlLabel
            label="Sunday"
            control={<Checkbox/>}
          />
          <FormControlLabel
            label="Monday"
            control={<Checkbox/>}
          />
          <FormControlLabel
            label="Tuesday"
            control={<Checkbox/>}
          />
          <FormControlLabel
            label="Wednesday"
            control={<Checkbox/>}
          />
          <FormControlLabel
            label="Thursday"
            control={<Checkbox/>}
          />
          <FormControlLabel
            label="Friday"
            control={<Checkbox/>}
          />
          <FormControlLabel
            label="Saturday"
            control={<Checkbox/>}
          />
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
    </ThemeProvider>
  );
}

export default ChplCronGen;

ChplCronGen.propTypes = {
  value: string,
};

ChplCronGen.defaultProps = {
  value: '',
};
