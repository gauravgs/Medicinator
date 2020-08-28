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

import { GiftedChat, Message } from 'react-native-gifted-chat';

const BOT_USER = {
    _id: 2,
    name: 'MedBot',
    avatar: require('./assets/chatBot.png'),
};

var welcomeText = 'Welcome to Medicinator! How can I help you today?';

class ChatBot extends Component {
    constructor(props) {
        super(props);

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

    async generateResponses(query) {
        var result;
        let apiCall = 'https://medicinator.herokuapp.com/getResponse?text=';
        console.log(query);
        if (this.state.nextContext === 'medicine.alternate') {
            apiCall = 'https://medicinator.herokuapp.com/getAlternate?query=';
        } else if (this.state.nextContext === 'diagnosis.start') {
            apiCall = 'https://medicinator.herokuapp.com/getDiagnosis?query=';
        } else if (this.state.nextContext === 'doctor.find') {
            alert('Context is ' + this.state.nextContext);
        } else if (this.state.nextContext === 'ambulance.find') {
            alert('Context is ' + this.state.nextContext);
        } else {
            apiCall = 'https://medicinator.herokuapp.com/getResponse?text=';
        }

        await fetch(apiCall + query, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('Fetch response======>\t', responseJson);
                result = responseJson.response.toString();
                console.log(responseJson.intent + 'PUSHED TO STATE');
                this.setState({
                    nextContext: responseJson.intent,
                });
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

    render() {
        const RenderGiftedChat = (
            <>
                <View style={{ flex: 1, backgroundColor: '#ffffff', }}>
                    <ImageBackground
                        source={require('./assets/pattern.png')}
                        resizeMode="repeat"
                        style={{ width: '100%', height: '100%' }}>
                        <GiftedChat
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

        return <>

            {RenderGiftedChat}

        </>;
    }
}

export default ChatBot;
