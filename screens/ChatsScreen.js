import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, TextInput } from 'react-native';
import axios from 'axios';
import { UserType } from '../UserContext';
import { useNavigation } from '@react-navigation/native';
import UserChat from '../components/UserChat';
import AntDesign from 'react-native-vector-icons/AntDesign';

const ChatsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const { userId, setUserId , chats, setChats, selectedChat, setSelectedChat} = useContext(UserType);
  const navigation = useNavigation();

  useEffect(()=>{
    const fetchChats = async () => {
      try {
        // Make a request to fetch chats from your server
        // Update the endpoint and handle the response accordingly
        const response = await axios.get('http://10.0.2.2:4000/fetch-chats', {params:{userId}});
        // console.log("hhhee",response.data);
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };
    fetchChats();
  }, [])
  console.log("ye chattt hay",chats);

  const goToNewChat=()=>{
    navigation.navigate("CreateNewChat")
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ backgroundColor: "#fff" }}>
        <ScrollView showsHorizontalScrollIndicator={false}>
          {chats.map((chat, index) => (
            <Pressable key={index}> 
              <UserChat chat={chat} />
            </Pressable>
          ))}
        </ScrollView>
      </ScrollView>
      <Pressable onPress={goToNewChat} style={styles.createChatButton}>
        <AntDesign
          style={{marginRight: 5}}
          name="pluscircleo"
          size={24}
          color="#313742"
        />
        <Text style={styles.createChatButtonText}>Create New Chat</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  createChatButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  createChatButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default ChatsScreen;
