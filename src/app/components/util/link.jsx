import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {string} from 'prop-types';
import {analyticsConfig} from '../../shared/prop-types';

const prependLink = (url) => {
  if (url.substring(0,7) === 'http://' || url.substring(0,8) === 'https://') {
    return url;
  } else {
    return 'http://' + url;
  }
}

function ChplLink (props) {
  const [href] = useState(prependLink(props.href));

  return (
    <>
      <a href={href}>
        {props.text}
      </a>
      <a href="http://www.hhs.gov/disclaimer.html" title="Web Site Disclaimers" className="pull-right">
        <i className="fa fa-external-link"></i>
        <span className="sr-only">Web Site Disclaimers</span>
      </a>
    </>
  );
}

export {ChplLink};

ChplLink.propTypes = {
  text: string,
  href: string,
  analytics: analyticsConfig,
};
