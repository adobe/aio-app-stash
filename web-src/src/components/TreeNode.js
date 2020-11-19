
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
} from "react-icons/ai";

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

function TreeNode(props) {
  const [state, setState] = useState({
    isOpen: true
  })

  useEffect(() => {

  })

  const toggle = () => {
    setState({ isOpen: !state.isOpen })
  }

  const nodeTitle = (hasChildNodes, node, isOpen) => {
    if (hasChildNodes) {
        if (isOpen) {
            return (<span onClick={toggle}><AiOutlineFolderOpen size='32'/>&nbsp;&nbsp;{node.name}</span>)
        } else {
          return (<span onClick={toggle}><AiOutlineFolder size='32'/>&nbsp;&nbsp;{node.name}</span>)
        }
    } else {
      return detailsView(node)
    }
  }

  const showDetails = () => {
    if(props.onFileSelected) {
      props.onFileSelected(props.node)
    }
    console.log('showing details for : ', props)
  }

  const detailsView = (node) => {
    return (<span onClick={showDetails}>&nbsp;&nbsp;{node.name}</span>)
  }

  let childNodes;
  if (props.node.children != null) {
    childNodes = props.node.children.map(function (node, index) {
      return <li key={index}>
        <TreeNode node={node} onFileSelected={props.onFileSelected} activeClassName="is-selected"/>
      </li>
    });
  }
  return (
    <div>
      { nodeTitle(childNodes != null, props.node, state.isOpen)}
      { childNodes != null && state.isOpen &&
        <ul width="size-2400">
          {childNodes}
        </ul>
      }
    </div>
  )
}

export default TreeNode