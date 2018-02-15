import React, { Component, } from 'react'
import { ScrollView, KeyboardAvoidingView, Alert, DeviceEventEmitter } from 'react-native'
import { Text, View, TouchableOpacity } from 'react-native-ui-lib'
import { Icon } from 'react-native-elements'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import Permissions from 'react-native-permissions'
import RNShakeEvent from 'react-native-shake-event';
import { autobind } from 'core-decorators'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react/native'
import { Images } from '../Themes'
import Utils from '../Lib/Utils'

var { RNLocation: Location } = require('NativeModules');


// Styles
import styles from './Styles/DashboardScreenStyle'

@inject('userStore')
@observer
@autobind
class DashboardScreen extends Component {

  @observable moving = false;
  @observable incident = true;
  @observable ready = false;
  @observable speed = 0;
  @observable shake = 0;
  @observable location = {
    speed: 0,
    longitude: 0.00,
    latitude: 0.00,
    accuracy: 0,
    heading: 0,
    altitude: 0,
    altitudeAccuracy: 0
  };

  constructor(props){
    super(props)
    this.store = this.props.userStore
    this._requestPermission()
  }

  componentWillMount() {
    this._requestPermission()
    RNShakeEvent.addEventListener('shake', () => {
      console.log('Device shake!');
          if(this.speed > 10 && this.moving && this.ready){
            this.incident = true
            this.store.sendIncidents(data)
          }
    });
    Location.startUpdatingLocation();

    var subscription = DeviceEventEmitter.addListener(
      'locationUpdated',
      (location) => {
          /* Example location returned
          {
            speed: -1,
            longitude: -0.1337,
            latitude: 51.50998,
            accuracy: 5,
            heading: -1,
            altitude: 0,
            altitudeAccuracy: -1
          }
          */
          this.speed = location.speed
          if(location.speed > 10){
            this.moving = true;
            this.incident = false;
            this.ready = true;
          }
          this.location = location
      }
    );
  }

  componentWillUnmount() {
    RNShakeEvent.removeEventListener('shake');
  }

  // Request permission to access photos
  _requestPermission = () => {
    Permissions.request('location').then(response => {
      // Returns once the user has chosen to 'allow' or to 'not allow' access
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      this.setState({ locationPermission: response })
    })
  }

  // Check the status of multiple permissions
  _checkCameraAndPhotos = () => {
    Permissions.checkMultiple(['photo', 'location']).then(response => {
      //response is an object mapping type to permission
      this.setState({
        notificationPermission: response.photo,
        locationPermission: response.location,
      })
    })
  }

  _alertForPhotosPermission() {
    Alert.alert(
      'Can we access your photos?',
      'We need access so you can set your profile pic',
      [
        {
          text: 'No way',
          onPress: () => console.log('Permission denied'),
          style: 'cancel',
        },
        this.state.photoPermission == 'undetermined'
          ? { text: 'OK', onPress: this._requestPermission }
          : { text: 'Open Settings', onPress: Permissions.openSettings },
      ],
    )
  }

  sendIncident(){
    this.store.sendIncidents(this.location)
  }

  render () {
    /*const {
      Accelerometer,
      Gyroscope,
    } = this.props;

    if (!Accelerometer || !Gyroscope) {
      // One of the sensors is still initializing
      return null;
    }*/

    return (
      <View style={styles.container}>
        <MapView
          style={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: 0 }}
          showsUserLocation={true}
          followsUserLocation={true}
          showsPointsOfInterest={true}
        />
        <View flex padding-10 spread>
          <View centerV top row spread padding-20 style={{ borderRadius: 90, minHeight: 80, backgroundColor: '#ffffff', elevation: 2 }}>
            <Text text20 dark10 style={{ fontWeight: 'bold' }}>{this.speed} MPH</Text>
            <Text text20 style={{ fontWeight: 'bold', color: this.ready && this.moving ? 'red': 'black' }}>
            {this.ready && this.moving ? 'ON': 'OFF'}
              </Text>
          </View>

          <View centerV centerH bottom style={{ borderRadius: 10, minHeight: 80 }}>
            <TouchableOpacity onPress={()=> this.sendIncident()}
              style={{ borderRadius: 30, backgroundColor: '#ffffff', elevation: 2, padding: 10 }}>
            <Icon name={'lightbulb-outline'} color={'red'} size={40} /></TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

export default DashboardScreen
