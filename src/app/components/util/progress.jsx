import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Step,
  StepLabel,
  Stepper,
} from '@mui/material';
import {
  arrayOf,
  bool,
  func,
  number,
  oneOfType,
  string,
} from 'prop-types';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const styles = {
  buttons: {
    padding: '8px 16px',
    borderRadius: '0 0 32px 32px',
  },
  nextButton: {
    '&.Mui-disabled': {
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
    '&.Mui-disabled': {
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
    top: '0px',
    zIndex: '999',
  },
};

function ChplProgress(props) {
  const { steps, buttonContainerTop = '2px', buttonContainerMarginTop = 0 } = props;
  const [value, setValue] = useState(0);
  const [canNext, setCanNext] = useState(false);
  const [canPrevious, setCanPrevious] = useState(false);

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
      <Container maxWidth="md" sx={styles.stepperContainer}>
        <Stepper
          sx={styles.stepperBar}
          activeStep={value}
        >
          { steps.map((step) => (
            <Step key={step}>
              <StepLabel>{ step }</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Container>
      <Box sx={{ ...styles.stepperButtonContainer, top: buttonContainerTop, marginTop: buttonContainerMarginTop }}>
        <ButtonGroup variant="text" color="primary" sx={styles.stepperButton} size="medium">
          <Button
            color="primary"
            variant="text"
            sx={[styles.buttons, styles.backButton]}
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
            sx={[styles.buttons, styles.nextButton]}
            disabled={!canNext}
            onClick={() => props.dispatch('next')}
            id="inspect-next"
          >
            Next
            <NavigateNextIcon />
          </Button>
        </ButtonGroup>
      </Box>
    </>
  );
}

export default ChplProgress;

ChplProgress.propTypes = {
  buttonContainerTop: string,
  buttonContainerMarginTop: oneOfType([number, string]),
  steps: arrayOf(string).isRequired,
  dispatch: func.isRequired,
  value: number.isRequired,
  canNext: bool.isRequired,
  canPrevious: bool.isRequired,
};
