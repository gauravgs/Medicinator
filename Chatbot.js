import React, { Component, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  Text,
  FlatList,
  StatusBar,
  SafeAreaView,
  SectionList,
  Linking,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import Tts from 'react-native-tts';
import Modal from 'react-native-modal';
import MultiSelect from 'react-native-multiple-select';
import { GiftedChat, Message } from 'react-native-gifted-chat';
import { Bubble } from 'react-native-gifted-chat';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const BOT_USER = {
  _id: 2,
  name: 'MedBot',
  avatar: require('./assets/chatBot.png'),
};

var welcomeText = 'Welcome to Medicinator! How can I help you today?';

class Chatbot extends Component {
  constructor(props) {
    super(props);
    this.props=props;
    this.state = {
      messages: [
        {
          _id: 1,
          text: welcomeText,
          user: BOT_USER,
          createdAt: new Date(),
        },
      ],
      nextContext: 'welcome',
      isVisible: false,
      selectedItems: [],
    };

    this.generateResponses = this.generateResponses.bind(this);
    // this.renderCustomView = this.renderCustomView.bind(this);

    this.intent = '';

    this.drugName = '';
    this.id = 2;
    this.userMessages = [];
    this.custom = false;
    this.noalternate = 'No Alternate Found in Database';
    this.savedModel = null;

    this.generateResponses=this.generateResponses.bind(this);
    this.onSend=this.onSend.bind(this);
    this.setResponse=this.setResponse.bind(this);
  }

  // findAlternates(drugName) {
  //     for (var i = 0; i < alternateDrugs.length; i++) {
  //         var obj = alternateDrugs[i];
  //         var drugs = obj.drugs;

  //         if (drugs.includes(drugName)) {
  //             var index = drugs.indexOf(drugName);
  //             console.log("returned");
  //             return drugs;
  //         }
  //     }
  //     return [this.noalternate];
  // }
  onSelectedItemsChange = (selectedItems) => {
    this.setState({ selectedItems });
  };

  async generateResponses(query) {
    var result;
    let apiCall = 'https://medicinator.herokuapp.com/getResponse?object=';
    console.log(query);
    if (this.state.nextContext === 'medicine.alternate') {
      apiCall = 'https://medicinator.herokuapp.com/getAlternate?object=';
    } else if (this.state.nextContext === 'diagnosis.start') {
      apiCall = 'https://medicinator.herokuapp.com/getResponse?object=';
      this.setState({ isVisible: false });
    } else if (this.state.nextContext === 'doctor.find') {
      // console.log('Context is ' + this.state.nextContext);
      apiCall = 'https://medicinator.herokuapp.com/findDoctor?object=';
    } else if (this.state.nextContext === 'ambulance.find') {
      // alert('Context is ' + this.state.nextContext);
      apiCall = 'https://medicinator.herokuapp.com/findAmbulance?object=';
    } else if (this.state.nextContext === 'covid.stats') {
      // alert('Context is ' + this.state.nextContext);
      apiCall = 'https://medicinator.herokuapp.com/findCovidStats?object=';
    } else {
      apiCall = 'https://medicinator.herokuapp.com/getResponse?object=';
    }

    await fetch(
      apiCall +
      '{"intent":' +
      '"' +
      this.state.nextContext +
      '"' +
      ', "query":' +
      '"' +
      query +
      '"' +
      '}',
      {
        method: 'GET',
      },
    )
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('Fetch response======>\t', responseJson);
        result = responseJson.response.toString();
        console.log(responseJson.intent + 'PUSHED TO STATE');
        this.setState({
          nextContext: responseJson.intent,
        });
        this.intent=responseJson.intent;
      })
      .catch((error) => {
        console.error(error);
      });

    return result;
  }

  async onSend(messages = []) {
    //capture query
    console.log(messages);
    this.userMessages.push(messages[0].text);
    this.setState((prvState) => ({
      messages: GiftedChat.append(prvState.messages, messages),
    }));

    let message = messages[0].text;
    let answer = await this.generateResponses(message);
    console.log('Intent' + answer);

    // for (var i = 0; i < this.userMessages.length; i++) {
    //     if (this.userMessages[i].toLowerCase().includes("alternative") || this.userMessages[i].toLowerCase().includes("medicine") || this.userMessages[i].toLowerCase().includes("alternate") || this.userMessages[i].includes("दवा") || this.userMessages[i].includes("वैकल्पिक")) {
    //         this.drugName = message.split(" ");
    //         console.log("------------------>" + this.drugName[1]);
    //         this.drugName = this.drugName[this.drugName.length - 1];
    //     }
    // }

    // console.log("drugname" + this.drugName);

    this.setResponse(answer);
    console.log(answer + ' from onsend');
    console.log("props == >");
    console.log(this.props.navigation);
  }

  setResponse(text, intent) {
    //set response of bot

    console.log('response text=' + text);

    this.id = this.state.messages.length + 1;
    let message = {
      _id: this.id + 1,
      text,
      createdAt: new Date(),
      user: BOT_USER,
    };

    this.setState((prvState) => ({
      messages: GiftedChat.append(prvState.messages, [message]),
    }));
    Tts.speak(text).catch((e) => {
      alert(`Can't Play Audio at the moment! 🙄`);
    });

    if (this.intent === 'diagnosis.start') {
      Alert.alert('Confirm',
        'Do you want to start disease prediction?',
        [
          {
            text: 'Yes, please!',
            onPress: () => {
              this.props.navigation.navigate('PredictDisease');
              this.setState({ isVisible: true });
            }
          },
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          }
        ]);
    }
  }

  componentDidMount() {
    console.log('\n\n\n\n\nVOICES*****************************');
    Tts.getInitStatus().then(() => {
      Tts.speak('Welcome to Medicinator! How can I help you today?').catch(
        (e) => {
          alert(`Can't Play Audio🔊 at the moment! 🙄`);
        },
      );
    });
    // Tts.voices().then((voices) => console.log(voices));
    Tts.setDucking(true);
    Tts.setDefaultLanguage('hi-IN');
    Tts.setDefaultRate(0.6);
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#d2f7e6',
          },
          right: {
            // backgroundColor: '#bfebf2',
            backgroundColor: '#aae8f2',
          },
        }}
        textStyle={{
          right: {
            color: 'black',
          },
          left: {
            color: 'black',
          },
        }}
      />
    );
  }


  render() {
    const RenderGiftedChat = (
      <>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor="white"
          translucent={true}
        />
        <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
          <ImageBackground
            source={require('./assets/memphis-colorful.png')}
            resizeMode="stretch"
            style={{ width: '100%', height: '100%' }}>
            <GiftedChat
              renderBubble={this.renderBubble}
              messages={this.state.messages}
              onSend={(messages) => this.onSend(messages)}
              user={{ _id: 1 }}
              renderCustomView={this.renderCustomView}
              isTyping={true}
              infiniteScroll={true}
              alignTop={false}
            />
          </ImageBackground>
        </View>
      </>
    );

    

    return (
      <>
        {RenderGiftedChat}

      </>
    );
  }
}

export default Chatbot;
