import {StyleSheet, Text, View, Pressable, Image} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {UserType} from '../UserContext';
import axios from 'axios';
import {getImageofSender, getSender, getSenderId} from '../config/ChatLogics';

const UserChat = ({chat}) => {
  const {userId, setUserId, selectedChat, setSelectedChat, chats, setChats} =
    useContext(UserType);
  const navigation = useNavigation();
  //console.log(chat);

  const chatOpen = () => {
    setSelectedChat(chat);
    // console.log("ye hay userId", selectedChat);
    navigation.navigate('MessageAgain', {
      itemId: !chat?.isGroupChat ? getSenderId(userId, chat?.users) : chat?._id,
    });
  };

  const formatTime = timeString => {
    const options = { hour: 'numeric', minute: 'numeric' };
    const parsedTime = new Date(timeString);
    return parsedTime.toLocaleString('en-US', options);
  };

  return (
    <Pressable
      onPress={chatOpen}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderWidth: 0.7,
        borderColor: '#D0D0D0',
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        padding: 10,
      }}>
      <Image
        style={{width: 50, height: 50, borderRadius: 25, resizeMode: 'cover'}}
        source={
          !chat?.isGroupChat
            ? {
                uri: `data:image/jpeg;base64,${getImageofSender(
                  userId,
                  chat?.users,
                )}`,
              }
            : require('../assets/images/groupchat.jpg')
        }
      />

      <View style={{flex: 1}}>
        <Text style={{fontSize: 15, fontWeight: '500'}}>
          {!chat?.isGroupChat ? getSender(userId, chat?.users) : chat?.chatName}
        </Text>
        <Text style={{marginTop: 3, color: 'gray', fontWeight: '500'}}>
          {chat.latestMessage?.content}
        </Text>
      </View>
      <View>
        <Text style={{fontSize: 11, fontWeight: '400', color: '585858  '}}>
        {formatTime(chat.latestMessage?.createdAt)}
        </Text>
      </View>
    </Pressable>
  );
};

export default UserChat;

const styles = StyleSheet.create({});
