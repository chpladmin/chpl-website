import React from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
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
      <Typography variant="h1" component="h2" gutterBottom>
        h1. Heading
      </Typography>
      <Typography variant="h2" gutterBottom>
        h2. Heading
      </Typography>
      <Typography variant="h3" gutterBottom>
        h3. Heading
      </Typography>
      <Typography variant="h4" gutterBottom>
        h4. Heading
      </Typography>
      <Typography variant="h5" gutterBottom>
        h5. Heading
      </Typography>
      <Typography variant="h6" gutterBottom>
        h6. Heading
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
      </Typography>
      <Typography variant="body1" gutterBottom>
        body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
        unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam
        dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.
      </Typography>
      <Typography variant="body2" gutterBottom>
        body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
        unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam
        dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.
      </Typography>
      <Typography variant="button" display="block" gutterBottom>
        button text
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        caption text
      </Typography>
      <Typography variant="overline" display="block" gutterBottom>
        overline text
      </Typography>
      <hr />
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
        </CardActions>
      </Card>
    </Container>
  );
}

export default Elements;
