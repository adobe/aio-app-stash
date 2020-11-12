
import React, { useState } from 'react'
import { Provider, defaultTheme, Grid, View, Flex, Divider, Heading } from '@adobe/react-spectrum'
import ErrorBoundary from 'react-error-boundary'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import SideBar from './SideBar'
import ActionsForm from './ActionsForm'
import { About } from './About'
import FilesView from './FilesView'
import OWCredsForm from './OWCredsForm'

import CloudStateLoader from './CloudStateLoader'
import CloudStateVisualizer from './CloudStateVisualizer'

function App (props) {
  const [owCreds, setOwCreds] = useState({
    namespace:'',
    auth:''
  })

  // use exc runtime event handlers
  // respond to configuration change events (e.g. user switches org)
  props.runtime.on('configuration', ({ imsOrg, imsToken, locale }) => {
    // console.log('configuration change', { imsOrg, imsToken, locale })
  })
  // respond to history change events
  props.runtime.on('history', ({ type, path }) => {
    // console.log('history change', { type, path })
  })

  const onCredsChange = (creds) => {
    setOwCreds({namespace:creds.namespace, auth: creds.auth})
    console.log('credentials changed ', creds)
  }

  return (
    <ErrorBoundary onError={onError} FallbackComponent={fallbackComponent}>
      <Router>
        <Provider theme={defaultTheme} colorScheme={`light`}>
          <Grid areas={['sidebar content']}
            columns={['256px', '1fr']}
            rows={['auto']}
            height='100vh'
            width='100vw'
            gap='size-100'>
            <View backgroundColor='gray-200' gridArea='sidebar' padding="size-250">
              <Flex direction="column"
                alignItems="start"
                columnGap="size-100">
                <SideBar></SideBar>
                <Divider size="M" />
                <OWCredsForm onCredentialsChange={onCredsChange} />
                <Divider size="M" />
              </Flex>
            </View>
            <View gridArea='content' padding='size-200'>
              <Switch>
                <Route exact path='/'>
                  <ActionsForm runtime={props.runtime} ims={props.ims} />
                </Route>
                <Route path='/files'>
                  <FilesView owCreds={owCreds} runtime={props.runtime} ims={props.ims}></FilesView>
                </Route>
                <Route path='/cloud-state'>
                  <CloudStateVisualizer runtime={props.runtime} ims={props.ims} />
                </Route>
                <Route path='/about'>
                  <About></About>
                </Route>
              </Switch>
            </View>
          </Grid>
        </Provider>
      </Router>
    </ErrorBoundary>
  )

  // Methods

  // error handler on UI rendering failure
  function onError (e, componentStack) { }

  // component to show if UI fails rendering
  function fallbackComponent ({ componentStack, error }) {
    return (
      <React.Fragment>
        <h1 style={{ textAlign: 'center', marginTop: '20px' }}>
          Something went wrong :(
        </h1>
        <pre>{componentStack + '\n' + error.message}</pre>
      </React.Fragment>
    )
  }
}

export default App
