import React, { Component } from 'react'
import { ScrollView, Keyboard, Alert, Image, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native'
import { autobind } from 'core-decorators'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react/native'
import { Text, View, Button, TextInput } from 'react-native-ui-lib'
import { Images } from '../Themes'
import Utils from '../Lib/Utils'

// Styles
import styles from './Styles/RegisterScreenStyle'

@inject('userStore')
@observer
@autobind
export default class RegisterScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Sign In',
  })

  @observable email = '';
  @observable firstname = '';
  @observable lastname = '';
  @observable password = '';
  @observable loading = false;

  constructor(props) {
    super(props)
    this.store = this.props.userStore
  }

  onChangeEmail(text) {
    this.email = text;
  }

  onChangeFirstname(text) {
    this.firstname = text;
  }


  onChangeLastname(text) {
    this.lastname = text;
  }


  onChangePassword(text) {
    this.password = text;
  }

  register() {
    if (!Utils.validateEmail(this.email) || !Utils.validatePassword(this.password)) {
      Alert.alert('Please enter a valid email or password.');
      return;
    }

    this.loading = true;
    this.store.createAccount(this.firstname, this.lastname, this.email, this.password).catch(error => {
      console.log(error);
      Alert.alert('Error', 'Please enter a valid email or password.');
      this.loading = false;
    });
  }

  render () {

    if (this.loading) {
      return (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: 'white'}}>
          <Text style={{fontSize: 16}}>Signing up...</Text>
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
      <View flex>
      <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
            <View center marginT-50>
                <Text dark10 text50 marginT-40
                  style={{fontFamily: 'sans-serif-bold', fontWeight: 'bold', marginTop: 30
                }}>Regsiter with Healthx</Text>
            </View>
            <View bottom flex padding-30>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View flex>
                  <View style={styles.inputs}>
                  <View style={styles.inputContainer}>
                      <TextInput
                        {...commonInputProps}
                        autoFocus={true}
                        placeholder='Fistname'
                        keyBoardType='email-address'
                        returnKeyType='next'
                        value={this.firstname}
                        onChangeText={this.onChangeFirstname}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <TextInput
                        {...commonInputProps}
                        placeholder='Lastname'
                        keyBoardType='email-address'
                        returnKeyType='next'
                        value={this.lastname}
                        onChangeText={this.onChangeLastname}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <TextInput
                        {...commonInputProps}
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
                        placeholder='Password'
                        returnKeyType='send'
                        value={this.password}
                        onChangeText={this.onChangePassword}
                      />
                    </View>
                    <View style={{height: 60}}>
                      <Button label='Create Account Now'
                              onPress={this.register}/>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
    )
  }
}
