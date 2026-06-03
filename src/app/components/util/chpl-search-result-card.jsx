import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  arrayOf,
  node,
  number,
  oneOfType,
  shape,
  string,
} from 'prop-types';

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: '12px',
    transition: theme.transitions.create('box-shadow'),
    '&:hover': {
      boxShadow: theme.shadows[4],
    },
  },
}));

function ChplSearchResultCard({
  cardTitle,
  cardTitleValue,
  titleIconButton = undefined,
  additionalTitleContent = undefined,
  fieldGroups = [],
  actions = undefined,
}) {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CardContent style={{
        padding: '16px 32px',
        display: 'flex',
        gridGap: '8px',
      }}
      >
        <Box display="flex" flexDirection="column" flex={1} >
          { (cardTitle || cardTitleValue)
            && (
              <>
                <Box display="flex" alignItems="center" gridGap="8px">
                  <Typography variant="body1" style={{ fontWeight: 'bold' }} display="block" flex={1}>
                    { cardTitle }
                  </Typography>
                  { titleIconButton
                    && (
                      <Box>
                        { titleIconButton }
                      </Box>
                    )}
                </Box>
                <Box
                  display="flex"
                  flex={1}
                  gridGap="8px"
                  justifyContent="space-between"
                  alignItems="center"
                  style={{ padding: '4px 0px', marginBottom: '4px' }}
                >
                  <Typography variant="h5">
                    { cardTitleValue }
                  </Typography>
                  { additionalTitleContent
                    && (
                      <Box>
                        { additionalTitleContent }
                      </Box>
                    )}
                </Box>
              </>
            )}
          { fieldGroups.map((group) => (
            <Grid
              key={group.map((f) => f.label).join('-')}
              container
              spacing={2}
              alignItems="flex-start"
              style={{ height: 'fit-content' }}
            >
              { group.map((field) => (
                <Grid
                  key={field.label}
                  item
                  xs={field.xs || 12}
                  sm={field.sm || field.xs || 12}
                  style={field.style}
                >
                  <Box display="flex" alignItems="center" gridGap="8px">
                    <Box flex={1}>
                      <Typography variant="body2" style={{ fontWeight: '600' }}>
                        { field.label }
                        { field.iconButton
                          && (
                            field.iconButton
                          )}
                      </Typography>
                      <Typography variant="body1" component="div">
                        { field.value != null && field.value !== '' ? field.value : (field.fallback ?? 'N/A') }
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ))}
        </Box>
        { actions && (
          <Box display="flex" justifyContent="flex-end" mt={1} style={{ maxHeight: 'fit-content' }}>
            {actions}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default ChplSearchResultCard;

ChplSearchResultCard.propTypes = {
  cardTitle: string,
  cardTitleValue: oneOfType([string, node]),
  titleIconButton: node,
  additionalTitleContent: node,
  fieldGroups: arrayOf(
    arrayOf(
      shape({
        label: string.isRequired,
        value: oneOfType([string, number, node]),
        fallback: string,
        xs: number,
        sm: number,
        style: shape({}),
        iconButton: node,
      }),
    ),
  ).isRequired,
  actions: node,
};
