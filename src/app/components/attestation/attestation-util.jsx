import React from 'react';

const getElement = (matches) => (
  <>
    {matches[1]}
    <a href={matches[3]}>
      {matches[2]}
    </a>
    {matches[4]}
  </>
);

const interpretLink = (description) => {
  const regex = /^(.*)\[(.*)\]\((.*)\)(.*)$/;
  const matches = description.match(regex);
  return getElement(matches);
};

export default interpretLink;
