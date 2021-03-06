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

const stateLib = require('@adobe/aio-lib-state')

const { errorResponse, stringParameters, checkMissingRequestInputs } = require('../utils')

/**
 * put a state key,value
 *
 * @param {object} params
 * @param {string} params.key key
 * @param {any} params.value value
 * @param {string} params.namespace params namespace
 * @param {string} [params.LOG_LEVEL=info] log level
 * @param {string} [params.ttl] state lib ttl option
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
    const requiredParams = ['key', 'value', 'owNamespace', 'owAuth']
    const requiredHeaders = ['Authorization']
    const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders)
    if (errorMessage) {
      // return and log client errors
      return errorResponse(400, errorMessage, logger)
    }

    const auth = params.owAuth
    const namespace = params.owNamespace

    let state, res
    try {
      state = await State.init({ ow: { auth, namespace } })
    } catch (e) {
      return errorResponse(403, 'unauthorized', logger)
    }

    const ttl = parseInt(params.ttl || '86400')
    try {
      res = await state.put(params.key, params.value, { ttl })
    } catch (e) {
      if (e.code === 'ERROR_PAYLOAD_TOO_LARGE') {
        return errorResponse(413, 'payload too large', logger)
      }
      // rethrow e
      throw e
    }

    const response = {
      statusCode: 200,
      body: { message: 'success', key: res, ttl  } // default is 24hours
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