import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Step,
  StepLabel,
  Stepper,
  ThemeProvider,
  makeStyles,
} from '@material-ui/core';
import { bool, func, number } from 'prop-types';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import theme from 'themes/theme';

const useStyles = makeStyles({
  stepperBar: {
    padding: '8px 32px',
  },
  stepperContainer: {
    borderRadius: '64px',
    padding: '8px 16px',
    margin: '0 32px',
    border: '0.5px solid #c2c6ca',
    boxShadow: 'rgb(149 157 165 / 10%) 0 4px 8px',
    backgroundColor: '#fff',
  },
  stepperButton: {
    backgroundColor: '#fff',
    borderBottom: '0.5px solid #c2c6ca',
    borderLeft: '0.5px solid #c2c6ca',
    borderRight: '0.5px solid #c2c6ca',
    borderRadius: '0 0 32px 32px',
    padding: '0 16px 8px 16px',
  },
  stepperButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
});

function ChplAttestationProgress(props) {
  const [value, setValue] = useState(0);
  const {
    canPrevious,
    canNext,
  } = props;

  const classes = useStyles();

  useEffect(() => {
    setValue(props.value);
  }, [props.value]); // eslint-disable-line react/destructuring-assignment

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.stepperContainer}>
        <Stepper
          className={classes.stepperBar}
          activeStep={value}
        >
          <Step>
            <StepLabel>Introduction</StepLabel>
          </Step>
          <Step>
            <StepLabel>Attestations</StepLabel>
          </Step>
          <Step>
            <StepLabel>Electronic Signature</StepLabel>
          </Step>
          <Step>
            <StepLabel>Confirmation</StepLabel>
          </Step>
        </Stepper>
      </div>
      <div className={classes.stepperButtonContainer}>
        <ButtonGroup variant="text" color="primary" className={classes.stepperButton} size="medium">
          <Button
            disabled={!canPrevious}
            onClick={() => props.dispatch('previous')}
            id="inspect-previous"
          >
            <NavigateBeforeIcon />
            Back
          </Button>
          <Button
            disabled={!canNext}
            onClick={() => props.dispatch('next')}
            id="inspect-next"
          >
            Next
            <NavigateNextIcon />
          </Button>
        </ButtonGroup>
      </div>
    </ThemeProvider>
  );
}

export default ChplAttestationProgress;

ChplAttestationProgress.propTypes = {
  dispatch: func.isRequired,
  value: number.isRequired,
  canNext: bool.isRequired,
  canPrevious: bool.isRequired,
};
