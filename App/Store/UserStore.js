import {Alert, AsyncStorage, NetInfo} from 'react-native'
import {observable, action, computed} from 'mobx'
import {autobind} from 'core-decorators'
import io from 'socket.io-client'
import feathers from '@feathersjs/client'
import socketio from '@feathersjs/socketio-client'
import SendSMS from 'react-native-sms'
import authentication from '@feathersjs/authentication-client'
const PLACEHOLDER = 'https://raw.githubusercontent.com/feathersjs/feathers-chat/master/public/placeholder.png';
const API_URL = 'https://soshealth.now.sh'

@autobind
class Store {

  @observable isAuthenticated = false
  @observable isConnecting = false
  @observable user = null
  @observable networkYes = false
  @observable messages = []
  @observable hasMoreMessages = false
  @observable skip = 0
  @observable sme = 'dhsgdhs hgsdhsgd'

  constructor() {
    const options = {transports: ['websocket'],
    forceNew: true }
    const socket = io(API_URL, options)

    this.app = feathers()
      .configure(socketio(socket))
      .configure(authentication({
        storage: AsyncStorage // To store our accessToken
      }));

    this.connect();

    this.app.service('messages').on('created', createdMessage => {
      this.messages.unshift(this.formatMessage(createdMessage));
    });

    this.app.service('messages').on('removed', removedMessage => {
      this.deleteMessage(removedMessage);
    });

    if (this.app.get('accessToken')) {
      this.isAuthenticated = this.app.get('accessToken') !== null;
    }

    const dispatchConnected = isConnected => this.networkYes = isConnected;

    NetInfo.isConnected.fetch().then().done(() => {
      NetInfo.isConnected.addEventListener('change', dispatchConnected);
    });
  }

  connect() {
    this.isConnecting = true;

    this.app.io.on('connect', () => {
      this.isConnecting = false;

      this.authenticate().then(() => {
        console.log('authenticated after reconnection');
      }).catch(error => {
        console.log('error authenticating after reconnection', error);
      });
    });

    this.app.io.on('disconnect', () => {
      console.log('disconnected');
      this.isConnecting = true;
    });
  }

  createAccount(firstname, lastname, email, password) {
    const userType = 'user'
    const userData = {firstname, lastname, email, password, userType};
    return this.app.service('users').create(userData).then((result) => {
      return this.authenticate(Object.assign(userData, {strategy: 'local'}))
    });
  }

  login(email, password) {
    const payload = {
      strategy: 'local',
      email,
      password
    };
    return this.authenticate(payload);
  }

  authenticate(options) {
    options = options ? options : undefined;
    return this._authenticate(options).then(user => {
      console.log('authenticated successfully', user._id, user.email);
      this.user = user;
      this.isAuthenticated = true;
      return Promise.resolve(user);
    }).catch(error => {
      console.log('authenticated failed', error.message);
      console.log(error);
      return Promise.reject(error);
    });
  }

  _authenticate(payload) {
    return this.app.authenticate(payload)
      .then(response => {
        return this.app.passport.verifyJWT(response.accessToken);
      })
      .then(payload => {
        return this.app.service('users').get(payload.userId);
      })
      .catch(e => Promise.reject(e));
  }

  promptForLogout() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel', onPress: () => {
        }, style: 'cancel'
        },
        {text: 'Yes', onPress: this.logout, style: 'destructive'},
      ]
    );
  }

  logout() {
    this.app.logout();
    this.skip = 0;
    this.messages = [];
    this.user = null;
    this.isAuthenticated = false;
  }

  loadMessages(loadNextPage) {
    let $skip = this.skip;

    const query = {query: {$sort: {createdAt: -1}, $skip}};

    return this.app.service('atom').find(query).then(response => {
      const messages = [];
      const skip = response.skip + response.limit;

      for (let message of response.data) {
        messages.push(message);
      }

      console.log('loaded messages from server', JSON.stringify(messages, null, 2));
      if (!loadNextPage) {
        this.messages = messages;
      } else {
        this.messages = this.messages.concat(messages);
      }
      this.skip = skip;
      this.hasMoreMessages = response.skip + response.limit < response.total;

    }).catch(error => {
      console.log(error);
    });
  }

  formatMessage(message) {
    return {
      _id: message._id,
      text: message.text,
      position: message.user._id.toString() === this.user._id.toString() ? 'left' : 'right',
      createdAt: new Date(message.createdAt),
      user: {
        _id: message.user._id ? message.user._id : '',
        name: message.user.email ? message.user.email : message.name,
        avatar: message.user.avatar ? message.user.avatar : PLACEHOLDER,
      }
    };
  }

  deleteMessage(messageToRemove) {
    let messages = this.messages;
    let idToRemove = messageToRemove.id ? messageToRemove.id : messageToRemove._id;

    messages = messages.filter(function (message) {
      return message.id !== idToRemove;
    });
    this.messages = messages;
  }

  sendMessage(messages = {}, rowID = null) {
    this.app.service('messages').create({text: messages[0].text}).then(result => {
      console.log('message created!');
    }).catch((error) => {
      console.log('ERROR creating message');
      console.log(error);
    });
  }



  sendIncidents(data) {
    let tempData = {
      ...data,
      owner: this.user._id
    }
    if(networkYes){
      this.app.service('atom').create(tempData).then(result => {
        console.log('Incident sent created!');
        Alert.alert('Send Incident', 'Incident sent');
      }).catch((error) => {
        console.log('ERROR creating message');
        console.log(error);
      });
    }else{
      SendSMS.send({
        body: JSON.stringify(tempData),
        recipients: ['0123456789'],
        successTypes: ['sent', 'queued']
      }, (completed, cancelled, error) => {
        console.log('SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error);
      });
    }
  }
}

export default userStore = new Store()
