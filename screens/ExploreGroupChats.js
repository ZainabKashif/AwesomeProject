import React, { useState, useContext, useEffect } from 'react';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, Pressable, ScrollView, Modal } from 'react-native';
import axios from 'axios';
import { UserType } from '../UserContext';
import { useNavigation } from '@react-navigation/native';
import UserChat from '../components/UserChat';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CreateGroupChatModal from '../components/CreateGroupChatModal';
import { getImageofGroupUsers } from '../config/ChatLogics';

const ExploreGroupChats = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [groupChats, setGroupChats] = useState([]);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const fetchGroupChats = async ()=>{
    try{
      const response = await axios.get('http://10.0.2.2:4000/fetch-all-group-chats');
      const data = response.data;
      setGroupChats(data);
      console.log("ye ahe groupchats", data);
    }catch(error){
      console.error('Error fetching chats:', error);
    }
  };

  console.log("lets see", groupChats);
  
  useEffect(()=>{
    fetchGroupChats();
  },[])
  const [searchQuery, setSearchQuery] = useState('');

  const formatTime = timeString => {
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    const parsedTime = new Date(timeString);
    return parsedTime.toLocaleString('en-US', options);
  };

  const renderAppointmentCard = ({ item }) => (
    <View style={[styles.card, { backgroundColor:'#313742'  }]}>
      <Text style={[styles.cardTitle, { color: 'white' }]}>{item.chatName}</Text>
      <View style={styles.cardDates}>
        <Text style={styles.cardDate}>{formatTime(item?.createdAt)}</Text>
        <Text style={styles.cardDate}> - {formatTime(item?.updatedAt)}</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.attendeesContainer}>
          {item.users.map((member) => (
            <Image key={member._id} source={{uri: `data:image/jpeg;base64,${member.image}`}}  style={styles.attendeeImage} />
          ))}
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.buttonText}>Join Group</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const searchFilter = (item) => {
    const query = searchQuery.toLowerCase();
    return item.chatName.toLowerCase().includes(query);
  };

  return (
    <View style={styles.container}> 
    <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Group Chat"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <AntDesign name="search1" size={20} color="#A9A9A9" style={styles.searchIcon} />
      </View>
      {/* <Pressable onPress={toggleModal} style={styles.createChatButton}>
        <AntDesign
          style={{marginRight: 5}}
          name="pluscircleo"
          size={24}
          color="#fff"
        />
        <Text style={styles.createChatButtonText}>Create New Chat</Text>
      </Pressable> */}
    
      <FlatList 
        contentContainerStyle={styles.listContainer}
        data={groupChats.filter(searchFilter)}
        renderItem={renderAppointmentCard}
        keyExtractor={(item) => item._id.toString()}
      />
       {/* Render the modal */}
        <CreateGroupChatModal visible={isModalVisible} onClose={toggleModal} />
        {/* New Chat Button */}
      <View style={styles.createChatButtonContainer}>
        <Pressable onPress={toggleModal} style={styles.createChatButton}>
          <AntDesign
            style={{}}
            name="pluscircleo"
            size={50}
            color="#fff"
          />
          {/* <Text style={styles.createChatButtonText}>Create New Chat</Text> */}
        </Pressable>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
   createChatButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  createChatButton: {
    //position: 'absolute',
    //bottom: 10,
    alignSelf: 'center',
    backgroundColor: '#007bff',
    borderRadius: 50,
    //flexDirection: 'row',
    alignItems: 'center',
  },
  createChatButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    //marginLeft: 5,
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  listContainer:{
    paddingHorizontal:10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "#294c85",
    marginHorizontal:10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginHorizontal:10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#A9A9A9',
    marginBottom: 10,
    paddingHorizontal: 30,
  },
  searchIcon: {
    position: 'absolute',
    left: 10, 
    top: 10,
  },
  card: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  cardTitle: {
    fontSize:18,
    fontWeight: 'bold',
    paddingVertical: 5,
  },
  cardDates: {
    flexDirection: 'row',
    paddingVertical: 5,
    },
  cardDate: {
   color:'#dedede',
  },
  cardContent: {
    justifyContent: 'space-between',
    paddingTop: 10,
    flexDirection: 'row',
    borderTopColor: '#dedede',
    borderTopWidth: 1,
  },
  attendeesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  attendeeImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: -10,
    borderWidth:0.5,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    marginTop:15,
    backgroundColor:'#dedede',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  buttonText: {
    color: '#313742',
  },
});

export default ExploreGroupChats;