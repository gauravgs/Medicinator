import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Tts from 'react-native-tts';

export default class Login extends React.Component {
  componentDidMount() {
    console.log('\n\n\n\n\nVOICES*****************************');
    Tts.getInitStatus().then(() => {
      Tts.speak('Welcome to Medicinator! How can I help you today?');
    });
    Tts.voices().then((voices) => console.log(voices));
    Tts.setDucking(true);
    Tts.setDefaultLanguage('hi-IN');
    Tts.setDefaultRate(0.6);
  }
  state = {
    email: '',
    password: '',
  };

  loginFunc = () => {
    alert('HEllo');
    Tts.speak(
      'यूपी में हमीरपुर जिले के खेड़ाशिलाजीत गांव में सोमवार को भरत कुमार इंटर कॉलेज के छात्र-छात्राओं को बुलाकर गांव के अलग-अलग घरों में बैठाकर परीक्षा कराने का मामला सामने आया है। परीक्षा की खबर लगते ',
    );
  };

  render() {
    return (
      <>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <View style={styles.container}>
          <Text style={styles.logo}>Medicinator</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Email..."
              placeholderTextColor="white"
              onChangeText={(text) => this.setState({email: text})}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              secureTextEntry
              style={styles.inputText}
              placeholder="Password..."
              placeholderTextColor="white"
              onChangeText={(text) => this.setState({password: text})}
            />
          </View>
          <TouchableOpacity>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.loginFunc();
            }}
            style={styles.loginBtn}>
            <Text style={styles.loginText}>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.loginText}>Signup</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#fb5b5a',
    marginBottom: 40,
  },
  inputView: {
    width: '80%',
    backgroundColor: '#465881',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: 'white',
  },
  forgot: {
    color: 'white',
    fontSize: 11,
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#fb5b5a',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  loginText: {
    color: 'white',
  },
});
