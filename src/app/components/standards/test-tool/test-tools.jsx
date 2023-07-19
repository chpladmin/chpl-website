import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';

import ChplTestToolEdit from './test-tool-edit';
import ChplTestToolsView from './test-tools-view';

import {
  useFetchCriteria,
} from 'api/data';
import {
  useDeleteTestTool,
  useFetchRules,
  useFetchTestTools,
  usePostTestTool,
  usePutTestTool,
} from 'api/standards';
import { BreadcrumbContext } from 'shared/contexts';

function ChplTestTools() {
  const { append, display, hide } = useContext(BreadcrumbContext);
  const { data, isLoading, isSuccess } = useFetchTestTools();
  const deleteTestTool = useDeleteTestTool();
  const postTestTool = usePostTestTool();
  const putTestTool = usePutTestTool();
  const criterionOptionsQuery = useFetchCriteria();
  const rulesQuery = useFetchRules();
  const { enqueueSnackbar } = useSnackbar();
  const [activeTestTool, setActiveTestTool] = useState(undefined);
  const [criterionOptions, setCriterionOptions] = useState([]);
  const [rules, setRules] = useState([]);
  const [errors, setErrors] = useState([]);
  const [testTools, setTestTools] = useState([]);
  let handleDispatch;

  useEffect(() => {
    append(
      <Button
        key="testTools.viewall.disabled"
        depth={1}
        variant="text"
        disabled
      >
        Test Tools
      </Button>,
    );
    append(
      <Button
        key="testTools.viewall"
        depth={1}
        variant="text"
        onClick={() => handleDispatch({ action: 'cancel' })}
      >
        Test Tools
      </Button>,
    );
    display('testTools.viewall.disabled');
  }, []);

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setTestTools(data);
  }, [data, isLoading, isSuccess]);

  useEffect(() => {
    if (criterionOptionsQuery.isLoading || !criterionOptionsQuery.isSuccess) { return; }
    setCriterionOptions(criterionOptionsQuery.data.criteria);
  }, [criterionOptionsQuery.data, criterionOptionsQuery.isLoading, criterionOptionsQuery.isSuccess]);

  useEffect(() => {
    if (rulesQuery.isLoading || !rulesQuery.isSuccess) { return; }
    setRules(rulesQuery.data);
  }, [rulesQuery.data, rulesQuery.isLoading, rulesQuery.isSuccess]);

  handleDispatch = ({ action, payload }) => {
    switch (action) {
      case 'cancel':
        setActiveTestTool(undefined);
        display('testTools.viewall.disabled');
        hide('testTools.viewall');
        hide('testTools.add.disabled');
        hide('testTools.edit.disabled');
        break;
      case 'delete':
        setErrors([]);
        deleteTestTool.mutate(payload, {
          onSuccess: () => {
            enqueueSnackbar('Test Tool Deleted', {
              variant: 'success',
            });
            setActiveTestTool(undefined);
            display('testTools.viewall.disabled');
            hide('testTools.viewall');
          },
          onError: (error) => {
            setErrors(error.response.data.errorMessages);
          },
        });
        break;
      case 'edit':
        setActiveTestTool(payload);
        setErrors([]);
        display('testTools.viewall');
        hide('testTools.viewall.disabled');
        break;
      case 'save':
        setErrors([]);
        if (payload.id) {
          putTestTool.mutate(payload, {
            onSuccess: () => {
              enqueueSnackbar('Test Tool Updated', {
                variant: 'success',
              });
              setActiveTestTool(undefined);
              display('testTools.viewall.disabled');
              hide('testTools.viewall');
            },
            onError: (error) => {
              setErrors(error.response.data.errorMessages);
            },
          });
        } else {
          postTestTool.mutate(payload, {
            onSuccess: () => {
              enqueueSnackbar('Test Tool Created', {
                variant: 'success',
              });
              setActiveTestTool(undefined);
              display('testTools.viewall.disabled');
              hide('testTools.viewall');
            },
            onError: (error) => {
              setErrors(error.response.data?.errorMessages);
            },
          });
        }
        break;
        // no default
    }
  };

  if (activeTestTool) {
    return (
      <Card>
        <CardHeader title={`${activeTestTool.id ? 'Edit' : 'Add'} Test Tool`} />
        <CardContent>
          <ChplTestToolEdit
            testTool={activeTestTool}
            dispatch={handleDispatch}
            criterionOptions={criterionOptions}
            rules={rules}
            errors={errors}
          />
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <CircularProgress />
    );
  }

  return (
    <Card>
      <CardHeader title="Test Tool" />
      <CardContent>
        { (deleteTestTool.isLoading || postTestTool.isLoading || putTestTool.isLoading)
          && (
            <CircularProgress />
          )}
        <ChplTestToolsView
          testTools={testTools}
          dispatch={handleDispatch}
        />
      </CardContent>
    </Card>
  );
}

export default ChplTestTools;

ChplTestTools.propTypes = {
};
