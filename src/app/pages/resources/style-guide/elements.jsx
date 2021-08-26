import React from 'react';
import {
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
  Typography,
  makeStyles,
} from '@material-ui/core';

import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { ChplEllipsis } from '../../../components/util';
import ChplAccordion from './chpl-accordion';
import ChplStyleGuideTable from './style-guide-table';
import ChplDeleteButton from './chpl-delete-button';
import ChplPrimaryButton from './chpl-primary-button';
import ChplSecondaryButton from './chpl-secondary-button';
import ChplDefaultButton from './chpl-default-button';
import ChplDefaultFilter from './chpl-default-filter';
import ChplDefaultForm from './chpl-default-form';
import ChplActionBar from '../../../components/action-bar/action-bar';
import ChplTemplate from './chpl-template';
import ChplAdministratorLogin from './chpl-administrator-login';
import SgConfirmation from './sg-confirmation';
import SgProductCard from './sg-product-card';
import SgProductCardContainer from './sg-product-card-container';
import SgSearchBar from './sg-search-bar';

const useStyles = makeStyles({
  chplContainer: {
    gridTemplateColumns: '1fr',
    backgroundColor: '#f2f2f2',
    padding: '32px',
    paddingTop:'64px',
    gap: '16px',
    display:'grid',
    overflowWrap:'anywhere',
  },
  buttonContainer:{
    gridTemplateColumns: 'auto 1fr',
    gap: '16px',
    display:'grid',
  },
});


function Elements() {
  const classes = useStyles();

  return (
    <div>
      <SgSearchBar />
      <div className={classes.chplContainer}>
        <div>
        {/* Typography Containers */}
        <Typography gutterBottom variant="h3">Typography Hiearchy:</Typography>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h1">h1. Heading</Typography>
            <Typography gutterBottom varient="body1">
              The H1 heading describes a page’s main topic. It should be highly related to the content and unique across your website, and a page may only contain one H1 heading.
            </Typography>
            <Typography gutterBottom variant="h2">h2. Heading</Typography>
            <Typography gutterBottom varient="body1">The H2 heading describes a sub topic on the given page. We will used these as subheads.
            </Typography>
            <Typography gutterBottom variant="h3">h3. Heading</Typography>
            <Typography gutterBottom variant="body1">
              Consider using H3 for useful groups of h1 content. Think of h3 as is a second heading.
            </Typography>
            <Typography gutterBottom variant="h4">h4. Heading</Typography>
            <Typography gutterBottom variant="body1">
              The H4 heading will be used a sub topic to h2 subject. The bottom echelons (H4-H6) should be where you put your content that only exists to back up the previous headings – and should be the least important.
            </Typography>
            <Typography gutterBottom variant="h5">h5. Heading</Typography>
            <Typography gutterBottom variant="body1">
              H5 comes in handy for call outs. If chpl wanted to focus on a certain obecjt, h5 should be used. Card Header will be using h5 as a default in CHPL.
            </Typography>
            <Typography gutterBottom variant="h6">h6. Heading</Typography>
            <Typography gutterBottom variant="body1">
              Should only be used it pages are dense with other heading tags. It highly likely we used this. H6 is slighty bigger then body text so user can still see the difference for easy reading hiearchy.
            </Typography>
            <Typography gutterBottom variant="subtitle1">
              subtitle1. used on static label headers. See real-life example below.
            </Typography>
            <Typography gutterBottom variant="subtitle2">
              subtitle2. used on static label sub-headers. See real-life example below.
            </Typography>
            <Typography gutterBottom variant="body1">
              Body1
            </Typography>
            <Typography gutterBottom variant="body1">
              This is the standard body text for the CHPL Interface. Varient = body1
            </Typography>
            <Typography gutterBottom variant="body2">
              Body2
            </Typography>
            <Typography gutterBottom variant="body2">
              This is the secondary body text for the CHPL interface. This should be used in dense places, due to the type being smaller than the original body copy. Use Varient = body2
            </Typography>
            <Typography gutterBottom variant="body1" display="block">
              The chpl ellipis can be used to hide large amount of text without losing the ability to access the information.
              <ChplEllipsis maxLength="39" text="Use the eillipis to read more content. Donec id ex id neque maximus faucibus quis non lectus. Cras luctus leo at venenatis sollicitudin. Donec vitae augue molestie, eleifend dui nec, lacinia ante. Fusce ex lacus, facilisis eget rutrum non, pulvinar sed neque. Vestibulum aliquet leo a orci bibendum, sit amet consequat leo molestie. Interdum et malesuada fames ac ante ipsum primis in faucibus. Suspendisse auctor quam dui, vel dictum nunc ultricies id. Nullam iaculis mauris nec dapibus porttitor. Quisque auctor venenatis sem nec maximus. Cras bibendum lacus vitae elementum feugiat. Vestibulum augue mauris, tristique ut ultrices quis, maximus a eros. Pellentesque at feugiat sapien. Integer ultricies sed orci eu porta. Praesent condimentum odio id nisl ultricies tincidunt." />
            </Typography>
            <Typography gutterBottom variant="button" display="block">
              button text - Defaulted to all caps.
            </Typography>
            <Typography gutterBottom variant="caption" display="block">
              caption text
            </Typography>
            <Typography gutterBottom variant="overline" display="block">
              overline text
            </Typography>
          </CardContent>
        </Card>
        </div>
        {/* End of Typography Containers */}

        {/* Buttons Variations*/}
        <div >
        <Typography gutterBottom variant="h2">CHPL Buttons and Where To Use Them:</Typography>
          <Card>
            <CardHeader title="Rules To Follow:"></CardHeader>
            <CardContent>
              <List aria-label="chpl button rules">
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    1. All buttons should have text that assoicated with the action.
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    2. All buttons should have an icon assoicated with the given button.
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    3. Sizing of the button is either medium or full width.
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    4. All CHPL buttons are built as their own component. You have the following options of (ChplPrimary Button , Chpl Secondary Button, ChplDeleteButton, ChplButtonGroup)
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    5. All icons within a button should have the class .iconSpacing applied for a consistent theme)
                  </Typography>
                </ListItem>
              </List>
              <Divider />
              <div className={classes.buttonContainer}>
              <ChplPrimaryButton />
              <Typography gutterBottom gutterBottom variant="body1">
                Primary Button should be used on saved buttons or on the
                main action of the given page object. Be sure to use the
                varient <i>contained</i>.
              </Typography>
              <ChplSecondaryButton />
              <Typography gutterBottom gutterBottom variant="body1">
                Secondary Button should be used on filters, selecting
                listings, uploads and more! Think of this button as a
                cache all for all buttons. Be sure to use the varient{' '}
                <i>contained</i> here.
              </Typography>
              <ChplDefaultButton />
              <Typography gutterBottom gutterBottom variant="body1">
                Default Button should be used on cancelling a certian process/form. Be sure to use the varient<i> contained</i>.
              </Typography>
              <Button variant="contained" disabled>
                disabled Button
              </Button>
              <Typography gutterBottom gutterBottom variant="body1">
                Disabled button should be shown when an action can not be completed until a user makes a seperate action. You can use the <i>disabled</i> on any button and styling will change
              </Typography>
              <SgConfirmation />
              <Typography gutterBottom>Confirmation Alerts are urgent interruptions, requiring acknowledgement, that inform the user about a situation. Click on the save button to show the dialog box for confirmation. Chpl interface should use confirmation on all saved, delete or cancels (in edit mode). </Typography>
              <ChplDeleteButton />
              <Typography gutterBottom gutterBottom variant="body1">
                Delete button should be used only when there is an action
                to delete a proccess/item. Be sure to use the varient{' '}
                <i>contained</i>.
              </Typography>
              <ButtonGroup color="primary" aria-label="outlined primary button group">
                <Button>Click Here</Button>
                <Button>Hover Over Me</Button>
                <Button>One More</Button>
              </ButtonGroup>
              <Typography gutterBottom gutterBottom variant="body1">
                Button groups are used when there's multiple actions that can happen for a particular item, table or other.
              </Typography>
              <ButtonGroup>
                <Button color="primary" variant="contained">Open Details</Button>
                <Button color="primary" variant="outlined">CMS Widget</Button>
                <Button color="primary" variant="outlined">Compare</Button>
              </ButtonGroup>
              <Typography gutterBottom gutterBottomvariant="body1">
                Within CHPL youll see vartions of button groups that includes primary, secondary, default, and so one.
              </Typography>
              </div>
              <Divider />
              <Typography gutterBottom gutterBottom variant="h3">
                CHPL Buttons Sizes:
              </Typography>
              <div className={classes.buttonContainer}>
              <Button size="medium" color="primary" variant="contained">
                Medium button
                <ArrowForwardOutlinedIcon
                  fontSize="small"
                />
              </Button>
              <Button fullWidth color="primary" variant="contained">
                Full Width button
                <ArrowForwardOutlinedIcon
                />
              </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* End Button Variations*/}
        
        {/* Cards*/}
        <div>
          <Typography gutterBottom variant="h2">
            CHPL Cards (Header, Body, Action):
          </Typography>

        </div>
        <div>
          <Card>
            <CardHeader title="Header of Card"></CardHeader>
            <CardContent>
              <Typography gutterBottom variant="h6">This is a card</Typography>
              <Typography gutterBottom color="primary">
                Some body copy with primary coloring.
              </Typography>
    
              <Divider></Divider>
    
              <Typography gutterBottom variant="body1">
                Body 1 is being shown
      
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
        </div>
        {/* Cards*/}
        <div>
          <Typography gutterBottom gutterButton variant="h2">
            CHPL Dropdown Filters:
          </Typography>
          <Card>
            <CardContent >
              <div>
                <ChplDefaultFilter />
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Table*/}
        <div>
          <Typography gutterBottom variant="h2">Tables:</Typography>
          <ChplStyleGuideTable />
        </div>
        {/*End of Table*/}
        {/*>Chpl Chips*/}
        <div>
          <Typography gutterBottom variant="h2">Chips:</Typography>
          <Chip label="Basic" />
          <Chip label="Outline Default" color="default" variant="outlined" />
          <Chip label="Outline Primary" color="primary" variant="outlined" />
          <Chip label="Clickable Chip Link" component="a" href="#chip" clickable />
          <Typography gutterBottom variant="body1">Chips are used in the CHPl interface to indicate a change that has or needs to happened. Chips are usually being displayed in accordion and forms.</Typography>
        </div>
        {/*End of Chpl Chips*/}

        {/*>Chpl Forms & TextField*/}
        <div>
          <Typography gutterBottom gutterBottom variant="h5">Chpl Forms & TextField:</Typography>
          <ChplDefaultForm />
          <Typography gutterBottom gutterBottom variant="body1">All chpl forms within edit mode should have ChplActionBar applied to the bottoms of the page. A real-life example is shown in the user management section of CHPL.</Typography>
        </div>
        {/*End of >Chpl Forms & TextField*/}

        {/*Accordions*/}
        <div>
          <ChplAccordion />
        </div>
        {/*End of Accordions*/}

        {/*App Bar*/}
        <div>
          <Typography gutterBottom gutterBottom variant="h5">Action Bar:</Typography>
          <Typography gutterBottom gutterBottom variant="body1">View the bottom of the screen to see the action bar. The action bar will have a cancel & save button as default. It some occasions there will be a delete button.</Typography>
          <ChplActionBar />
        </div>
        {/*End of App Bar*/}

        {/*Log In Module*/}
        <div>
          <Typography gutterBottom variant="h5">Log In Module:</Typography>
          <ChplAdministratorLogin />
        </div>
        {/*End Log In Module*/}

        {/*Spacing and Grid*/}
        <div>
          <Typography gutterBottom variant="h5">Spacing and Grid:</Typography>
        </div>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="subtitle1">
              Rules To Follow:
            </Typography>
            <List aria-label="chpl button rules">
              <ListItem>
                <Typography gutterBottom variant="body1">
                  1. CHPL uses the power of 4 for padding and margin on components. This means you should ONLY use numbers such as 4 | 8 | 16 | 32 | 64 | 128 | 256 (256 should be the largest number used if necesscary, contact designer if needed)
                </Typography>
              </ListItem>
              <ListItem>
                <Typography gutterBottom variant="body1">
                  2. When starting a new page but sure to use the Chplcontainer to create our full width pages, if you use the default Material UI the CHPL theme will be thrown off. You can reference this class in the style-guide.js
                </Typography>
              </ListItem>
              <ListItem>
                <Typography gutterBottom variant="body1">
                  3. Chpl uses a custom grid system that is very flexiable depending on the content. The grid should always be applied within a component. For example a card, accordion, table and more.
                </Typography>
              </ListItem>
              <ListItem>
                <Typography gutterBottom variant="body1">
                  4. The power of our grid comes from using gridTemplateColumns, gridTemplateRows and gridGap to create a clean, modern design for our application. Chpl will use Media Querys that effect these css styles to our interface is responsive on all screens.
                </Typography>
              </ListItem>
              <ListItem>
                <Typography gutterBottom variant="body1">
                  5. Coming Soon...
                </Typography>
              </ListItem>
            </List>
          </CardContent>
        </Card>
        <Typography gutterBottom gutterBottom variant="body1">CHPL Template is shown below.</Typography>
        <div>
          <ChplTemplate />
        </div>
        {/*End of Spacing and Grid*/}
        {/*404 Card*/}
        <div>
          <Card>
            <CardHeader title="404 Page Not Found" />
            <CardContent>
              <Typography gutterBottom
                variant="body1"
              >
                The page you were looking for may have been moved to a new location or no longer exists. Use the links below to either return to the search page or contact us to report a problem with the CHPL site.
              </Typography>
            </CardContent>
            <CardActions>
              <Typography gutterBottom>
                <Link
                  href="#/search"
                >
                  Back to Search
                </Link>
              </Typography>
              <Typography gutterBottom>|</Typography>
              <Typography gutterBottom>
                <Link
                  href="https://inquiry.healthit.gov/support/plugins/servlet/loginfreeRedirMain?portalid=2&request=51"
                >
                  Support Portal
                </Link>
              </Typography>

            </CardActions>
          </Card>
        </div>
        {/*End of 404 Card*/}
        <div>
          <SgProductCardContainer />
        </div>
      </div>
    </div>
  );
}

export default Elements;
