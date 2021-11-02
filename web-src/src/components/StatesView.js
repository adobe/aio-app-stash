import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import actions from '../config.json'
import actionWebInvoke from '../utils'
import { View, Grid, Well, ListBox, Item, TextArea, Content } from '@adobe/react-spectrum'


const StatesView = (props) => {
  const [selectedCloudState, setSelectedCloudState] = useState(null)
  const [cloudStateKeys, setCloudStateKeys] = useState()

  useEffect(() => {
    console.log('using effect')
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
      actionWebInvoke(actions['state-list'], headers, params)
        .then((actionResponse) => {
          console.log('actionResponse: ', actionResponse)
          setCloudStateKeys(actionResponse.keys)
        })
        .catch((err) => {
          console.log('err: ', err)
          // setState({
          //   actionResponse: null,
          //   actionResponseError: err.message,
          //   actionInvokeInProgress: false
          // })
        })
    }
    return () => {
      // cleanup?
    }
  }, [props.owCreds])

  return (
    <Grid
      areas={['list well']}
      columns={['1fr', '3fr']}
      rows={['auto']}
      height='100vh'
      gap='size-100'
      alignItems='baseline'
    >
      <View
        gridArea='list'
        padding='size-100'
      >
        <ListBox
          aria-label='state keys'
          selectionMode='single'
          items={cloudStateKeys ? cloudStateKeys.map(k => ({ name: k.key })) : []}
          onSelectionChange={selectionSet => {
            const key = selectionSet.values().next().value
            if (key) {
              return getCloudState(props.ims, props.owCreds, key)
            }
            setSelectedCloudState(null)
          }}
        >
          {(item) => <Item key={item.name}>{item.name}</Item>}
        </ListBox>
      </View>
      <View
        gridArea='well'
        padding='size-100'
      >
        {selectedCloudState ? (
          <Content>
            <pre>
              {(JSON.stringify(selectedCloudState, '\n', 2))}
            </pre>
          </Content>
        ) : (
          <Content>please select a cloud state</Content>
        ) }
      </View>
    </Grid>
  )

  async function getCloudState(ims, owCreds, k) {
    // todo replace with progress
    const headers = {}
    const params = {
      owNamespace: owCreds.namespace,
      owAuth: owCreds.auth,
      key: k
    }
    if (ims) {
      // set the authorization header and org from the ims props object
      if (ims.token && !headers.authorization) {
        headers.authorization = `Bearer ${ims.token}`
      }
      if (ims.org && !headers['x-gw-ims-org-id']) {
        headers['x-gw-ims-org-id'] = ims.org
      }
      // // invoke backend action
      actionWebInvoke(actions['state-get'], headers, params)
        .then((actionResponse) => {
          // console.log('actionResponse: ', actionResponse)
          setSelectedCloudState({ ...actionResponse })
        })
        .catch((err) => {
          console.log('err: ', err)
          // setState({
          //   actionResponse: null,
          //   actionResponseError: err.message,
          //   actionInvokeInProgress: false
          // })
        })
    }
  }
}

// StatesView.propTypes = {
//   cloudStates: PropTypes.object,
//   runtimeCredentials: PropTypes.object
// }

export default StatesView

// todo caching
// todo multiline well
// todo delete + put
