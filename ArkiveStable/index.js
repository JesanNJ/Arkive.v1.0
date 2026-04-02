/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// ✅ keep only this (safe)
import 'react-native-get-random-values';

AppRegistry.registerComponent(appName, () => App);