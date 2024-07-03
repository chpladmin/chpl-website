import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import SendIcon from '@material-ui/icons/Send';

import { useFetchDevelopersBySearch, usePostMessage, usePostMessagePreview } from 'api/developer';
import { useFilterContext } from 'components/filter';
import { ChplLink, ChplTextField } from 'components/util';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  pageHeader: {
    padding: '32px',
    backgroundColor: '#ffffff',
  },
  pageBody: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    padding: '16px 32px',
    backgroundColor: '#f9f9f9',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  actionBarButton: {
    minWidth: '15vw',
  },
  actionBarButtons: {
    display: 'flex',
    justifyContent: 'center',
    padding: '16px 0',
  },
});

const validationSchema = yup.object({
  subject: yup.string()
    .required('Subject is required'),
  body: yup.string()
    .required('Message body is required'),
});

function ChplMessaging({ dispatch }) {
  const { queryParams, queryString } = useFilterContext();
  const [recordCount, setRecordCount] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const postMessage = usePostMessage();
  const postMessagePreview = usePostMessagePreview();
  const classes = useStyles();

  let formik;

  const { data, isError, isLoading } = useFetchDevelopersBySearch({
    orderBy: 'developer',
    pageNumber: 0,
    pageSize: 25,
    sortDescending: false,
    query: queryString(),
  });

  useEffect(() => {
    if (isLoading) { return; }
    if (isError || !data.results) {
      return;
    }
    if (isLoading || !data.results) { return; }
    setRecordCount(data.recordCount);
  }, [data?.results, data?.recordCount, isError, isLoading]);

  const sendMessage = () => {
    postMessage.mutate({
      subject: formik.values.subject,
      body: formik.values.body,
      query: queryParams(),
    }, {
      onSuccess: () => {
        enqueueSnackbar('Message queued', { variant: 'success' });
        dispatch();
      },
      onError: (error) => {
        const body = `An error occurred: ${error.response?.data?.error}`;
        enqueueSnackbar(body, { variant: 'error' });
      },
    });
  };

  const sendMessagePreview = () => {
    postMessagePreview.mutate({
      subject: formik.values.subject,
      body: formik.values.body,
      query: queryParams(),
    }, {
      onSuccess: () => {
        enqueueSnackbar('Message preview has been queued. Please check your email to verify formatting', { variant: 'success' });
      },
      onError: (error) => {
        const body = `An error occurred: ${error.response?.data?.error}`;
        enqueueSnackbar(body, { variant: 'error' });
      },
    });
  };

  formik = useFormik({
    validationSchema,
    initialValues: {
      subject: '',
      body: '',
    },
    onSubmit: () => {
      sendMessage();
    },
  });

  return (
    <>
      <div className={classes.pageHeader}>
        <Typography variant="h1">
          Messaging
        </Typography>
      </div>
      <div className={classes.pageBody} id="main-content" tabIndex="-1">
        <Container maxWidth="md">
          <Card>
            <CardContent
              className={classes.content}
            >
              <Typography variant="body1">
                Messaging
                {' '}
                { recordCount }
                {' '}
                developers
              </Typography>
              <ChplTextField
                id="subject"
                name="subject"
                label="Subject"
                required
                value={formik.values.subject}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.subject && !!formik.errors.subject}
                helperText={formik.touched.subject && formik.errors.subject}
              />
              <ChplTextField
                id="body"
                name="body"
                label="Message Body"
                margin="none"
                required
                multiline
                value={formik.values.body}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.body && !!formik.errors.body}
                helperText={formik.touched.body && formik.errors.body}
                minRows={4}
              />
            </CardContent>
          </Card>
        </Container>
        <Container maxWidth="md">
          <Card>
            <CardContent
              className={classes.content}
            >
              <Typography variant="h2">
                Markdown reference
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type ...</TableCell>
                    <TableCell>... to get</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell><pre>_Italic_</pre></TableCell>
                    <TableCell><i>Italic</i></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><pre>**Bold**</pre></TableCell>
                    <TableCell><b>Bold</b></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><pre># Heading 1</pre></TableCell>
                    <TableCell><h1>Heading 1</h1></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><pre>## Heading 2</pre></TableCell>
                    <TableCell><h2>Heading 2</h2></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><pre>[Link](http://www.example.com)</pre></TableCell>
                    <TableCell><a href="http://www.example.com">Link</a></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><pre>* List<br />* List<br />    * Put four spaces before the "*" to make a sub-bullet<br />* List</pre></TableCell>
                    <TableCell><ul><li>List</li><li>List</li><ul><li>Put four spaces before the "*" to make a sub-bullet</li></ul><li>List</li></ul></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><pre>1. One<br />2. Two<br />3. Three</pre></TableCell>
                    <TableCell><ol><li>One</li><li>Two</li><li>Three</li></ol></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><pre>A paragraph of text<br /><br />Followed by a blank line<br/><br/>To get multiple paragraphs</pre></TableCell>
                    <TableCell>A paragraph of text<br /><br />Followed by a blank line<br/><br/>To get multiple paragraphs</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><pre>From: (with two spaces at the end of the line)  <br />To put a newline in a paragraph</pre></TableCell>
                    <TableCell>From:<br />To put a newline in a paragraph</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Typography>
                For more information about formatting, please see:
                {' '}
                <ChplLink
                  href="https://commonmark.org/help/"
                />
              </Typography>
            </CardContent>
          </Card>
        </Container>
        <div className={classes.actionBarButtons}>
          <ButtonGroup
            color="primary"
          >
            <Button
              onClick={dispatch}
              variant="outlined"
              className={classes.actionBarButton}
              endIcon={<CloseOutlinedIcon />}
            >
              Cancel
            </Button>
            <Button
              onClick={sendMessagePreview}
              disabled={!formik.isValid}
              variant="outlined"
              className={classes.actionBarButton}
              endIcon={<SendIcon />}
            >
              Send Message Preview
            </Button>
            <Button
              onClick={formik.handleSubmit}
              disabled={!formik.isValid}
              variant="contained"
              className={classes.actionBarButton}
              endIcon={<SendIcon />}
            >
              Send Message
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </>
  );
}

export default ChplMessaging;

ChplMessaging.propTypes = {
  dispatch: func.isRequired,
};
