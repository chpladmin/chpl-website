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

const interpretLink = (question) => {
  const regex = /^(.*)\[(.*)\]\((.*)\)(.*)$/;
  const matches = question.question.match(regex);
  return {
    ...question,
    display: getElement(matches),
  };
};

export default interpretLink;
