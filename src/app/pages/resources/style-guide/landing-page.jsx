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

import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import Image from '../../../../assets/images/Chpl_Logo-01.png';
import SgSearchBar from './sg-search-bar';
import {
    ChplFilterChips,
    ChplFilterPanel,
    ChplFilterSearchTerm,
    useFilterContext,
} from 'components/filter';
const useStyles = makeStyles(() => ({
    landingPageBackground: {
        backgroundPosition: 'right',
        backgroundRepeat: 'no-repeat',
        background: 'rgba(2,23,60,1)',
    },
    helpCards: {
        width: '100%',
    },
    subHeaders: {
        color: '#fff',
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
                            <Box display="flex" flexDirection="row" gridGap={16}>
                                <Box display="flex" flexDirection="row" width="25vw">
                                    <Card>
                                        <CardContent>
                                            <Box display="flex" flexDirection="row" gridGap={8}>
                                                <ArrowForwardOutlinedIcon color="primary" />
                                                <Box mt={-1}>
                                                    <Typography>
                                                        <Link href="/#/collections/api-documentation">
                                                            API INFO FOR 2015 products
                                                        </Link>
                                                    </Typography>
                                                    <Typography variant="body2">This list includes all 2015 Edition, including Cures update, health it products that have been certified to at least one API Criteria </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                                <Box display="flex" flexDirection="row" width="25vw">
                                    <Card>
                                        <CardContent>
                                            <Box display="flex" flexDirection="row" gridGap={8}>
                                                <ArrowForwardOutlinedIcon color="primary" />
                                                <Box mt={-1}>
                                                    <Typography>
                                                        <Link href="/#/collections/api-documentation">
                                                            SED INFO FOR 2015 products
                                                        </Link>
                                                    </Typography><Typography variant="body2">This list includes all 2015 Edition, including Cures Update, health IT products that have been certified with Safety Enhanced Design (SED). </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                                <Box display="flex" flexDirection="row" width="25vw">
                                    <Card>
                                        <CardContent>
                                            <Box display="flex" flexDirection="row" gridGap={8}>
                                                <ArrowForwardOutlinedIcon color="primary" />
                                                <Box mt={-1}>
                                                    <Typography variant="subtitle1">
                                                        <Link href="/#/collections/api-documentation">
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
                                <Box display="flex" flexDirection="row" width="25vw">
                                    <Card>
                                        <CardContent>
                                            <Box display="flex" flexDirection="row" gridGap={8}>
                                                <ArrowForwardOutlinedIcon color="primary" />
                                                <Box mt={-1}>
                                                    <Typography>
                                                        <Link href="/#/collections/api-documentation">
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
                            <Box display="flex" flexDirection="row" gridGap={16}>
                                <Box display="flex" flexDirection="row" width="25vw">
                                    <Card>
                                        <CardContent>
                                            <Box display="flex" flexDirection="row" gridGap={8}>
                                                <ArrowForwardOutlinedIcon color="primary" />
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
                                <Box display="flex" flexDirection="row" width="25vw">
                                    <Card>
                                        <CardContent>
                                            <Box display="flex" flexDirection="row" gridGap={8}>
                                                <ArrowForwardOutlinedIcon color="primary" />
                                                <Box mt={-1}>
                                                    <Typography>
                                                        <Link href="/#/collections/api-documentation">
                                                            Charts
                                                        </Link>
                                                    </Typography><Typography variant="body2">This list includes all 2015 Edition, including Cures update, health it products that have been certified to at least one API Criteria </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                                <Box display="flex" flexDirection="row" width="25vw">
                                    <Card>
                                        <CardContent>
                                            <Box display="flex" flexDirection="row" gridGap={8}>
                                                <ArrowForwardOutlinedIcon color="primary" />
                                                <Box mt={-1}>
                                                    <Typography>
                                                        <Link href="/#/collections/api-documentation">
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
                                <Box display="flex" flexDirection="row" width="25vw">
                                    <Card>
                                        <CardContent>
                                            <Box display="flex" flexDirection="row" gridGap={8}>
                                                <ArrowForwardOutlinedIcon color="primary" />
                                                <Box mt={-1}>
                                                    <Typography>
                                                        <Link href="/#/collections/api-documentation">
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
                            <Typography pt={8} pb={8} className={classes.subHeaders} align="left" variant="h3" gutterBottom>Need Help? Learn more about CHPL through our documentation.</Typography>
                            <Box display="flex" flexDirection="row" justifyContent="space-between" gridGap={16}>
                                <Box width="33.3vw" display="flex" flexDirection="row" >
                                    <Card className={classes.helpCards}>
                                        <CardContent>
                                            <Box p={4} display="flex" justifyContent="center" flexDirection="column" alignItems="center" gridGap={8}>
                                                <ArrowForwardOutlinedIcon color="primary" />
                                                <Box>
                                                    <Typography align="center" variant='subtitle1'>
                                                        <Link href="/#/collections/api-documentation">
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
                                                <ArrowForwardOutlinedIcon color="primary" />
                                                <Box>
                                                    <Typography align="center" variant='subtitle1'>
                                                        <Link href="/#/collections/api-documentation">
                                                            Annoucement & Updates
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
                                                <ArrowForwardOutlinedIcon color="primary" />
                                                <Box>
                                                    <Typography align="center" variant='subtitle1'>
                                                        <Link href="/#/collections/api-documentation">
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