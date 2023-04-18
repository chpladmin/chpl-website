import React from 'react';
import {
    Box,
    ButtonBase,
    makeStyles,
    IconButton,
    Typography,
    Container,
    Card,
    CardContent,
    Link,
} from '@material-ui/core';
import CodeIcon from '@material-ui/icons/Code';
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import ImageIcon from '@material-ui/icons/Image';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';
import BlockIcon from '@material-ui/icons/Block';
import DescriptionIcon from '@material-ui/icons/Description';
import StopIcon from '@material-ui/icons/Stop';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import GavelIcon from '@material-ui/icons/Gavel';
import CancelIcon from '@material-ui/icons/Cancel';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import SgSearchBar from './sg-search-bar';

import Image from '../../../../assets/images/Chpl_Logo-01.png';


import { theme, utilStyles } from 'themes';
const useStyles = makeStyles(() => ({
    landingPageBackground: {
        backgroundPosition: '48vw 40vh',
        backgroundRepeat: 'no-repeat',
        background: 'rgba(2,23,60,1)' + `url(${Image})`,
        backgroundBlendMode: 'soft-light',
    },
    helpCards: {
        width: '100%',

    },
    helpCardsContainer: {
        display: 'flex',
        flexDirection: 'row',
        gridGap: '16px',
    },
    subHeaders: {
        color: '#fff',
    },
    collectionsCard: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '100%',
        },
        [theme.breakpoints.up('md')]: {
            width: '48%',
        },
        [theme.breakpoints.up('lg')]: {
            width: '25%',
        },
    },
    collectionsCardContainer: {
        display: "flex",
        flexDirection: "column",
        gridGap: "16px",
        flexWrap: 'nowrap',
        [theme.breakpoints.up('sm')]: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        [theme.breakpoints.up('md')]: {
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            padding: 'none',
        },
        [theme.breakpoints.up('lg')]: {
            flexWrap: 'nowrap',
            padding: 'none',
        },
    },
}));


function LandingPage() {
    const classes = useStyles();

    return (
        <>
            <Box pt={16} pb={24}>
                <Container maxWidth="md">
                    <Typography align="center" variant="h1" gutterBottom>Welcome to the Certified Health IT Product List (CHPL)</Typography>
                    <Typography align="center" variant="body1">The Certified Health IT Product List (CHPL) is a comprehensive and authoritative listing of all certified health information technology that have been successfully tested and certified by the ONC Health IT Certification program.</Typography>
                </Container>
            </Box>
            <Box className={classes.landingPageBackground} pb={16} height="fit-content">
                <Box className={classes.landingPageImageryBackground}>
                    <Container maxWidth="md">
                        <Box mt={-8}>
                            {/*Placeholder for search bar */}
                            <SgSearchBar />
                        </Box>
                        <Box pt={8} pb={4}>
                            <Typography className={classes.subHeaders} align="left" variant="h2" gutterBottom>Use on of our collections page to help find a particular category of listings</Typography>
                        </Box>
                        <Box display="flex" flexDirection="column" gridGap={16}>
                            <Box className={classes.collectionsCardContainer}>
                                <Box className={classes.collectionsCard}>
                                    <Card raised="true">
                                        <CardContent>
                                            <Box display="flex" flexDirection="row" gridGap={8}>
                                                <CodeIcon color="primary" />
                                                <Box mt={-1}>
                                                    <Typography>
                                                        <Link href="/#/collections/sed">
                                                            API info for 2015 products
                                                        </Link>
                                                    </Typography>
                                                    <Typography variant="body2">This list includes all 2015 Edition, including Cures update, health it products that have been certified to at least one API Criteria </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                                <Box className={classes.collectionsCard}>
                                    <Card>
                                        <CardContent>
                                            <Box display="flex" flexDirection="row" gridGap={8}>
                                                <VerifiedUserIcon color="primary" />
                                                <Box mt={-1}>
                                                    <Typography>
                                                        <Link href="/#/collections/api-documentation">
                                                            SED info for 2015 products
                                                        </Link>
                                                    </Typography><Typography variant="body2">This list includes all 2015 Edition, including Cures Update, health IT products that have been certified with Safety Enhanced Design (SED). </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                                <Box className={classes.collectionsCard}>
                                    <Card>
                                        <CardContent>
                                            <Box display="flex" flexDirection="row" gridGap={8}>
                                                <StopIcon color="primary" />
                                                <Box mt={-1}>
                                                    <Typography >
                                                        <Link href="/#/collections/inactive">
                                                            Inactive Certificates
                                                        </Link>
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        This list includes all health IT products that have had their status changed to an "inactive" status on the Certified Health IT Products List (CHPL).
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                                <Box className={classes.collectionsCard}>
                                    <Card>
                                        <CardContent>
                                            <Box display="flex" flexDirection="row" gridGap={8}>
                                                <BlockIcon color="primary" />
                                                <Box mt={-1}>
                                                    <Typography>
                                                        <Link href="/#/collections/developers">
                                                            Banned Developers
                                                        </Link>
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        This is a list of health IT developers currently precluded from certifying any health IT products under the ONC Health IT Certification Program.
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                            </Box>
                            <Box className={classes.collectionsCardContainer}>
                                <Box className={classes.collectionsCard}>
                                    <Card>
                                        <CardContent>
                                            <Box display="flex" flexDirection="row" gridGap={8}>
                                                <GavelIcon color="primary" />
                                                <Box mt={-1}>
                                                    <Typography>
                                                        <Link href="/#/collections/api-documentation">
                                                            Real World Testing
                                                        </Link>
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        This list includes Health IT Module(s) eligible for Real World Testing, which is an annual Condition and Maintenance of Certification requirement.
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                                <Box className={classes.collectionsCard}>
                                    <Card>
                                        <CardContent>
                                            <Box display="flex" flexDirection="row" gridGap={8}>
                                                <ImageIcon color="primary" />
                                                <Box mt={-1}>
                                                    <Typography>
                                                        <Link href="/#/collections/charts">
                                                            Charts
                                                        </Link>
                                                    </Typography><Typography variant="body2">This list includes all 2015 Edition, including Cures update, health it products that have been certified to at least one API Criteria </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                                <Box className={classes.collectionsCard}>
                                    <Card>
                                        <CardContent>
                                            <Box display="flex" flexDirection="row" gridGap={8}>
                                                <ErrorOutlineOutlinedIcon color="primary" />
                                                <Box mt={-1}>
                                                    <Typography>
                                                        <Link href="/#/collections/corrective-action">
                                                            Products Corrective Actions
                                                        </Link>
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        This is a list of all health IT products for which a non-conformity has been recorded.
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                                <Box className={classes.collectionsCard}>
                                    <Card>
                                        <CardContent>
                                            <Box display="flex" flexDirection="row" gridGap={8}>
                                                <CancelIcon color="primary" />
                                                <Box mt={-1}>
                                                    <Typography>
                                                        <Link href="/#/collections/products">
                                                            Decertified Products
                                                        </Link>
                                                    </Typography>
                                                    <Typography variant="body2">This list includes all 2015 Edition, including Cures update, health it products that have been certified to at least one API Criteria </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                            </Box>
                            <Box pt={4} pb={4}>
                            <Typography className={classes.subHeaders} align="left" variant="h3" >Need Help? Learn more about CHPL through our documentation.</Typography>
                            </Box>
                            <Box className={classes.helpCardsContainer}>
                                <Box width="33.3vw" display="flex" flexDirection="row" >
                                    <Card className={classes.helpCards}>
                                        <CardContent>
                                            <Box p={4} display="flex" justifyContent="center" flexDirection="column" alignItems="center" gridGap={8}>
                                                <DescriptionIcon fontSize="large" color="primary" />
                                                <Box>
                                                    <Typography align="center">
                                                        <Link href="/#/resources/overview">
                                                            An Overview of Chpl
                                                        </Link>
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                                <Box width="33.3vw" display="flex" flexDirection="row" >
                                    <Card className={classes.helpCards}>
                                        <CardContent>
                                            <Box p={4} display="flex" justifyContent="center" flexDirection="column" alignItems="center" gridGap={8}>
                                                <AnnouncementIcon fontSize="large" color="primary" />
                                                <Box>
                                                    <Typography align="center" >
                                                        <Link href="/#/">
                                                            Announcement & Updates
                                                        </Link>
                                                    </Typography>                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                                <Box width="33.3vw" display="flex" flexDirection="row" >
                                    <Card className={classes.helpCards}>
                                        <CardContent>
                                            <Box p={4} display="flex" justifyContent="center" flexDirection="column" alignItems="center" gridGap={8}>
                                                <MenuBookIcon fontSize="large" color="primary" />
                                                <Box>
                                                    <Typography align="center">
                                                        <Link href="https://www.healthit.gov/sites/default/files/policy/chpl_public_user_guide.pdf">
                                                            Training Guide
                                                        </Link>
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                            </Box>
                        </Box>
                    </Container>
                </Box>
            </Box>
        </>
    );
}


export default LandingPage;