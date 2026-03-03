import React from 'react';

const getEmphaticElement = (matches) => (
  <>
    {matches[1]}
    <strong>
      {matches[2]}
    </strong>
    {matches[3]}
  </>
);

const interpretEmphatic = (description) => {
  const regex = /^(.*)\*\*(.*)\*\*(.*)$/;
  const matches = description.match(regex);
  return getEmphaticElement(matches);
};

const getLinkElement = (matches) => (
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
  return getLinkElement(matches);
};

export { interpretEmphatic, interpretLink };
