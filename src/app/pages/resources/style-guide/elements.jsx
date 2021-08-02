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
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
} from '@material-ui/core';


import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { ChplEllipsis } from '../../../components/util';
import { ChplTextField } from '../../../components/util';
import ChplStyleGuideTable from './style-guide-table';
import ChplDeleteButton from './chpl-delete-button';
import ChplPrimaryButton from './chpl-primary-button';
import ChplSecondaryButton from './chpl-secondary-button';
import ChplDefaultButton from './chpl-default-button';


function Elements() {
  return (
    <div>
      {/* Typography Containers */}  
      <div>
          <Typography variant="h3">Typography Hiearchy:</Typography>
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
        </div>
      {/* End of Typography Containers */}
      {/* Buttons Variations*/}
        <div>
          <Typography variant="h3">
            CHPL Buttons and Where To Use Them:
          </Typography>
          <br />
        </div>
        <div>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
              <Grid item xs="12">
                    <Typography variant="subtitle1">
                      Rules To Follow:
                    </Typography> 
                <List aria-label="chpl button rules">
                <ListItem>
                <Typography variant="body1">
                      1. All buttons should have text that assoicated with action.
                    </Typography>       
                </ListItem>
                <ListItem>
                <Typography variant="body1">
                      2. All buttons should have an icon assoicated with the given button.
                    </Typography>       
                </ListItem>        
                <ListItem>
                <Typography variant="body1">
                      3. Sizing of the button is either medium or full width.
                    </Typography>       
                </ListItem>
                <ListItem>
                <Typography variant="body1">
                      4. All CHPL buttons are built as their own component. You have the following options of (ChplPrimary Button , Chpl Secondary Button, ChplDeleteButton, ChplButtonGroup)
                    </Typography>       
                </ListItem>
                <ListItem>
                <Typography variant="body1">
                      5. All icons within a button should have the class .iconSpacing applied for a consistent theme)
                    </Typography>       
                </ListItem>
                </List>
                </Grid>
                </Grid>
                <Grid container spacing={2}>
                <Grid item xs="6">
                  <ChplPrimaryButton/>
                    <Typography gutterBottom variant="body1">
                      Primary Button should be used on saved buttons or on the
                      main action of the given page object. Be sure to use the
                      varient <i>contained</i>.
                    </Typography>
                  </Grid>
                <Grid item xs="6">
                  <ChplSecondaryButton/>
                    <Typography gutterBottom variant="body1">
                      Secondary Button should be used on filters, selecting
                      listings, uploads and more! Think of this button as a
                      cache all for all buttons. Be sure to use the varient{' '}
                      <i>contained</i> here.
                    </Typography>
                </Grid>
                <Grid item xs="6">
                  <ChplDefaultButton/>
                    <Typography gutterBottom  variant="body1">
                      Default Button should be used on cancelling a certian process/form. Be sure to use the varient<i> contained</i>.
                    </Typography>
                </Grid>
                <Grid item xs="6">
                  <Button variant="contained" disabled>
                    disabled Button
                  </Button>
                    <Typography gutterBottom  variant="body1">
                      Disabled button should be shown when an action can not be completed until a user makes a seperate action. You can use the <i>disabled</i> on any button and styling will change
                    </Typography>
                </Grid>
                <Grid item xs="6">
                  <ChplDeleteButton/>
                    <Typography gutterBottom  variant="body1">
                      Delete button should be used only when there is an action
                      to delete a proccess/item. Be sure to use the varient{' '}
                      <i>contained</i>.
                    </Typography> 
                </Grid>
                <Grid item xs="6">
                <Grid>
                <ButtonGroup color="primary" aria-label="outlined primary button group">
                  <Button>Click Here</Button>
                  <Button>Hover Over Me</Button>
                  <Button>One More</Button>
                </ButtonGroup>
                    <Typography gutterBottom variant="body1">
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
                    <Typography gutterBottomvariant="body1">
                      Within CHPL youll see vartions of button groups that includes primary, secondary, default, and so one.
                    </Typography>     
                </Grid>
                </Grid>
              </Grid>
              <Divider />
              <br/>
              <Typography gutterBottom variant="h5">
              CHPL Buttons Sizes:
             </Typography>
              <Grid container>
              <Grid item lg="2">
                <Button size="medium" color="primary" variant="contained">
                    Medium button
                    <ArrowForwardOutlinedIcon
                      fontSize="small"
                    />
                  </Button>
                  </Grid>
                  <Grid item lg="10">
                  <Button fullWidth color="primary" variant="contained">
                    Full Width button
                    <ArrowForwardOutlinedIcon
                    />
                  </Button>
              </Grid>
              </Grid>
            </CardContent>
          </Card>
        </div>
      {/* End Button Variations*/}
      <br/>
      {/* Cards*/}  
      <div>
          <Typography variant="h5">
            CHPL Cards (Header, Body, Action):
          </Typography>
          <br/>
        </div>
        <div>
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
        </div>
      <br/>
      {/* Cards*/} 
      {/* Table*/}
      <div>    
      <Typography variant="h5">Tables:</Typography>
      <br/>    
      <ChplStyleGuideTable />
      </div>
      {/*End of Table*/}  
      <br />
      {/*>Chpl TextField*/} 
      <div>
        <Typography variant="h5">Chips:</Typography>
        <Chip label="Basic" />
        <Chip label="Outline Default" color="default" variant="outlined" />
        <Chip label="Outline Primary" color="primary" variant="outlined" />
        <Chip label="Clickable Chip Link" component="a" href="#chip" clickable />
        <Typography variant="body1">Chips are used in the CHPl interface to indicate a change that has or needs to happened. Chips are usually being displayed in accordion and forms.</Typography>
        
      </div>
      {/*End of >Chpl TextField*/} 
      <br />
      {/*>Chpl TextField*/} 
      <div>
        <Typography variant="h5">Chpl TextField:</Typography>
        <Card>
        <ChplTextField/>
        </Card>
      </div>
      {/*End of >Chpl TextField*/} 
      <br/>
      {/*Accordions*/} 
      <div>
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
      </div>
      {/*End of Accordions*/} 
      <br/>
      {/*App Bar*/} 
      <div>
      <Typography variant="h5">App Bar</Typography>
      </div>
      {/*End of App Bar*/} 
      <br/>
      {/*Spacing and Grid*/} 
      <div>
        <Typography variant="h5">Spacing and Grid:</Typography>
      </div>
      {/*End of Spacing and Grid*/} 
      <br/>
      {/*404 Card*/} 
      <div>
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
      </div>
      {/*End of 404 Card*/} 
      <br/>
    </div>
  );
}

export default Elements;
