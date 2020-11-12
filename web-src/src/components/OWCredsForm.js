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

const OWCredsForm = (props) => {
  const [state, setState] = useState({
    namespace: null,
    namespaceValid: null,
    auth: null,
    authValid: null
  })

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
            const authValid = /^[a-zA-Z0-9\-_:]+$/.test(input)
            const auth = (authValid && input) || null
            setState({ ...state, authValid, auth })
          }}
        />

        <Button variant='primary' maxWidth='100px' onPress={() => setCredentials(state.namespace, state.auth)}
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
  async function setCredentials (namespace, auth) {
    if (props.onCredentialsChange) {
      props.onCredentialsChange({
        namespace:namespace,
        auth:auth
      })
    }
  }
}

// cloudStateLoader.propTypes = {
//   onLoadingCloudStates: PropTypes.func,
//   onDoneLoadingCloudStates: PropTypes.func,
//   onReceivedCloudStates: PropTypes.func
// }

export default OWCredsForm
