import React, { useEffect, useState } from 'react';
import {
  Avatar,
  makeStyles,
} from '@material-ui/core';
import { string } from 'prop-types';

const useStyles = makeStyles({
});

function ChplAvatar(props) {
  const [text, setText] = useState('');
  const [initials, setInitials] = useState('');
  const classes = useStyles();

  useEffect(() => {
    const display = props.text.split(' ').map((c) => c.substring(0, 1).toUpperCase()).join('');
    setText(props.text);
    setInitials(display);
  }, [props.text]); // eslint-disable-line react/destructuring-assignment

  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <Avatar
      alt={text}
      {...props}
    >
      {initials}
    </Avatar>
  );
  /* eslint-enable react/jsx-props-no-spreading */
}

export default ChplAvatar;

ChplAvatar.propTypes = {
  text: string.isRequired,
};
