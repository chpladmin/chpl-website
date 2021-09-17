import React from 'react';
import clsx from 'clsx';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';

import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import theme from '../../../../app/themes/theme';

const useStyles = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    cmsWidget: {
        zIndex: 1299,
        position: 'fixed',
        bottom: '16vh',
        right: '0',
        marginRight: '-4px',
        borderRadius: '4px 0px 0px 4px',
        boxShadow: '0px 4px 8px rgb(149 157 165 / 30%)',
        backgroundColor: '#eeeeee',
        "&:hover, &.Mui-focusVisible": {
            backgroundColor: '#fff',
            boxShadow: '0px 4px 8px rgb(149 157 165 / 30%)',
        },
    },
    iconSpacing: {
        marginLeft: '4px',
    },
});

export default function SgCmsWidget() {
    const classes = useStyles();
    const [state, setState] = React.useState({
        right: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <div
            className={clsx(classes.list, {
                [classes.fullList]: anchor === 'right' || anchor === 'right',
            })}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                Something Will Go Here
            </List>
        </div>
    );

    return (
        <div>
            {['cms Widget'].map((anchor) => (
                <React.Fragment key={anchor}>
                    <ThemeProvider theme={theme}>
                        <Button color="default" variant="outlined" className={classes.cmsWidget} onClick={toggleDrawer(anchor, true)}>{anchor} <PlaylistAddCheckIcon className={classes.iconSpacing}/> </Button>
                        <Drawer anchor={'right'} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
                            {list(anchor)}
                        </Drawer>
                    </ThemeProvider>
                </React.Fragment>
            ))}
        </div>
    );
}