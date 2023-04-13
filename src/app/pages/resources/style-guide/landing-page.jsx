import React from 'react';
import {
    Box,
    makeStyles,
    IconButton,
    Typography,
    Container,
    Card,
    CardContent,
} from '@material-ui/core';

import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import Image from '../../../../assets/images/Chpl_Logo-01.png';

const useStyles = makeStyles(() => ({
    landingPageBackground: {
        background: 'linear-gradient(to top,  rgba(18,41,83,1) 95vh, ' +
            'rgba(255,255,255,1) 5vh)',
    },
    landingPageImageryBackground: {
        backgroundImage: `url(${Image})`,
        backgroundPosition: 'right',
        backgroundRepeat: 'no-repeat',
    },
    subHeaders: {
        color: '#fff',
    },
}));


function LandingPage() {
    const classes = useStyles();

    return (
        <>
            <Box pt={16} pb={16}>
                <Container maxWidth="md">
                    <Typography align="center" variant="h1" gutterBottom>Welcome to the Certified Health IT Product List (CHPL)</Typography>
                    <Typography align="center" variant="body1">The Certified Health IT Product List (CHPL) is a comprehensive and authoritative listing of all certified health information technology that have been successfully tested and certified by the ONC Health IT Certification program.</Typography>
                </Container>
            </Box>
            <Box className={classes.landingPageBackground} height="fit-content">
                <Box className={classes.landingPageImageryBackground} height="100%">
                    <Container maxWidth="lg">
                        {/*Placeholder for search bar */}
                        <Box mt={-4} height="100px" bgcolor="#C6D5E5"></Box>
                        <Box pt={8} pb={8}>
                            <Typography className={classes.subHeaders} align="left" variant="h2" gutterBottom>Use on of our collections page to help find a particular category of listings</Typography>
                        </Box>
                        <Box display="flex" flexDirection="column" gridGap={16}>
                            <Box display="flex" flexDirection="row" gridGap={16}>
                                <Box display="flex" flexDirection="row" maxWidth="25vw">
                                    <Card>
                                        <CardContent>
                                            <Box display="flex" flexDirection="row" gridGap={4}>
                                                <ArrowForwardOutlinedIcon color="primary" />
                                                <Box mt={-1}>
                                                    <Typography color="primary" variant="subtitle1">API INFO FOR 2015 Products</Typography>
                                                    <Typography variant="body2">This list includes all 2015 Edition, including Cures update, health it products that have been certified to at least one API Criteria </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                                <Box display="flex" flexDirection="row" maxWidth="25vw">
                                    <Card>
                                        <CardContent>
                                            <Box display="flex" flexDirection="row" gridGap={4}>
                                                <ArrowForwardOutlinedIcon color="primary" />
                                                <Box mt={-1}>
                                                    <Typography color="primary" variant="subtitle1">SED INFO FOR 2015 products</Typography>
                                                    <Typography variant="body2">This list includes all 2015 Edition, including Cures update, health it products that have been certified to at least one API Criteria </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                                <Box display="flex" flexDirection="row" maxWidth="25vw">
                                    <Card>
                                        <CardContent>
                                            <Box display="flex" flexDirection="row" gridGap={4}>
                                                <ArrowForwardOutlinedIcon color="primary" />
                                                <Box mt={-1}>
                                                    <Typography color="primary" variant="subtitle1">inactive CERTIFICATES</Typography>
                                                    <Typography variant="body2">This list includes all 2015 Edition, including Cures update, health it products that have been certified to at least one API Criteria </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                                <Box display="flex" flexDirection="row" maxWidth="25vw">
                                    <Card>
                                        <CardContent>
                                            <Box display="flex" flexDirection="row" gridGap={4}>
                                                <ArrowForwardOutlinedIcon color="primary" />
                                                <Box mt={-1}>
                                                    <Typography color="primary" variant="subtitle1">Banned DEVELOPERS</Typography>
                                                    <Typography variant="body2">This list includes all 2015 Edition, including Cures update, health it products that have been certified to at least one API Criteria </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                            </Box>
                            <Box display="flex" flexDirection="row" gridGap={16}>
                                <Box display="flex" flexDirection="row" maxWidth="25vw">
                                    <Card>
                                        <CardContent>
                                            <Box display="flex" flexDirection="row" gridGap={4}>
                                                <ArrowForwardOutlinedIcon color="primary" />
                                                <Box mt={-1}>
                                                    <Typography color="primary" variant="subtitle1">Real World Testing</Typography>
                                                    <Typography variant="body2">This list includes all 2015 Edition, including Cures update, health it products that have been certified to at least one API Criteria </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                                <Box display="flex" flexDirection="row" maxWidth="25vw">
                                    <Card>
                                        <CardContent>
                                            <Box display="flex" flexDirection="row" gridGap={4}>
                                                <ArrowForwardOutlinedIcon color="primary" />
                                                <Box mt={-1}>
                                                    <Typography color="primary" variant="subtitle1">Charts</Typography>
                                                    <Typography variant="body2">This list includes all 2015 Edition, including Cures update, health it products that have been certified to at least one API Criteria </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                                <Box display="flex" flexDirection="row" maxWidth="25vw">
                                    <Card>
                                        <CardContent>
                                            <Box display="flex" flexDirection="row" gridGap={4}>
                                                <ArrowForwardOutlinedIcon color="primary" />
                                                <Box mt={-1}>
                                                    <Typography color="primary" variant="subtitle1">Products Corrective Actions</Typography>
                                                    <Typography variant="body2">This list includes all 2015 Edition, including Cures update, health it products that have been certified to at least one API Criteria </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                                <Box display="flex" flexDirection="row" maxWidth="25vw">
                                    <Card>
                                        <CardContent>
                                            <Box display="flex" flexDirection="row" gridGap={4}>
                                                <ArrowForwardOutlinedIcon color="primary" />
                                                <Box mt={-1}>
                                                    <Typography color="primary" variant="subtitle1">Decertified Products</Typography>
                                                    <Typography variant="body2">This list includes all 2015 Edition, including Cures update, health it products that have been certified to at least one API Criteria </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                            </Box>
                            <Typography pt={8} pb={8} className={classes.subHeaders} align="left" variant="h3" gutterBottom>Need Help? Learn more about CHPL through our documentation.</Typography>
                            <Box display="flex" flexDirection="row" gridGap={16}>
                                <Box display="flex" flexDirection="row" maxWidth="33vw">
                                    <Card>
                                        <CardContent>
                                            <Box display="flex" flexDirection="row" gridGap={4}>
                                                <ArrowForwardOutlinedIcon color="primary" />
                                                <Box mt={-1}>
                                                    <Typography color="primary" variant="subtitle1">Real World Testing</Typography>
                                                    <Typography variant="body2">This list includes all 2015 Edition, including Cures update, health it products that have been certified to at least one API Criteria </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                                <Box display="flex" flexDirection="row" maxWidth="33vw">
                                    <Card>
                                        <CardContent>
                                            <Box display="flex" flexDirection="row" gridGap={4}>
                                                <ArrowForwardOutlinedIcon color="primary" />
                                                <Box mt={-1}>
                                                    <Typography color="primary" variant="subtitle1">Charts</Typography>
                                                    <Typography variant="body2">This list includes all 2015 Edition, including Cures update, health it products that have been certified to at least one API Criteria </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                                <Box display="flex" flexDirection="row" maxWidth="33vw">
                                    <Card>
                                        <CardContent>
                                            <Box display="flex" flexDirection="row" gridGap={4}>
                                                <ArrowForwardOutlinedIcon color="primary" />
                                                <Box mt={-1}>
                                                    <Typography color="primary" variant="subtitle1">Products Corrective Actions</Typography>
                                                    <Typography variant="body2">This list includes all 2015 Edition, including Cures update, health it products that have been certified to at least one API Criteria </Typography>
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