import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { actionWebInvoke } from '../utils'

import { View, Grid, Well, ListBox, Item } from '@adobe/react-spectrum'

const CloudStateVisualizer = (props) => {
  const [selectedCloudState, setSelectedCloudState] = useState(null)
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
          items={props.cloudStates ? props.cloudStates.keys.map(k => ({ name: k.key })) : []}
          onSelectionChange={selectionSet => {
            const k = selectionSet.values().next().value
            if (k) {
              return getCloudState(props.runtimeCredentials, k)
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
        <Well>
          {(selectedCloudState && JSON.stringify(selectedCloudState, null, 2)) || 'please select a cloud state'}
        </Well>
      </View>
    </Grid>
  )

  async function getCloudState (runtimeCredentials, k) {
    // todo replace with progress
    console.log('getting cloud state', k)
    try {
      // invoke backend action
      const getResponse = await actionWebInvoke(
        'state-get',
        { authorization: runtimeCredentials.basicAuthHeader },
        { namespace: runtimeCredentials.namespace, key: k }
      )
      // store the response
      console.log('cloud state value', getResponse)
      setSelectedCloudState({ expiration: getResponse.expiration, value: getResponse.value })
    } catch (e) {
      console.error(e)
      setSelectedCloudState(e.message)
    }
  }
}

// CloudStateVisualizer.propTypes = {
//   cloudStates: PropTypes.object,
//   runtimeCredentials: PropTypes.object
// }

export default CloudStateVisualizer

// todo caching
// todo multiline well
// todo delete + put
