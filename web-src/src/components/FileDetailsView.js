
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { ActionButton,
  Dialog,
  Heading,
  Header,
  Content,
  DialogTrigger,
  ListBox,
  Item,
  View,
  Text,
  Tooltip,
  TooltipTrigger,
  Divider,
  Flex,
  Tree,
  Well } from '@adobe/react-spectrum'
import {
  AiOutlineFolderAdd,
  AiOutlineFileAdd,
  AiOutlineFile,
  AiOutlineFolder,
  AiOutlineFolderOpen,
  AiOutlineDelete,
  AiOutlineEdit,
} from "react-icons/ai"

function timeSince(_date) {
  let date = new Date(_date).getTime()
  let seconds = Math.floor((new Date() - date) / 1000)
  switch (true) {
    case seconds < 60:
      return seconds + ' seconds ago'
    case seconds < (60 * 60):
      return Math.floor(seconds / 60) + ' minutes ago'
    case seconds < (60 * 60 * 24):
      return Math.floor(seconds / 60 / 60) + ' hours ago'
    default:
      return Math.floor(seconds / 60 / 60 / 24) + ' days ago'
  }
}

function FileDetailsView(props) {

  const [state, setState] = useState({
    selectedFile: props.selectedFile
  })

  
  if (props.selectedFile ) {
    return (
      <Content>
      {/* <View>path: { props.selectedFile.name }</View>
      <View>size: { props.selectedFile.contentLength} bytes</View>
      <View>created: {timeSince(props.selectedFile.creationTime)}</View>
      <View>modified: {timeSince(props.selectedFile.lastModified)}</View>
      <View>etag: {props.selectedFile.etag}</View>
      <View>contentType: {props.selectedFile.contentType}</View> */}
      <pre>{JSON.stringify(props.selectedFile, '\n', 4)}</pre>
    </Content>
    )
  } else {
    return (
      <Content>No file selected</Content>
    )
  }
}
    
export default FileDetailsView

