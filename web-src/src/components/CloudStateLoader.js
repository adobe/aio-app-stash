import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { actionWebInvoke } from '../utils'

import {
  Heading,
  Form,
  Button,
  Text,
  View, TextField
} from '@adobe/react-spectrum'

const cloudStateLoader = (props) => {
  const [state, setState] = useState({
    actionSelected: null,
    listResponse: null,
    listResponseError: null,
    namespace: null,
    namespaceValid: null,
    auth: null,
    authValid: null,
    listingInProgress: false
  })

  return (
    <View>
      <Heading level={3}>Adobe I/O Runtime credentials</Heading>
      <Form necessityIndicator='label'>
        <TextField
          maxWidth='size-2400'
          necessityIndicator='icon'
          isRequired
          label='namespace'
          placeholder='namespace'
          validationState={state.namespaceValid}
          onChange={(input) => {
            // todo check regex
            const namespaceValid = /^[a-z0-9\-_]{3,63}$/.test(input)
            const namespace = (namespaceValid && input) || null
            setState({ ...state, namespaceValid, namespace })
          }}
        ></TextField>

        <TextField
          maxWidth='size-2400'
          necessityIndicator='icon'
          isRequired
          label='auth'
          placeholder='auth'
          validationState={state.authValid}
          onChange={(input) => {
            // todo hide the input as pwd!
            // todo check regex
            const authValid = /^[a-zA-Z0-9\-_:]+$/.test(input)
            const auth = (authValid && input) || null
            setState({ ...state, authValid, auth })
          }}
        />

        <Button variant='primary' maxWidth='100px' onPress={() => listCloudState(state.namespace, state.auth)}
          isDisabled={!(state.authValid && state.namespaceValid)}>Connect</Button>
      </Form>

      {state.listResponseError && (
        <View backgroundColor='negative' padding='size-50' maxWidth='size-2500' marginTop='size-100' marginBottom='size-100' borderRadius='small'>
          <Text>{state.listResponseError}</Text>
        </View>
      )}
    </View>
  )

  // invokes a the selected backend actions with input headers and params
  async function listCloudState (namespace, auth) {
    if (props.onCredentialsChange) {
      props.onCredentialsChange({
        namespace:namespace,
        auth:auth
      })
    }
    return

    if (props.onLoadingCloudStates) {
      props.onLoadingCloudStates()
    }
    const basicAuthHeader = 'Basic ' + Buffer.from(auth).toString('base64')
    try {
      // invoke backend action
      const listResponse = await actionWebInvoke(
        'state-list',
        { authorization: basicAuthHeader },
        { namespace }
      )
      // store the response
      setState({
        ...state,
        listResponse,
        listResponseError: null
      })
      props.onReceivedCloudStates(listResponse, { namespace, basicAuthHeader })
    } catch (e) {
      // log and store any error message
      setState({
        ...state,
        listResponse: null,
        listResponseError: e.message
      })
    } finally {
      if (props.onDoneLoadingCloudStates) {
        props.onDoneLoadingCloudStates()
      }
    }
  }
}

cloudStateLoader.propTypes = {
  onLoadingCloudStates: PropTypes.func,
  onDoneLoadingCloudStates: PropTypes.func,
  onReceivedCloudStates: PropTypes.func
}

export default cloudStateLoader
