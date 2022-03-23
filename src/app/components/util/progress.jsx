import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Container,
  Step,
  StepLabel,
  Stepper,
  makeStyles,
} from '@material-ui/core';
import {
  arrayOf,
  bool,
  func,
  number,
  string,
} from 'prop-types';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles({
  buttons: {
    padding: '8px 16px',
    borderRadius: '0 0 32px 32px',
  },
  nextButton: {
    '&.disabled': {
      backgroundColor: '#eee',
      '&:hover, selected': {
        backgroundColor: '#eee',
      },
    },
  },
  backButton: {
    backgroundColor: '#fff',
    '&:hover, selected': {
      backgroundColor: '#eee',
    },
    '&.disabled': {
      backgroundColor: '#eee',
    },
  },
  stepperBar: {
    padding: '8px 32px',
    margin: '0 16px',
  },
  stepperContainer: {
    borderRadius: '64px',
    padding: '8px 0px',
    border: '0.5px solid #c2c6ca',
    boxShadow: 'rgb(149 157 165 / 10%) 0 4px 8px',
    backgroundColor: '#fff',
  },
  stepperButton: {
    borderBottom: '0.5px solid #c2c6ca',
    borderLeft: '0.5px solid #c2c6ca',
    borderRight: '0.5px solid #c2c6ca',
    borderRadius: '0 0 32px 32px',
  },
  stepperButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    position: 'sticky',
    top: '114px',
    zIndex: '999',
  },
});

function ChplProgress(props) {
  const { steps } = props;
  const [value, setValue] = useState(0);
  const [canNext, setCanNext] = useState(false);
  const [canPrevious, setCanPrevious] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    setValue(props.value);
  }, [props.value]); // eslint-disable-line react/destructuring-assignment

  useEffect(() => {
    setCanNext(props.canNext);
  }, [props.canNext]); // eslint-disable-line react/destructuring-assignment

  useEffect(() => {
    setCanPrevious(props.canPrevious);
  }, [props.canPrevious]); // eslint-disable-line react/destructuring-assignment

  return (
    <>
      <Container maxWidth="md" className={classes.stepperContainer}>
        <Stepper
          className={classes.stepperBar}
          activeStep={value}
        >
          { steps.map((step) => (
            <Step key={step}>
              <StepLabel>{ step }</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Container>
      <div className={classes.stepperButtonContainer}>
        <ButtonGroup variant="text" color="primary" className={classes.stepperButton} size="medium">
          <Button
            color="primary"
            variant="text"
            className={`${classes.buttons} ${classes.backButton}`}
            disabled={!canPrevious}
            onClick={() => props.dispatch('previous')}
            id="inspect-previous"
          >
            <NavigateBeforeIcon />
            Back
          </Button>
          <Button
            color="primary"
            variant="contained"
            className={`${classes.buttons} ${classes.nextButton}`}
            disabled={!canNext}
            onClick={() => props.dispatch('next')}
            id="inspect-next"
          >
            Next
            <NavigateNextIcon />
          </Button>
        </ButtonGroup>
      </div>
    </>
  );
}

export default ChplProgress;

ChplProgress.propTypes = {
  steps: arrayOf(string).isRequired,
  dispatch: func.isRequired,
  value: number.isRequired,
  canNext: bool.isRequired,
  canPrevious: bool.isRequired,
};
