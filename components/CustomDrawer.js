import {ImageBackground, StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {useContext, useEffect, useState} from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {UserType} from '../UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {io} from 'socket.io-client';
import {useNavigation} from '@react-navigation/native';

const CustomDrawer = props => {
  const socket = io('http://10.0.2.2:4000');
  const navigation = useNavigation();
  const [newMessage, setNewMessage] = useState(false);
  const {userId, setUserId} = useContext(UserType);
  useEffect(() => {
    // Listen for incoming messages from the server
    socket.on('receiveMessage', () => {
      // Update state to indicate new message
      setNewMessage(true);
    });

    // Clean up the socket event listener when the component unmounts
    return () => {
      socket.off('receiveMessage');
    };
  }, []);
  const handleLogout = async () => {
    try {
      // Emit a socket event to inform the server that the user is logging out
      socket.emit('userLoggedOut', {userId});
      // Clear the authentication token from AsyncStorage
      await AsyncStorage.removeItem('authToken');
      setUserId('');
      // Redirect the user to the login screen
      navigation.navigate('Login');
    } catch (error) {
      console.log('Error logging out', error);
      // Handle any errors
    }
  };
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{backgroundColor: 'black'}}>
        <ImageBackground
          source={require('../assets/images/bgImage.jpg')}
          style={{paddingHorizontal: 20, paddingTop: 80}}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D',
            }}
            style={{height: 90, width: 90, borderRadius: 40, marginBottom: 15}}
          />
          <View style={{flexDirection: 'row'}}>
            <MaterialCommunityIcons
              name="account"
              size={24}
              color="white"
              style={{marginRight: 10}}
            />
            <Text style={{color: '#fff', fontSize: 18, marginBottom: 10}}>
              Sana Khan
            </Text>
          </View>
        </ImageBackground>
        <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 10}}>
          <DrawerItemList {...props} />
        </View>
        {newMessage && (
          <View
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              backgroundColor: 'red',
              borderRadius: 10,
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}>
            <Text style={{color: 'white', fontSize: 12}}>New Message</Text>
          </View>
        )}
      </DrawerContentScrollView>
      <View style={{padding: 20, borderTopWidth: 1, borderTopColor: '#ccc'}}>
        <TouchableOpacity onPress={handleLogout} style={{paddingVertical: 15}}>
          <View style={{flexDirection: 'row'}}>
            <MaterialCommunityIcons
              name="logout"
              size={26}
              color="black"
              style={{marginRight: 10}}
            />
            <Text style={{fontSize: 20, fontWeight: '500', color: 'black'}}>
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({});
