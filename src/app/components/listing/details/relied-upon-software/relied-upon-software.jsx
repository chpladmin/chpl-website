import React, {useState} from 'react';
import {arrayOf, object} from 'prop-types';

function ChplReliedUponSoftware (props) {

  return (
    <>
      { props.sw.map((sw) => {
        return sw.id + '-' + sw.name + '-' + sw.version + '-' + sw.chplProductNumber
      })}
    </>
  );
}

export { ChplReliedUponSoftware };

ChplReliedUponSoftware.propTypes = {
  sw: arrayOf(object),
};
