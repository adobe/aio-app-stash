/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const State = require('@adobe/aio-lib-state')
const Logger = require('@adobe/aio-lib-core-logging')

const { errorResponse, stringParameters, checkMissingRequestInputs } = require('../utils')

function getExpiration (ttl, ts) {
  if (ttl < 0) {
    return null
  }
  return new Date(ts * 1000 + ttl * 1000).toISOString()
}

/**
 * @param {object} params
 * @param {string} params.query query string
 * @param {string} [params.continuationToken] page number
 * @param {string} params.namespace params namespace
 * @param {string} [params.LOG_LEVEL=info] log level
 * @returns
 */
async function main (params) {

  // create a Logger
  const logger = Logger('main', { level: params.LOG_LEVEL || 'info' })

  try {
    // 'info' is the default level if not set
    logger.info('Calling the put action')

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(params))

    // check for missing request input parameters and headers
    const requiredParams = ['owNamespace', 'owAuth']
    const requiredHeaders = ['authorization']
    const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders)
    if (errorMessage) {
      // return and log client errors
      return errorResponse(400, errorMessage, logger)
    }

    const auth = params.owAuth
    const namespace = params.owNamespace

    let state
    try {
      state = await State.init({ ow: { auth, namespace } })
    } catch (e) {
      return errorResponse(403, 'unauthorized', logger)
    }

    // todo inject query string
    // todo handle continuation Token
    const queryPlan = state._cosmos.container.items.query(`SELECT c.id,c.ttl,c._ts from c where c.partitionKey='${state._cosmos.partitionKey}'`, {
      initialHeaders: {
        'x-ms-documentdb-partitionkey': `["${state._cosmos.partitionKey}"]`
      },
      continuationToken: params.continuationToken
    })
    const queryRes = await queryPlan.fetchNext()
    const res = queryRes.resources.map(x => ({ key: x.id, expiration: getExpiration(x.ttl, x._ts) }))

    const response = {
      statusCode: 200,
      // todo check the continuation token
      body: {
        message: 'success',
        keys: res,
        hasMoreResults: queryRes.hasMoreResults,
        continuationToken: queryPlan.continuationToken
      } // default is 24hours
    }

    // log the response status code
    logger.info(`${response.statusCode}: successful request`)
    return response
  } catch (error) {
    // log any server errors
    logger.error(error)
    // return with 500
    return errorResponse(500, 'server error', logger)
  }
}

exports.main = main
