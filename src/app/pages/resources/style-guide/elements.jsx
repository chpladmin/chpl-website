import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Divider,
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@material-ui/core';


import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { ChplEllipsis } from '../../../components/util';
import { ChplTextField } from '../../../components/util';

function Elements() {
  return (
    <Container>
      {/* Typography Containers */}  
      <Container>
          <Typography variant="h5">Typography Hiearchy:</Typography>
          <br />
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
                  <ChplEllipsis maxLength="60" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id ex id neque maximus faucibus quis non lectus. Cras luctus leo at venenatis sollicitudin. Donec vitae augue molestie, eleifend dui nec, lacinia ante. Fusce ex lacus, facilisis eget rutrum non, pulvinar sed neque. Vestibulum aliquet leo a orci bibendum, sit amet consequat leo molestie. Interdum et malesuada fames ac ante ipsum primis in faucibus. Suspendisse auctor quam dui, vel dictum nunc ultricies id. Nullam iaculis mauris nec dapibus porttitor. Quisque auctor venenatis sem nec maximus. Cras bibendum lacus vitae elementum feugiat. Vestibulum augue mauris, tristique ut ultrices quis, maximus a eros. Pellentesque at feugiat sapien. Integer ultricies sed orci eu porta. Praesent condimentum odio id nisl ultricies tincidunt." />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <br />
        </Container>
      {/* End of Typography Containers */}
      {/* Buttons Variations*/}
        <Container>
          <Typography variant="h5">
            CHPL Buttons and Where To Use Them:
          </Typography>
          <br />
        </Container>
        <Container>
          <Card>
            <CardContent>
              <Grid container spacing={4}>
                <Grid item xs="6">
                  <Button color="primary" variant="contained">
                    Primary button
                    <ArrowForwardOutlinedIcon
                      fontSize="small"
                    />
                  </Button>
                  <Grid item xs="10">
                    <Typography variant="body1">
                      Primary Button should be used on saved buttons or on the
                      main action of the given page object. Be sure to use the
                      varient <i>contained</i>.
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs="6">
                  <Button color="secondary" variant="contained">
                    Secondary Button
                    <ArrowForwardOutlinedIcon
                      fontSize="small"
                    />
                  </Button>
                  <Grid item xs="10">
                    <Typography variant="body1">
                      Secondary Button should be used on filters, selecting
                      listings, uploads and more! Think of this button as a
                      cache all for all buttons. Be sure to use the varient{' '}
                      <i>contained</i> here.
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs="6">
                  <Button color="default" variant="contained">
                    Default Button
                    <ArrowForwardOutlinedIcon
                      fontSize="small"
                    />
                  </Button>
                  <Grid item xs="10">
                    <Typography variant="body1">
                      Default Button should be used on cancelling a certian
                      process/form. Be sure to use the varient
                      <i> contained</i>.
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs="6">
                  <Button variant="contained" disabled>
                    disabled Button
                  </Button>
                  <Grid item xs="10">
                    <Typography variant="body1">
                      Disabled button should be shown when an action can not be
                      completed until a user makes a seperate action. You can
                      use the <i>disabled</i> on any button and styling will
                      change
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs="6">
                  <Button variant="contained">
                    Delete Button
                    <DeleteOutlinedIcon
                      fontSize="small"
                    />
                  </Button>
                  <Grid item xs="10">
                    <Typography variant="body1">
                      Delete button should be used only when there is an action
                      to delete a proccess/item. Be sure to use the varient{' '}
                      <i>contained</i>.
                    </Typography>     
                  </Grid>
                </Grid>
                <Grid item xs="6">
                <Grid>
                <ButtonGroup color="primary" aria-label="outlined primary button group">
                  <Button>Click Here</Button>
                  <Button>Hover Over Me</Button>
                  <Button>One More</Button>
                </ButtonGroup>
                </Grid>
                <Grid item xs="10">
                    <Typography variant="body1">
                    Button groups are used when there's multiple actions that can happen for a particular item, table or other. 
                    </Typography>     
                </Grid>
                <br/>
                <Grid>
                <ButtonGroup>
                  <Button color="primary" variant="contained">Open Details</Button>
                  <Button color="primary" variant="outlined">CMS Widget</Button>
                  <Button color="primary" variant="outlined">Compare</Button>
                </ButtonGroup>
                </Grid>
                <Grid item xs="10">
                    <Typography variant="body1">
                      Within CHPL youll see vartions of button groups that includes primary, secondary, default, and so one.
                      <i>contained</i>.
                    </Typography>     
                </Grid>
                </Grid>
              </Grid>
              <br/>
              <Typography variant="h6">
              CHPL Buttons Sizes:By default use medium button on CHPL UI
             </Typography>
              <Grid container alignItems="center" justify="space-between">
              <Grid item>
                  <Button color="primary" variant="contained" size="small">
                    Small button
                    <ArrowForwardOutlinedIcon
                      fontSize="small"
                    />
                  </Button>
                </Grid>
                <Grid item>
                <Button size="medium" color="primary" variant="contained">
                    Medium button
                    <ArrowForwardOutlinedIcon
                      fontSize="small"
                    />
                  </Button>
                </Grid>
                <Grid item>
                  <Button color="primary" variant="contained" size="large">
                    Large button
                    <ArrowForwardOutlinedIcon
                      fontSize="small"
                    />
                  </Button>
                </Grid>
              </Grid>
              <br/>
              <Grid item xs="12">
                  <Button fullWidth color="primary" variant="contained">
                    Large button
                    <ArrowForwardOutlinedIcon
                      fontSize="small"
                    />
                  </Button>
                </Grid>
            </CardContent>
          </Card>
        </Container>
      {/* End Button Variations*/}
      <br/>
      {/* Cards*/}  
      <Container>
          <Typography variant="h5">
            CHPL Cards (Header, Body, Action):
          </Typography>
          <br/>
        </Container>
        <Container>
          <Grid container spacing={8}>
            <Grid item xs={6}>
              <Card>
                <CardHeader title="Header of Card"></CardHeader>
                <CardContent>
                  <Typography variant="h6">This is a card</Typography>
                  <Typography color="primary">
                    Some body copy with primary coloring.
                  </Typography>
                  <br />
                  <Divider></Divider>
                  <br />
                  <Typography variant="body1">
                    Body 1 is being shown
                    <br />
                    {'Dont you like this font? If so download it here'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button color="primary" variant="contained" size="small">
                    Learn More
                    <ArrowForwardOutlinedIcon
                      fontSize="small"
                    />
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    This is a card without a card header{' '}
                  </Typography>
                  <Typography varient="h6" color="primary">
                    (using h6 for display difference){' '}
                  </Typography>
                  <br />
                  <Divider></Divider>
                  <br />
                  <Typography variant="body2">
                    Body 2 is being shown to developers can see difference
                    between body1 and body 2 in a card. Nam interdum pretium
                    auctor. Aliquam in tortor dolor. Aenean et tincidunt nulla.
                    Morbi pellentesque nulla ut enim sodales, facilisis
                    tristique tortor lobortis. Nunc id lacinia sem, vitae
                    venenatis nisi. Etiam imperdiet eu enim sit amet cursus.
                    Praesent tortor massa, scelerisque eget placerat id,
                    malesuada a nisi.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button color="primary" variant="contained" size="small">
                    Learn More
                    <ArrowForwardOutlinedIcon
                      fontSize="small"
                    />
                  </Button>
                  <Button color="secondary" variant="contained" size="small">
                    Go to Page
                    <ArrowForwardOutlinedIcon
                      fontSize="small"
                    />
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Container>
      <br/>
      {/* Cards*/} 
      {/* Table*/}
      <Container>    
      <Typography variant="h5">Tables:</Typography>
      <br/>    
      <Card>
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
        <TableFooter>
          <TablePagination></TablePagination>
        </TableFooter>
      </Table>
      </Card>
      {/*End of Table*/}  
      </Container>
      <br />

      {/*>Chpl TextField*/} 
      <Container>
        <Typography variant="h5">Chips:</Typography>
        <Chip label="Basic" />
        <Chip label="Outline Default" color="default" variant="outlined" />
        <Chip label="Outline Primary" color="primary" variant="outlined" />
        <Chip label="Clickable Chip Link" component="a" href="#chip" clickable />
        <Typography variant="body1">Chips are used in the CHPl interface to indicate a change that has or needs to happened. Chips are usually being displayed in accordion and forms.</Typography>
        
      </Container>
      {/*End of >Chpl TextField*/} 
      <br />
      {/*>Chpl TextField*/} 
      <Container>
        <Typography variant="h5">Chpl TextField:</Typography>
        <Card>
        <ChplTextField/>
        </Card>
      </Container>
      {/*End of >Chpl TextField*/} 
      <br/>
      {/*Accordions*/} 
      <Container>
        <Typography variant="h5">Accordions</Typography>
        <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Accordion 1</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
            sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Accordion 2</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
            sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion disabled>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography>Disabled Accordion</Typography>
        </AccordionSummary>
      </Accordion>
      </Container>
      {/*End of Accordions*/} 
      <br/>
      {/*App Bar*/} 
      <Container>
      <Typography variant="h5">App Bar</Typography>
      </Container>
      {/*End of App Bar*/} 
      <br/>
      {/*Spacing and Grid*/} 
      <Container>
        <Typography variant="h5">Spacing and Grid:</Typography>
      </Container>
      {/*End of Spacing and Grid*/} 
      <br/>
      {/*404 Card*/} 
      <Container>
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
      </Container>
      {/*End of 404 Card*/} 
      <br/>
    </Container>
  );
}

export default Elements;
