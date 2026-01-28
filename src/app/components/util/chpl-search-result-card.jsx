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
  title,
  titleValue,
  titleIconButton,
  headerActions,
  fieldGroups,
  actions,
}) {
  return (
    <Card style={{ marginBottom: '12px', marginLeft: '8px', marginRight: '8px' }}>
      <CardContent style={{ padding: '8px' }}>
        {/* Title Section */}
        {title && (
          <>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body1" style={{ fontWeight: 'bold' }} display="block" flex={1}>
                {title}
              </Typography>
              {titleIconButton && (
                <Box>
                  {titleIconButton}
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
                  {titleValue}
                </Typography>
                {headerActions}
              </Box>
            </Grid>
          </>
        )}

        {/* Field Groups */}
        {fieldGroups?.map((group, groupIndex) => (
          <Grid
            key={`field-group-${groupIndex}`}
            container
            spacing={2}
            alignItems="flex-start"
          >
            {group.map((field, fieldIndex) => (
              <Grid
                key={`field-${groupIndex}-${fieldIndex}`}
                item
                xs={field.xs || 12}
                sm={field.sm || field.xs || 12}
                style={field.style}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Box flex={1}>
                    <Typography variant="body2" style={{ fontWeight: '600' }}>
                      {field.label}
                    </Typography>
                    <Typography variant="body1">
                      {field.value ?? field.fallback ?? 'N/A'}
                    </Typography>
                  </Box>
                  {field.iconButton && (
                    <Box>
                      {field.iconButton}
                    </Box>
                  )}
                </Box>
              </Grid>
            ))}
            {actions && groupIndex === fieldGroups.length - 1 && (
              <Grid item sm="auto" style={{ marginLeft: 'auto' }}>
                {actions}
              </Grid>
            )}
          </Grid>
        ))}
      </CardContent>
    </Card>
  );
}

export default ChplSearchResultCard;

ChplSearchResultCard.propTypes = {
  title: string,
  titleValue: oneOfType([string, node]),
  titleIconButton: node,
  headerActions: node,
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
  ),
  actions: node,
};

ChplSearchResultCard.defaultProps = {
  title: undefined,
  titleValue: undefined,
  titleIconButton: undefined,
  headerActions: undefined,
  fieldGroups: [],
  actions: undefined,
};
