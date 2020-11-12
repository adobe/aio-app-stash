

const fetch = require('node-fetch')
const { Core } = require('@adobe/aio-sdk')
const filesLib = require('@adobe/aio-lib-files')

const { errorResponse, getBearerToken, stringParameters, checkMissingRequestInputs } = require('../utils')


async function main (params) {
  const logger = console // Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

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

    const filePath = params.path || '/'

    // extract the user Bearer token from the Authorization header
    const token = getBearerToken(params)
    const auth = params.owAuth
    const namespace = params.owNamespace

    const files = await filesLib.init({ ow: { namespace, auth } })  
    // generate some files

    // const fileName = Math.random().toString(36).substring(2,15)
    // await files.write(`dir/${param}.txt`, 'some private content')
    // await files.write(`public/${param}.html`, '<h1>I am public!</h1>')
  
    const pathList = await files.list(filePath)
    console.log("pathList = ", pathList)

    let fileTree = [];
    let level = {fileTree};
    pathList.forEach(fileInfo => {
      console.log('fileInfo: ', fileInfo)
      const pathParts = fileInfo.name.split('/')
      const fileName = pathParts.slice().pop()
      pathParts.reduce((r, name, i, a) => {
        if(!r[name]) {
          r[name] = {fileTree: []}
          let newFileNode = { name, children: r[name].fileTree }
          if (i === a.length - 1 ) { 
            // leaf node, just put the whole object here
            newFileNode = fileInfo
            newFileNode.basename = name
          }
          r.fileTree.push(newFileNode)
        }
        return r[name]
      }, level)
    })

    // keyed-tree component expects certain values ( key, modified, size)
    const fileList = pathList.map(fileInfo => {
      const item = { 
        key: fileInfo.name,
        modified: new Date(fileInfo.lastModified).getTime(),
        size: fileInfo.contentLength,
        ...fileInfo }
      return item
    })

    const response = {
      statusCode: 200,
      body: { message: 'success', fileList, fileTree }
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
