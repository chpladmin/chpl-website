import React from 'react';

import ChplQuestionableActivityPage from './questionable-activity';

import AppWrapper from 'app-wrapper';

function ChplQuestionableActivityWrapper() {
  return (
    <AppWrapper>
      <ChplQuestionableActivityPage />
    </AppWrapper>
  );
}

export default ChplQuestionableActivityWrapper;

ChplQuestionableActivityWrapper.propTypes = {
};
