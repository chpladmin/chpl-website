import React from 'react';
import {
    Box,
    Container,
    makeStyles,
    Typography,
} from '@material-ui/core';
import {
    ChplUploadListings,
    ChplUploadPromotingInteroperability,
    ChplUploadRealWorldTestingWrapper,
    ChplUploadApiDocumentationWrapper
} from '../../../components/upload';

import { palette, theme, utilStyles } from 'themes';

const useStyles = makeStyles({
    ...utilStyles,
    pageHeader: {
        padding: '32px 0',
        backgroundColor: palette.white,
    },
    pageBody: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: palette.background,
        padding: '32px 0',
    },
});

function ChplUpload() {
    const classes = useStyles();
    return (
        <Box bgcolor={palette.background}>
            <div className={classes.pageHeader}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h1"
                    >
                        Upload your files
                    </Typography>
                </Container>
            </div>
            <div className={classes.pageBody} id="main-content" tabIndex="-1">
                <Container maxWidth="lg">
                    <Box display="flex" flexDirection="column" gridGap="16px">
                        <Box display="flex" flexDirection="row" flexWrap="wrap" gridGap="16px">
                            <Box width="48%">
                                <ChplUploadListings />
                            </Box>
                            <Box width="48%">
                                <ChplUploadRealWorldTestingWrapper />
                            </Box>
                            <Box width="48%">
                                <ChplUploadPromotingInteroperability />
                            </Box>
                            <Box width="48%">
                                <ChplUploadApiDocumentationWrapper />
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </div>
        </Box>
    );
}

export default ChplUpload;

ChplUpload.propTypes = {
};
