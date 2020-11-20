import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { actionWebInvoke } from '../utils'

import {
  Heading,
  Form,
  Button,
  Text,
  View, TextField
} from '@adobe/react-spectrum'

const OWCredsForm = (props) => {

  let initialState = {
    namespaceValid:false,
    authValid:false,
    namespace:'',
    auth:''
  }
  if(props.owCreds) {
    initialState = {
      namespace: props.owCreds.namespace ,
      namespaceValid: /^[a-z0-9\-_]{3,63}$/.test(props.owCreds.namespace),
      auth: props.owCreds.auth,
      authValid: /^[a-zA-Z0-9\-_:]+$/.test(props.owCreds.auth)
    }
  }
  const [state, setState] = useState(initialState)

  return (
    <View>
      <Heading level={3}>Credentials</Heading>
      <Form necessityIndicator='label'>
        <TextField
          maxWidth='size-2400'
          necessityIndicator='icon'
          isRequired
          label='namespace'
          placeholder='namespace'
          validationState={state.namespaceValid}
          value={state.namespace}
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
          value={state.auth}
          onChange={(input) => {
            const authValid = /^[a-zA-Z0-9\-_:]+$/.test(input)
            const auth = (authValid && input) || null
            setState({ ...state, authValid, auth })
          }}
        />

        <Button variant='secondary' maxWidth='100px'
          onPress={() => setCredentials('', '')}
          isDisabled={!(state.auth || state.namespace)}>Clear</Button>
        <Button variant='primary' maxWidth='100px'
          onPress={() => setCredentials(state.namespace, state.auth)}
          isDisabled={!(state.authValid && state.namespaceValid)}>Connect</Button>
      </Form>


      {state.listResponseError && (
        <View backgroundColor='negative' padding='size-50' maxWidth='size-2500' marginTop='size-100' marginBottom='size-100' borderRadius='small'>
          <Text>{state.listResponseError}</Text>
        </View>
      )}
    </View>
  )

  async function setCredentials (namespace, auth) {
    if (props.onCredentialsChange) {
      props.onCredentialsChange({
        namespace:namespace,
        auth:auth
      })
    }
    setState({ namespace,
      namespaceValid: /^[a-z0-9\-_]{3,63}$/.test(namespace),
      auth,
      authValid: /^[a-zA-Z0-9\-_:]+$/.test(auth) })
  }
}

export default OWCredsForm
