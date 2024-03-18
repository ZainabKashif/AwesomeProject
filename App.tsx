import 'react-native-gesture-handler' ;
import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import StackApp from './StackNavigator';
import { UserContext } from './UserContext';
import { createNotifications } from 'react-native-notificated'
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const { NotificationsProvider } = createNotifications()

const App = () => {
  return (
    <>
    <GestureHandlerRootView style={{flex: 1}}>
    <UserContext selectedChatCompare={undefined}>
      <StackApp/>
    </UserContext>
    <NotificationsProvider/>
    </GestureHandlerRootView>
    </>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
