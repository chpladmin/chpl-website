import React, { useState, useEffect } from 'react'
import {
    Button,
    makeStyles,
    ThemeProvider,
    Fade,
} from '@material-ui/core';

import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import theme from '../../../../app/themes/theme';

const useStyles = makeStyles({
    iconSpacing: {
        marginLeft: '4px',
    },
    backToTop: {
        zIndex: 1500,
        position: 'fixed',
        bottom: '10vh',
        right: '0',
        marginRight: '-4px',
        borderRadius: '4px 0px 0px 4px',
        boxShadow: '0px 4px 8px rgb(149 157 165 / 30%)',
        backgroundColor:'#eeeeee',
        "&:hover, &.Mui-focusVisible": {
            backgroundColor: '#fff',
            boxShadow: '0px 4px 8px rgb(149 157 165 / 30%)',
        },
    },
});

const SgBackToTop = ({
    showBelow = 256
}) => {

    const classes = useStyles();

    const [show, setShow] = useState(showBelow ? false : true)

    const handleSgBackToTop = () => {
        if (window.pageYOffset > showBelow) {
            if (!show) setShow(true)
        } else {
            if (show) setShow(false)
        }
    }

    const handleClick = () => {
        window[`scrollTo`]({ top: 0, behavior: `smooth` })
    }

    useEffect(() => {
        if (showBelow) {
            window.addEventListener(`scroll`, handleSgBackToTop)
            return () => window.removeEventListener(`scroll`, handleSgBackToTop)
        }
    })

    return (
        <div>
            <ThemeProvider theme={theme}>
                {show &&
                <Fade in timeout={400}>
                    <Button color="default" variant="outlined" onClick={handleClick} className={classes.backToTop} aria-label="to top">
                        Back To Top <ArrowUpwardIcon className={classes.iconSpacing} />
                    </Button>
                </Fade>
                }
            </ThemeProvider>
        </div>
    )
}
export default SgBackToTop