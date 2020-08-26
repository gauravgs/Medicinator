import React, { Component, useState } from "react";
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
    Alert
} from "react-native";
import { GiftedChat, Message } from "react-native-gifted-chat";

const BOT_USER = {
    _id: 2,
    name: "MedBot",
    avatar: require("./assets/chatBot.png"),
};

var welcomeText = "Hello! I am your Personal Healthcare Companion";

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
        };


        this.generateResponses = this.generateResponses.bind(this);
        // this.renderCustomView = this.renderCustomView.bind(this);

        this.intent = "";

        this.drugName = "";
        this.id = 2;
        this.userMessages = [];
        this.custom = false;
        this.noalternate = "No Alternate Found in Database";
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
        console.log(query);
        await fetch('https://medicinator.herokuapp.com/getResponse?text=' + query,
            {
                method: 'GET'
            })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                result= responseJson.toString();
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
        console.log(answer);

        // for (var i = 0; i < this.userMessages.length; i++) {
        //     if (this.userMessages[i].toLowerCase().includes("alternative") || this.userMessages[i].toLowerCase().includes("medicine") || this.userMessages[i].toLowerCase().includes("alternate") || this.userMessages[i].includes("दवा") || this.userMessages[i].includes("वैकल्पिक")) {
        //         this.drugName = message.split(" ");
        //         console.log("------------------>" + this.drugName[1]);
        //         this.drugName = this.drugName[this.drugName.length - 1];
        //     }
        // }

        // console.log("drugname" + this.drugName);

        this.setResponse(answer);
        console.log(answer + " from onsend");
    }

    setResponse(text, intent) {
        //set response of bot

        console.log("response text=" + text);

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
    }

    componentDidMount() {

    }



    render() {
        const RenderGiftedChat = (
            <>
                <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
                    <GiftedChat
                        messages={this.state.messages}
                        onSend={(messages) => this.onSend(messages)}
                        user={{ _id: 1 }}
                        renderCustomView={this.renderCustomView}
                        isTyping={true}
                        infiniteScroll={true}
                        alignTop={false}
                    />
                </View>
            </>
        );

        return <>{RenderGiftedChat}</>;
    }
}



export default ChatBot;
