/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import Chatbot from './Chatbot';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => Chatbot);
