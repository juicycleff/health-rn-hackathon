import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import { MainNavigator, UnauthenticatedNavigator } from '../Navigation/AppNavigation'
import { inject, observer } from 'mobx-react';
import StartupActions from '../Redux/StartupRedux'
import { addNavigationHelpers } from 'react-navigation'

// Styles
import styles from './Styles/RootContainerStyles'
@inject('navigationStore', 'userStore')
@observer
class RootContainer extends Component {
  constructor(props, context) {
    super(props, context)
    this.nav = this.props.navigationStore
    this.store = this.props.userStore
  }
  componentDidMount () {

  }

  render () {
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle='light-content' />
        {this.store.isAuthenticated ?
          <MainNavigator screenStore={this.store} /> :
          <UnauthenticatedNavigator screenStore={this.store}/>}
      </View>
    )
  }
}

export default RootContainer
