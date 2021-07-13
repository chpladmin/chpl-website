import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { string } from 'prop-types';

function ChplSwagger(props) {
  const [apiKey] = props.apiKey;

  const interceptor = (req) => {
    req.url = req.url.replace('chpl-service', 'rest');
    req.headers['Api-Key'] = apiKey;
    console.log(req);
    return req;
  }

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
