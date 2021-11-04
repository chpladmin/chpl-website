import React from 'react';
import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Link,
  List,
  ListItem,
  Typography,
  makeStyles,
} from '@material-ui/core';

/*MUI Icons*/
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import GetAppIcon from '@material-ui/icons/GetApp';
import SettingsIcon from '@material-ui/icons/Settings';

/*Utility Components*/
import { ChplEllipsis } from '../../../components/util';
import { ChplActionBar } from '../../../components/action-bar';

/* Style Guide Componets*/
import SgAccordion from './sg-accordion';
import SgAdministratorLogin from './sg-administrator-login';
import SgAdministratorLoginChangePassword from './sg-administrator-login-change-password';
import SgAdministratorLoginForgotPassword from './sg-administrator-login-forgot-password';
import SgAdministratorLoginOptions from './sg-administrator-login-options';
import SgAdministratorLoginRequired from './sg-administrator-login-required';
import SgDefaultButton from './sg-default-button';
import SgDefaultForm from './sg-default-form';
import SgDeleteButton from './sg-delete-button';
import SgConfirmation from './sg-confirmation';
import SgPrimaryButton from './sg-primary-button';
import SgProductCardContainer from './sg-product-card-container';
import SgSearchBar from './sg-search-bar';
import SgSecondaryButton from './sg-secondary-button';
import SgTable from './sg-table';
import SgTemplate from './sg-template';

/*Custom CSS for Style Guide*/
const useStyles = makeStyles({
  chplContainer: {
    gap: '16px',
    display: 'grid',
    backgroundColor: '#f2f2f2',
    padding: '32px',
    paddingTop: '64px',
    overflowWrap: 'anywhere',
  },
  rowContainer: {
    gap: '16px',
    display: 'grid',
    gridTemplateColumns: '3fr 9fr',
    alignItems: 'start',
  },
  tableContainer: {
    gap: '16px',
    display: 'grid',
    gridTemplateColumns: '1fr',
  },
  columnContainer: {
    gap: '16px',
    display: 'grid',
    justifyItems: 'start',
  },
});


function Elements() {
  const classes = useStyles();

  return (
    <div>
      <SgSearchBar />
      <div className={classes.chplContainer}>
        <Typography gutterBottom variant="h3">Typography Hierarchy:</Typography>
        {/* Typography Containers */}
        <div className={classes.rowContainer}>
          <Card>
            <CardHeader title="Rules To Follow:"></CardHeader>
            <CardContent>
              <List aria-label="chpl button rules">
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    1. A page may only contain one H1 heading.
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    2. CHPL's H1 are the only header that is defaulted to a heavier weight.
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    3. Headers should never jump one another. For example a page should not never a h1 then a h3 following it. It should read h1, h2, h3, and so one.
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    4. When displaying data, subtitles should be used above the data that is being displayed.
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    5. Typography should always be align left. There may be a special edge cases where we align typography to the right.
                  </Typography>
                </ListItem>
              </List>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h1">h1. Heading</Typography>
              <Typography gutterBottom varient="body1">
                The H1 heading describes a page’s main topic. It should be highly related to the content and unique across your website,
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
                H5 comes in handy for call outs. If chpl wanted to focus on a certain object, h5 should be used. Card Header will be using h5 as a default in CHPL.
              </Typography>
              <Typography gutterBottom variant="h6">h6. Heading</Typography>
              <Typography gutterBottom variant="body1">
                Should only be used it pages are dense with other heading tags. It highly likely we used this. H6 is slightly bigger then body text so user can still see the difference for easy reading hiearchy.
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
                <ChplEllipsis maxLength="39" text="Use the ellipsis to read more content. Donec id ex id neque maximus faucibus quis non lectus. Cras luctus leo at venenatis sollicitudin. Donec vitae augue molestie, eleifend dui nec, lacinia ante. Fusce ex lacus, facilisis eget rutrum non, pulvinar sed neque. Vestibulum aliquet leo a orci bibendum, sit amet consequat leo molestie. Interdum et malesuada fames ac ante ipsum primis in faucibus. Suspendisse auctor quam dui, vel dictum nunc ultricies id. Nullam iaculis mauris nec dapibus porttitor. Quisque auctor venenatis sem nec maximus. Cras bibendum lacus vitae elementum feugiat. Vestibulum augue mauris, tristique ut ultrices quis, maximus a eros. Pellentesque at feugiat sapien. Integer ultricies sed orci eu porta. Praesent condimentum odio id nisl ultricies tincidunt." />
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

        <Typography gutterBottom variant="h2">CHPL Buttons and Where To Use Them:</Typography>
        {/* Buttons Variations*/}
        <div className={classes.rowContainer}>
          <Card>
            <CardHeader title="Rules To Follow:"></CardHeader>
            <CardContent>
              <List aria-label="chpl button rules">
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    1. All buttons should have text that associated with the action.
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    2. All buttons should have an icon associated with the given button.
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
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    6. Choosing a button style depends on the primacy of the button, the number of containers on screen, and the screen layout.
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    7. Button groups are used when there's multiple actions that can happen for a particular item, table or other. A button group should have 3 or more actions to be consider a button group.
                  </Typography>
                </ListItem>
              </List>
            </CardContent>
          </Card>
          <div>
            <Card>
              <CardHeader title="Button Options"></CardHeader>
              <CardContent>
                <div>
                  <div>
                    <SgPrimaryButton />
                    <Typography gutterBottom variant="body1">
                      Primary Button should be used on saved buttons or on the
                      main action of the given page object. Be sure to use the
                      varient <i>contained</i>.
                    </Typography>
                  </div>
                  <div>
                    <SgSecondaryButton />
                    <Typography gutterBottom variant="body1">
                      Secondary Button should be used on filters, selecting listings, uploads and more! Think of this button as a cache all for all buttons. Be sure to use the variant contained here.
                    </Typography>
                  </div>
                  <div>
                    <SgDefaultButton />
                    <Typography gutterBottom variant="body1">
                      Default Button should be used on cancelling a certain process/form. Be sure to use the variant contained.
                    </Typography>
                  </div>
                  <div>
                    <Button variant="contained" disabled>
                      disabled Button
                    </Button>
                    <Typography gutterBottom variant="body1">
                      Disabled button should be shown when an action can not be completed until a user makes a separate action. You can use the disabled on any button and styling will change
                    </Typography>
                  </div>
                  <div>
                    <SgConfirmation />
                    <Typography gutterBottom>Confirmation Alerts are urgent interruptions, requiring acknowledgement, that inform the user about a situation. Click on the save button to show the dialog box for confirmation. Chpl interface should use confirmation on all saved, delete or cancels (in edit mode). </Typography>
                  </div>
                  <div>
                    <SgDeleteButton />
                    <Typography gutterBottom variant="body1">
                      Delete button should be used only when there is an action to delete a process/item. Be sure to use the variant contained.
                    </Typography>
                  </div>
                  <div>
                    <ButtonGroup>
                      <Button fullWidth color="secondary" variant="contained">Download
                        <GetAppIcon className={classes.iconSpacing} />
                      </Button>
                      <Button fullWidth color="secondary" variant="contained">Columns Settings
                        <SettingsIcon className={classes.iconSpacing} />
                      </Button>
                      <Button fullWidth color="secondary" variant="contained">Add
                        <PlaylistAddIcon className={classes.iconSpacing} />
                      </Button>
                    </ButtonGroup>
                  </div>
                </div>
              </CardContent>
            </Card>
            <br />
            <Card>
              <CardHeader title="Button Sizes"></CardHeader>
              <CardContent>
                <div>
                  <Button size="medium" color="primary" variant="contained">
                    Medium button
                    <ArrowForwardOutlinedIcon
                      fontSize="small"
                    />
                  </Button>
                </div>
                <Divider />
                <div>
                  <Button fullWidth color="primary" variant="contained">
                    Full Width button
                    <ArrowForwardOutlinedIcon
                    />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* End Button Variations*/}
        <Typography gutterBottom variant="h2"> CHPL Cards (Header, Body, Action):</Typography>
        {/* Cards*/}
        <div className={classes.rowContainer}>
          <Card>
            <CardHeader title="Rules To Follow:"></CardHeader>
            <CardContent>
              <List aria-label="Card rules">
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    1. Cards should always contained a title.
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    2. All content should be contained in the CardContent element.
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    3. Chpl cards can also contained buttons in the CardActions element. Buttons should only be related to the content within the card. However, a chpl card doesn't need a button to be used.
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    4. If the Chpl cards has more then 3 buttons, please contain them in a buttonGroup.
                  </Typography>
                </ListItem>
              </List>
            </CardContent>
          </Card>
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
                {' Dont you like this font? If so download it here'}
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
        {/*Chpl Chips*/}
        <Typography gutterBottom variant="h2">Chips:</Typography>
        <div className={classes.rowContainer}>
          <Card>
            <CardHeader title="Rules To Follow:"></CardHeader>
            <CardContent>
              <List aria-label="Card rules">
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    1. Chips are used in the CHPl interface to indicate a change that has or needs to happened.
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    2. Chips are displayed in accordion and forms during edit mode.
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    3. Chips are not buttons, so they shouldn't have a link or action behind it.
                  </Typography>
                </ListItem>
              </List>
            </CardContent>
          </Card>
          <Card>
            <CardHeader title="Chip Options"></CardHeader>
            <CardContent>
              <div className={classes.columnContainer}>
                <Chip label="Basic" />
                <Chip label="Outline Default" color="default" variant="outlined" />
                <Chip label="Outline Primary" color="primary" variant="outlined" />
                <Chip label="Clickable Chip Link" component="a" href="#chip" clickable />
              </div>
            </CardContent>
          </Card>
        </div>
        {/*End of Chpl Chips*/}
        {/* Table*/}
        <div>
          <Typography gutterBottom variant="h2">Tables:</Typography>
          <div className={classes.tableContainer}>
            <SgTable />
          </div>
        </div>
        {/*End of Table*/}
        <Typography gutterBottom gutterBottom variant="h2">Chpl Forms & TextField:</Typography>
        {/*Chpl Forms & TextField*/}
        <div className={classes.rowContainer}>
          <Card>
            <CardHeader title="Rules To Follow:"></CardHeader>
            <CardContent>
              <List aria-label="chpl button rules">
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    1. All chpl forms within edit mode should have ChplActionBar applied to the bottoms of the page. A real-life example is shown in the user management section of CHPL.
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    2. All chpl forms should be contained in a card for consistent styling and spacing.
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    3. Inputs should use the component ChplTextField.
                  </Typography>
                </ListItem>
              </List>
            </CardContent>
          </Card>
          <SgDefaultForm />
        </div>
        {/*End of Chpl Forms & TextField*/}
        <Typography gutterBottom gutterBottom variant="h2">Chpl Accordions:</Typography>
        {/*Accordions*/}
        <div className={classes.rowContainer}>
          <Card>
            <CardHeader title="Rules To Follow:"></CardHeader>
            <CardContent>
              <List aria-label="Card rules">
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    1. The top level of the accordion should have the follow light blue as a card header.
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    2. Content should always be contained in the accordion details element.
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    3. Nest accordions should have the background color of #f9f9f9. See example to the right.
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    4. Nested accordions should be contained in a div with the class .accordion for smooth & equal padding.
                  </Typography>
                </ListItem>
              </List>
            </CardContent>
          </Card>
          <SgAccordion />
        </div>
        {/*End of Accordions*/}
        <Typography gutterBottom gutterBottom variant="h2">Action Bar:</Typography>
        {/*App Bar*/}
        <div className={classes.rowContainer}>
          <Card>
            <CardHeader title="Rules To Follow:"></CardHeader>
            <CardContent>
              <List aria-label="Card rules">
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    The action bar will have a cancel & save button as default. It some occasions there will be a delete button.
                  </Typography>
                </ListItem>
              </List>
            </CardContent>
          </Card>
          <Typography variant='subtitle1'>View the bottom of the screen to see the action bar. </Typography>
          <ChplActionBar />
        </div>
        {/*End of App Bar*/}
        <Typography gutterBottom variant="h2">Log In Module:</Typography>
        {/*Log In Module*/}
        <div className={classes.rowContainer}>
          <Card>
            <CardHeader title="Rules To Follow:"></CardHeader>
            <CardContent>
              <List aria-label="Card rules">
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    1. The log in module is broken into four different components. The components can be used for two different layouts. Either popover or fullscreen.
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    2. The four components are: Login, Forgot Options, Change Password, & Login Options.
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    3. Each popover used a title besides the chpl options, this screen is shown when a user is login into CHPL.
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    4. When using the full screen template be sure to use an h1 for the title, due it to being the only item on the screen.
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    5. The login module uses full screen buttons. Please follow additional buttons rules above.
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    6. The login module uses full screen buttons. Please follow additional buttons rules above.
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    7. When a user is login in, we should be display the username of the user. See examples: $USERNAME.
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    8. Login in popovers should always anchorOrigin & transformOrigin: horizontal: 'right' to the module pop and hangs from the right side of the button.
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    9. Password strength display is still TBD due to technology capabilities.
                  </Typography>
                </ListItem>
              </List>
            </CardContent>
          </Card>
          <div className={classes.columnContainer}>
            <Typography gutterBottom variant="body1">Login </Typography>
            <SgAdministratorLogin />
            <Typography gutterBottom variant="body1">Forgot Password </Typography>
            <SgAdministratorLoginForgotPassword />
            <Typography gutterBottom variant="body1">Change Password</Typography>
            <SgAdministratorLoginChangePassword />
            <Typography gutterBottom variant="body1">Login Options</Typography>
            <SgAdministratorLoginOptions />
            <Typography gutterBottom variant="body1">Full Screen Template for <a href='https://chpl.ahrqdev.org/#/administration'>Administration Screen</a> or <a href='https://chpl.ahrqdev.org/#/login'>Login Screen</a></Typography>
            <SgAdministratorLoginRequired />
          </div>
        </div>
        {/*End Log In Module*/}
        <Typography gutterBottom variant="h2">CHPL Spacing, Grid & Template</Typography>
        {/*Spacing and Grid*/}
        <div className={classes.rowContainer}>
          <Card>
            <CardHeader title="Rules To Follow:"></CardHeader>
            <CardContent>
              <List>
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    1. CHPL uses the power of 4 for padding and margin on components. This means you should ONLY use numbers such as 4 | 8 | 16 | 32 | 64 | 128 | 256 (256 should be the largest number used if necessary, contact designer if needed)
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    2. When starting a new page but sure to use the Chplcontainer to create our full width pages, if you use the default Material UI the CHPL theme will be thrown off. You can reference this class in the style-guide.js
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    3. Chpl uses a custom grid system that is very flexible depending on the content. The grid should always be applied within a component. For example a card, accordion, table and more.
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    4. The power of our grid comes from using gridTemplateColumns, gridTemplateRows and gridGap to create a clean, modern design for our application. Chpl will use Media query's that effect these css styles to our interface is responsive on all screens.
                  </Typography>
                </ListItem>
              </List>
            </CardContent>
          </Card>
          <SgTemplate />
        </div>
        {/*End of Spacing and Grid*/}
        <Typography gutterBottom variant="h2">404 Error</Typography>
        {/*404 Card*/}
        <div className={classes.rowContainer}>
          <Card>
            <CardHeader title="Rules To Follow:"></CardHeader>
            <CardContent>
              <List>
                <ListItem>
                  <Typography gutterBottom variant="body1">
                    1. 404 Card Actions should be links instead of buttons.
                  </Typography>
                </ListItem>
              </List>
            </CardContent>
          </Card>
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
        {/*Start of Sandbox Componets that are WIP*/}
        <Typography gutterBottom variant="h2">Work In Progress Section:</Typography>
        {/*Search Results*/}
        <SgProductCardContainer />
        {/*End of Search Results*/}
      </div>
    </div>
  );
}

export default Elements;
