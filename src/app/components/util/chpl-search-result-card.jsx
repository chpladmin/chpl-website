import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from '@material-ui/core';
import {
  arrayOf,
  node,
  number,
  oneOfType,
  shape,
  string,
} from 'prop-types';

function ChplSearchResultCard({
  cardTitle,
  cardTitleValue,
  titleIconButton = undefined,
  additionalTitleContent = undefined,
  fieldGroups = [],
  actions = undefined,
}) {
  return (
    <Card style={{ marginBottom: '12px', marginLeft: '8px', marginRight: '8px' }}>
      <CardContent style={{
        padding: '8px',
        display: 'flex',
        gap: '8px',
        alignItems: 'flex-end',
      }}
      >
        <Box display="flex" flexDirection="column" flex={1} gap={2}>
          { (cardTitle || cardTitleValue)
            && (
              <>
                <Box display="flex" alignItems="center" gap={1}>
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
                <Grid container spacing={2} style={{ padding: '4px', marginBottom: '4px' }} alignItems="center">
                  <Box
                    display="flex"
                    flex={1}
                    gridGap={2}
                    justifyContent="space-between"
                    alignItems="center"
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
                </Grid>
              </>
            )}
          { fieldGroups.map((group) => (
            <Grid
              key={group.map((f) => f.label).join('-')}
              container
              spacing={2}
              alignItems="flex-start"
            >
              { group.map((field) => (
                <Grid
                  key={field.label}
                  item
                  xs={field.xs || 12}
                  sm={field.sm || field.xs || 12}
                  style={field.style}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box flex={1}>
                      <Typography variant="body2" style={{ fontWeight: '600' }}>
                        { field.label }
                        { field.iconButton
                          && (
                            field.iconButton
                          )}
                      </Typography>
                      <Typography variant="body1">
                        { field.value ?? field.fallback ?? 'N/A' }
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
  carditle: string,
  titleValue: oneOfType([string, node]), 
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
