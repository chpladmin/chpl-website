import React, { useState } from 'react';
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardActions,
    Divider,
    makeStyles,
    Typography,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
    content: {
        display: 'grid',
        gap: '16px',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'start',
    },
    rowHeader: {
        display: 'grid',
        gap: '16px',
        gridTemplateColumns: '1fr',
        alignItems: 'start',
        padding: '32px',
        backgroundColor:'#ffffff',
        },
      rowBody: {
          display: 'grid',
          gap: '16px',
          gridTemplateColumns: '1fr',
          alignItems: 'start',
          padding: '16px 32px',
          backgroundColor:'#f9f9f9',
      },
    rowFooter: {
        display: 'grid',
        gap: '16px',
        gridTemplateColumns: '1fr',
        alignItems: 'start',
        padding: '16px 32px ',
        backgroundColor:'#e7e7e7',
    },
}));

function ChplTemplate() {
    const classes = useStyles();

    return (
        <div>
        <div className={classes.rowHeader}>
            <Typography variant="h1">Header One Goes Here</Typography> 
        </div>

        <div className={classes.rowBody}>
        <Typography variant="h2">Header Two Goes Here</Typography> 
        <Divider/>
            <div className={classes.content}>
                <div>
                <Typography
                    variant="h6"
                    gutterBottom
                    >
                    Ut volutpat mi ligula, sit amet pulvinar felis tincidunt in. Nam libero dui, molestie in volutpat eu, faucibus et urna. Vestibulum vitae leo rhoncus, interdum leo non, euismod erat. Proin vitae ex risus. Integer ac dapibus est, ut ullamcorper mauris. Morbi tincidunt ac ante id vulputate. Sed ut facilisis dui. Nunc ac fermentum libero. Ut sed ligula sit amet eros accumsan placerat.
                </Typography>
                </div>
                <Card>
                  <CardHeader title="A Card Header">
                  </CardHeader>
                  <CardContent>
                    <div>
                        <Typography variant="body1">
                        Ut volutpat mi ligula,
                        </Typography>
                    </div>
                </CardContent>
                <CardActions>
                    <Button color="primary" variant="contained">A default Button</Button>
                </CardActions>
              </Card>
             </div> 
        </div>
        <div className={classes.rowFooter}>
        <Typography variant="body1">Link 1 | Link 2 | Link 3 </Typography>
        </div>
        </div>
    );
}

export default ChplTemplate;
