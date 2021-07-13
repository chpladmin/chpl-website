import React from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';

function Elements() {
  return (
    <Container>
      {/* Typography Containers */}  
      <Container>
         <Container>
          <Typography variant="h5">Typography Hiearchy:</Typography>
          <br />
        </Container>
          <Card>
            <CardContent>
              <Grid container spacing={4}>
                <Grid item xs={6}>
                  <Typography variant="h1">h1. Heading</Typography>
                  <Typography varient="body1">
                    The H1 heading describes a page’s main topic. It should be
                    highly related to the content and unique across your
                    website, and a page may only contain one H1 heading.
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h2">h2. Heading</Typography>
                  <Typography varient="body1">
                    The H2 heading describes a sub topic on the given page. We
                    will used these as subheads.
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h3">h3. Heading</Typography>
                  <Typography variant="body1">
                    Consider using H3 for useful groups of h1 content. Think of
                    h3 as is a second heading.
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h4">h4. Heading</Typography>
                  <Typography variant="body1">
                    The H4 heading will be used a sub topic to h2 subject. The
                    bottom echelons (H4-H6) should be where you put your content
                    that only exists to back up the previous headings – and
                    should be the least important.
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h5">h5. Heading</Typography>
                  <Typography variant="body1">
                    H5 comes in handy for call outs. If chpl wanted to focus on
                    a certain obecjt, h5 should be used. Card Header will be
                    using h5 as a default in CHPL.
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6">h6. Heading</Typography>
                  <Typography variant="body1">
                    Should only be used it pages are dense with other heading
                    tags. It highly likely we used this. H6 is slighty bigger
                    then body text so user can still see the difference for easy
                    reading hiearchy.
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    Body1
                  </Typography>
                  <Typography variant="body1">
                    This is the standard body text for the CHPL Interface.
                    Varient = body1
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                <Typography variant="body2">
                    Body2
                  </Typography>
                  <Typography variant="body2">
                    This is the secondary body text for the CHPL interface. This
                    should be used in dense places, due to the type being
                    smaller than the original body copy. Use Varient = body2
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">
                    subtitle1. used on static label headers. See real-life
                    example below.
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">
                    subtitle2. used on static label sub-headers. See real-life
                    example below.
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="button" display="block">
                    button text - Defaulted to all caps.
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" display="block">
                    caption text
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="overline" display="block">
                    overline text
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <br />
        </Container>
      {/* End of Typography Containers */}
      <Container>
        <Container>
          <Typography variant="h5">Tables:</Typography>
          <br />
        </Container>
      {/* Table*/}    
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Heading 1</TableCell>
            <TableCell>Heading 2</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Item 1</TableCell>
            <TableCell>Item 2</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      {/*End of Table*/}  
      </Container>
      <br />
      <Container>
      {/*Cards*/} 
      <Card>
        <CardHeader title="404 Page Not Found" />
        <CardContent>
          <Typography
            variant="body1"
          >
            The page you were looking for may have been moved to a new location or no longer exists. Use the links below to either return to the search page or contact us to report a problem with the CHPL site.
          </Typography>
        </CardContent>
        <CardActions>
          <Typography>
            <Link
              href="#/search"
            >
              Back to Search
            </Link>
          </Typography>
          <Typography>|</Typography>
          <Button
            color="primary"
            variant="contained"
          >
            Primary contained
          </Button>
          <Typography>|</Typography>
          <Button
            color="primary"
            variant="outlined"
          >
            Primary outlined
          </Button>
          <Typography>|</Typography>
          <Button
            color="secondary"
            variant="contained"
          >
            Secondary
          </Button>
          <Typography>|</Typography>
          <Button
            color="default"
            variant="contained"
          >
            Default
          </Button>
        </CardActions>
      </Card>
      {/*End of Cards*/} 
      </Container>
    </Container>
  );
}

export default Elements;
