/* 
* <license header>
*/

import React from 'react'
import {View, Heading} from '@adobe/react-spectrum'
import { NavLink } from 'react-router-dom'

function SideBar () {
  return (
    <View>
    <Heading>Storage Explorer</Heading>
    <ul className="SideNav">
      <li className="SideNav-item">
        <NavLink className="SideNav-itemLink" activeClassName="is-selected" 
          aria-current="page" to="/">Your App Actions</NavLink>
      </li>
      <li className="SideNav-item">
        <NavLink className="SideNav-itemLink" activeClassName="is-selected" 
          aria-current="page" to="/files">Files</NavLink>
      </li>
      <li className="SideNav-item">
        <NavLink className="SideNav-itemLink" activeClassName="is-selected" 
          aria-current="page" to="/cloud-state">Cloud State</NavLink>
      </li>
      <li className="SideNav-item">
        <NavLink className="SideNav-itemLink" activeClassName="is-selected" 
          aria-current="page" to="/about">About Project Firefly Apps</NavLink>
      </li>
    </ul>
    </View>
  )
}

export default SideBar
