
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import ErrorBoundary from 'react-error-boundary'
import NotFound from '@spectrum-icons/illustrations/NotFound'
import {
  Flex,
  Grid,
  Heading,
  Content,
  ProgressCircle,
  IllustratedMessage,
  Text,
  View
} from '@adobe/react-spectrum'
import TreeNode from './TreeNode'
import actions from '../config.json'
import actionWebInvoke from '../utils'
import FileDetailsView from './FileDetailsView'
// import FileTree from './FileTree'

function FilesView(props) {

  const [state, setState] = useState({
    actionResponse: null,
    actionResponseError: null,
    actionInvokeInProgress: true,
    selectedFile: null
  })
  
  useEffect(() => {
    const headers = {}
    const params = {
      owNamespace: props.owCreds.namespace,
      owAuth: props.owCreds.auth
    }
    
    if (props.ims) {
      // set the authorization header and org from the ims props object
      if (props.ims.token && !headers.authorization) {
        headers.authorization = `Bearer ${props.ims.token}`
      }
      if (props.ims.org && !headers['x-gw-ims-org-id']) {
        headers['x-gw-ims-org-id'] = props.ims.org
      }
      // // invoke backend action
      actionWebInvoke(actions['aioappstash-0.0.1/file-list'], headers, params)
        .then((actionResponse) => {
          console.log('actionResponse: ', actionResponse)
          setState({
            actionResponse,
            actionResponseError: null,
            actionInvokeInProgress: false
          })
        })
        .catch((err) => {
          console.log('err: ', err)
          setState({
            actionResponse: null,
            actionResponseError: err.message,
            actionInvokeInProgress: false
          })
        })
    }
  }, [props])

    const onFileSelected = (file) => {
      console.log('onFileSelected ', file)
      setState({...state, selectedFile:file})
    }

  return (
    <View width="size-6000">
      <Heading level={1}>Files</Heading>
      {state.actionInvokeInProgress && (
        <Flex>
          <ProgressCircle
            aria-label="loading"
            isIndeterminate
            isHidden={!state.actionInvokeInProgress}
            marginStart="size-100"
          />
        </Flex>
      )}
      {state.actionResponseError && (
        <IllustratedMessage height='80vh'
        width='80vw' justifySelf='flex-start'>
          <NotFound />
          <Heading>Failure! No results.</Heading>
          <Content>
          <Text>
            {state.actionResponseError}
            </Text>
          </Content>
        </IllustratedMessage>
      )}
      {!state.actionError && state.actionResponse && (
        <Grid areas={['tree details']}
          columns={['1fr', '1fr']}
          rows={['auto']}
          height='80vh'
          width='80vw'
          gap='size-100'>
        <View overflow="scroll" 
            borderColor="celery-700" 
            gridArea='tree'  
            borderWidth="thin">
          <TreeNode node={state.actionResponse.fileTree[0]} onFileSelected={onFileSelected}/>
          <TreeNode node={state.actionResponse.fileTree[1]} onFileSelected={onFileSelected}/>
          
          {/* <FileTree data={state.actionResponse.fileTree[0]}/> */}
          {/* <table cellSpacing="4" cellPadding="4" width="100%">
          <thead>
            <td>Name</td>
            <td>Size (bytes)</td>
            <td>MIME type</td>
            <td>Created</td>
            <td>Modified</td>
          </thead>
          <tbody>
        { state.actionResponse.fileList.map( (file) => {
          return (<tr key={file.name}>
            <td>{file.name}</td>
            <td>{file.contentLength}</td>
            <td>{file.contentType}</td>
            <td>{timeSince(file.creationTime)}</td>
            <td>{timeSince(file.lastModified)}</td>
            </tr>
            )
        })}
        </tbody>
        </table> */}
        </View>
        <View borderColor="magenta-700" >
          <FileDetailsView selectedFile={state.selectedFile}/>
        </View>
        </Grid>
      )}
    </View>
  )
}

FilesView.propTypes = {
  runtime: PropTypes.any,
  ims: PropTypes.any
}

export default FilesView

