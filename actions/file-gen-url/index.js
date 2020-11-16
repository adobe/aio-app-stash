

const fetch = require('node-fetch')
const filesLib = require('@adobe/aio-lib-files')
const { Core } = require('@adobe/aio-sdk')

const { errorResponse, getBearerToken, stringParameters, checkMissingRequestInputs } = require('../utils')


async function main (params) {
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  try {
    logger.debug(stringParameters(params))

    // check for missing request input parameters and headers
    const requiredParams = ['owNamespace', 'owAuth']
    const requiredHeaders = ['Authorization']
    const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders)
    if (errorMessage) {
      // return and log client errors
      return errorResponse(400, errorMessage, logger)
    }

    const filePath = params.path
    
    const expiry = params.expiryInSeconds || 120
    const oneDay = (24 * 60 * 60)
    if( expiry < 2 || expiry > oneDay ) {
      return errorResponse(400, `expiryInSeconds expected to be between 2 and ${oneDay} seconds`, logger)
    }

    // extract the user Bearer token from the Authorization header
    const token = getBearerToken(params)
    const auth = params.owAuth
    const namespace = params.owNamespace

    const files = await filesLib.init({ ow: { namespace, auth } })  
    const permissions = cleanPermissions
    const preSignUrl = await files.generatePresignURL(filePath, {expiryInSeconds: expiry, permissions})

    const response = {
      statusCode: 200,
      body: { message: 'success', preSignUrl }
    }

    return response

  } catch (error) {
    // log any server errors
    logger.error(error)
    // return with 500
    return errorResponse(500, error.message, logger)
  }
}

exports.main = main
