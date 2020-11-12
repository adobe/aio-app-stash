

const fetch = require('node-fetch')
const filesLib = require('@adobe/aio-lib-files')
const { Core } = require('@adobe/aio-sdk')

const { errorResponse, getBearerToken, stringParameters, checkMissingRequestInputs } = require('../utils')


async function main (params) {
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  try {
    logger.debug(stringParameters(params))

    // check for missing request input parameters and headers
    const requiredParams = ['owNamespace', 'owAuth', 'path', 'data']
    const requiredHeaders = ['Authorization']
    const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders)
    if (errorMessage) {
      // return and log client errors
      return errorResponse(400, errorMessage, logger)
    }

    // extract the user Bearer token from the Authorization header
    const token = getBearerToken(params)
    const auth = params.owAuth
    const namespace = params.owNamespace

    const files = await filesLib.init({ ow: { namespace, auth } })  
    const result = await files.write(params.path, params.data)

    const response = {
      statusCode: 200,
      body: { message: 'success', result }
    }

    return response

  } catch (error) {
    // log any server errors
    logger.error(error)
    // return with 500
    return errorResponse(500, 'server error', logger)
  }
}

exports.main = main
