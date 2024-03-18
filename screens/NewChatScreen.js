// NewChatScreen.js

import { StyleSheet, Text, View, Pressable, Image, ScrollView, TextInput} from 'react-native'
import React, { useState, useContext, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { UserType } from '../UserContext';
import axios from 'axios';

const NewChatScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const { userId, setUserId, selectedChat, setSelectedChat, chats, setChats } = useContext(UserType);
    const navigation = useNavigation();

  // Function to fetch users based on search query
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:4000/search-users/?query=${searchQuery}`);
      setAcceptedFriends(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  // Fetch users whenever searchQuery changes
  useEffect(() => {
    if (searchQuery.trim() !== '') {
      fetchUsers();
    } else {
      // If search query is empty, reset the acceptedFriends state
      setAcceptedFriends([]);
    }
  }, [searchQuery]);

   // Function to create a new chat object
   const createChat = async (itemId) => {
    try {
      const response = await axios.post('http://10.0.2.2:4000/access-chats', { itemId, userId });
      // Handle response, e.g., update UI to show the new chat
      // console.log('New chat created:', response);
      const data = response.data;
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      navigation.navigate("MyChats")
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };
  //console.log("ye chat create ya select kri hay",selectedChat);

  return (
      <ScrollView style={{ backgroundColor: "#fff" }}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <ScrollView showsHorizontalScrollIndicator={false}>
          {acceptedFriends.map((item, index) => (
            <Pressable onPress={() => createChat(item._id)} style={{flexDirection:"row", alignItems:"center",gap:10, borderWidth:0.7, borderColor:"#D0D0D0",
            borderTopWidth:0, borderLeftWidth:0, borderRightWidth:0, padding:10}}>
                <Image style={{width:50, height:50, borderRadius:25, resizeMode:"cover"}} source={{uri: `data:image/jpeg;base64,${item?.image}`}}/>
                <View style={{flex:1}}>
                    <Text style={{fontSize:15,fontWeight:"500"}}>{item?.name}</Text>
                </View>
            </Pressable>
          ))}
        </ScrollView>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    height: 40,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#A9A9A9',
    marginBottom: 10,
    paddingHorizontal: 10,
    marginHorizontal: 10,
  },
});

export default NewChatScreen;
