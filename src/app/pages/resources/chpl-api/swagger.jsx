import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { string } from 'prop-types';

function ChplSwagger(props) {
  /* eslint-disable react/destructuring-assignment */
  const [apiKey] = props.apiKey;
  /* eslint-enable react/destructuring-assignment */

  const interceptor = (req) => {
    req.url = req.url.replace('chpl-service', 'rest');
    req.headers['Api-Key'] = apiKey;
    console.log(req);
    return req;
  };

  return (
    <SwaggerUI
      url="http://localhost:3000/rest/v3/api-docs"
      docExpansion="none"
      requestInterceptor={interceptor}
    />
  );
}

export default ChplSwagger;

ChplSwagger.propTypes = {
  apiKey: string.isRequired,
};
