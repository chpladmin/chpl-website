import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import { string } from 'prop-types';

function ChplSwagger(props) {
  const { url } = props;

  return (
    <SwaggerUI
      url={url}
      docExpansion="none"
    />
  );
}

export default ChplSwagger;

ChplSwagger.propTypes = {
  url: string.isRequired,
};
