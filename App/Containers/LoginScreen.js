import React, { Component } from 'react'
import { ScrollView, Keyboard, Alert, Image, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native'
import { autobind } from 'core-decorators'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react/native'
import { Text, View, Button, TextInput } from 'react-native-ui-lib'
import { Images } from '../Themes'
import Utils from '../Lib/Utils'

// Styles
import styles from './Styles/LoginScreenStyle'


@inject('userStore')
@observer
@autobind
class LoginScreen extends Component {

  static navigationOptions = ({navigation}) => ({
    title: 'Sign In',
  })

  @observable email = '';
  @observable password = '';
  @observable loading = false;

  constructor(props) {
    super(props)
    this.store = this.props.userStore
  }

  onChangeEmail(text) {
    this.email = text;
  }

  onChangePassword(text) {
    this.password = text;
  }

  login() {
    if (!Utils.validateEmail(this.email) || !Utils.validatePassword(this.password)) {
      Alert.alert('Error', 'Please enter a valid email or password.');
      return;
    }

    this.loading = true;
    this.store.login(this.email, this.password).catch(error => {
      this.loading = false;
      console.log('LOGIN', 'ERROR', JSON.stringify(error), error.message);
      Alert.alert('Error', 'Login failed, please check your login/password.');
    });
  }

  render () {
    if (this.loading) {
      return (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: 'white'}}>
          <Text style={{fontSize: 16}}>Signing in...</Text>
        </View>
      );
    }

    const commonInputProps = {
      style: [styles.input, styles.greyFont],
      underlineColorAndroid: 'transparent',
      placeholderTextColor: '#AAA',
      autoCorrect: false,
      autoCapitalize: 'none'
    };

    return (
      <ScrollView>
      <View flex>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />

        <View center marginT-50>
            <Image source={Images.launch} style={styles.logo} />
            <Text dark10 text50 marginT-40
              style={{fontFamily: 'sans-serif-bold', fontWeight: 'bold', marginTop: 30
            }}>Login</Text>
        </View>
        <View bottom flex padding-30>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View flex>
              <View style={styles.inputs}>
                <View style={styles.inputContainer}>
                  <TextInput
                    {...commonInputProps}
                    autoFocus={true}
                    placeholder='Email'
                    keyBoardType='email-address'
                    returnKeyType='next'
                    value={this.email}
                    onChangeText={this.onChangeEmail}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    {...commonInputProps}
                    secureTextEntry={true}
                    placeholder='Password'
                    returnKeyType='send'
                    value={this.password}
                    onChangeText={this.onChangePassword}
                  />
                </View>
                <View style={{height: 60}}>
                  <Button label='Login'
                          onPress={this.login}/>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
      </ScrollView>
    )
  }
}


export default LoginScreen
