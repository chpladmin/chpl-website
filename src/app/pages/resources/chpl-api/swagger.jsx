import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

function ChplSwagger() {
  return (
    <SwaggerUI url="http://localhost:3000/rest/v3/api-docs" />
  );
}

export default ChplSwagger;

ChplSwagger.propTypes = {
};
