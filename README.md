# aio-app-stash

App Stash is a FireFly app that provides a Files and State browser for your FireFly application.
Enter your credentials to connect to your application deployment and navigate your public + private file store, and observe what keys/values are being stored in state store.

This app provides a sample implementation to most of the FilesSDK and StateSDK
... as documented here:

- [FilesSDK](https://github.com/adobe/aio-lib-files)
- [StateSDK](https://github.com/adobe/aio-lib-state)



## Setup

This project is deployed, for those with access:

Project integration and namespace credentials stored in: 
- https://console.adobe.io/projects/23294/4566206088344577836/overview

Currently, the action code depends on a specific branch of the @adobe/aio-lib-files

  https://github.com/purplecabbage/aio-lib-files/tree/file-info

You will need to check it out locally and npm link it for this to work.

    npm i
    npm link
    cd ../aio-app-stash
    npm link @adobe/aio-lib-file

