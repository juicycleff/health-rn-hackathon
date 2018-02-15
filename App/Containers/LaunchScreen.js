import React, { Component } from 'react'
import { ScrollView,  Image} from 'react-native'
import { Text, View, Button } from 'react-native-ui-lib'
import { autobind } from 'core-decorators';
import { Images } from '../Themes'

// Styles
import styles from './Styles/LaunchScreenStyles'
@autobind
export default class LaunchScreen extends Component {

  constructor (props) {
    super(props)
  }

  gotoLogin () {
    this.props.navigation.navigate('Login');
  }

  gotoRegister () {
    this.props.navigation.navigate('Signup');
  }

  render () {
    return (
      <View flex>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <View flex spread>
          <View center marginT-50>
            <Image source={Images.launch} style={styles.logo} />
            <Text dark10 text50 marginT-40
              style={{fontFamily: 'sans-serif-bold', fontWeight: 'bold', marginTop: 30
            }}>Welcome to HealthX</Text>
          </View>

          <View bottom margin-30>
            <Button
              label={'Get started'}
              enableShadow
              onPress={()=> this.gotoRegister()}
              outlineColor="#ffffff"
              labelStyle={{fontSize: 17, fontWeight: 'bold'}}
              style={{marginBottom: 20}} />
            <Button
              label={'Login'}
              link
              color={'#000000'}
              labelStyle={{fontSize: 17, fontWeight: 'bold'}}
              onPress={()=> this.gotoLogin()} />
          </View>

        </View>
      </View>
    )
  }
}
