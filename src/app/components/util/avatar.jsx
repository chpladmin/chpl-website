import React, { useEffect, useState } from 'react';
import {
  Avatar,
  makeStyles,
} from '@material-ui/core';
import { string } from 'prop-types';

const colors = ['color_bdc3c7', 'color_6f7b87', 'color_2c3e50', 'color_2f3193', 'color_662d91', 'color_922790', 'color_ec2176', 'color_ed1c24', 'color_f36622', 'color_f8941e', 'color_fab70f', 'color_fdde00', 'color_d1d219', 'color_8ec73f', 'color_00a650', 'color_00aa9c', 'color_00adef', 'color_0081cd', 'color_005bab'];

const useStyles = makeStyles((theme) => ({
  color_bdc3c7: { backgroundColor: '#bdc3c7', color: theme.palette.getContrastText('#bdc3c7') },
  color_6f7b87: { backgroundColor: '#6f7b87', color: theme.palette.getContrastText('#6f7b87') },
  color_2c3e50: { backgroundColor: '#2c3e50', color: theme.palette.getContrastText('#2c3e50') },
  color_2f3193: { backgroundColor: '#2f3193', color: theme.palette.getContrastText('#2f3193') },
  color_662d91: { backgroundColor: '#662d91', color: theme.palette.getContrastText('#662d91') },
  color_922790: { backgroundColor: '#922790', color: theme.palette.getContrastText('#922790') },
  color_ec2176: { backgroundColor: '#ec2176', color: theme.palette.getContrastText('#ec2176') },
  color_ed1c24: { backgroundColor: '#ed1c24', color: theme.palette.getContrastText('#ed1c24') },
  color_f36622: { backgroundColor: '#f36622', color: theme.palette.getContrastText('#f36622') },
  color_f8941e: { backgroundColor: '#f8941e', color: theme.palette.getContrastText('#f8941e') },
  color_fab70f: { backgroundColor: '#fab70f', color: theme.palette.getContrastText('#fab70f') },
  color_fdde00: { backgroundColor: '#fdde00', color: theme.palette.getContrastText('#fdde00') },
  color_d1d219: { backgroundColor: '#d1d219', color: theme.palette.getContrastText('#d1d219') },
  color_8ec73f: { backgroundColor: '#8ec73f', color: theme.palette.getContrastText('#8ec73f') },
  color_00a650: { backgroundColor: '#00a650', color: theme.palette.getContrastText('#00a650') },
  color_00aa9c: { backgroundColor: '#00aa9c', color: theme.palette.getContrastText('#00aa9c') },
  color_00adef: { backgroundColor: '#00adef', color: theme.palette.getContrastText('#00adef') },
  color_0081cd: { backgroundColor: '#0081cd', color: theme.palette.getContrastText('#0081cd') },
  color_005bab: { backgroundColor: '#005bab', color: theme.palette.getContrastText('#005bab') },
}));

const getColor = (str) => colors[str.split('').reduce((acc, cur) => acc + cur.charCodeAt(0), 0) % colors.length];

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
      className={classes[getColor(text)]}
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
