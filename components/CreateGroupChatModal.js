import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Modal, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import {UserType} from '../UserContext';
import { useNavigation } from '@react-navigation/native';

const CreateGroupChatModal = ({ visible, onClose }) => {
  const [groupChatName, setGroupChatName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const {userId, setUserId, chats, setChats, setSelectedChat, selectedChat} = useContext(UserType);
  const navigation = useNavigation();


   // Function to fetch users based on search query
   const fetchUsers = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:4000/search-users/?query=${searchQuery}`);
      setUsers(response.data);
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
      setUsers([]);
    }
  }, [searchQuery]);

  const handleAddUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleAddUser(item)} style={styles.userItem}>
      <Image source={{uri: `data:image/jpeg;base64,${item?.image}`}} style={styles.userImage} />
      <Text style={styles.userName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderSelectedUserItem = ({ item }) => (
    <View style={styles.selectedUserItem}>
      <Image source={{uri: `data:image/jpeg;base64,${item?.image}`}} style={styles.selectedUserImage} />
      <Text style={styles.selectedUserName}>{item.name}</Text>
      <TouchableOpacity onPress={() => handleRemoveUser(item.id)} style={styles.deleteIcon}>
        <AntDesign name="delete" size={20} color="#FF6347" />
      </TouchableOpacity>
    </View>
  );

  const createGroup =async()=>{
    try{
        const response = await axios.post('http://10.0.2.2:4000/create-groupchat', {
            name: groupChatName,
            users: JSON.stringify(selectedUsers.map((u)=>u._id)),
            userId: userId
        });
        if (!chats.find((c) => c._id === response.data._id)) {
          setChats([response.data, ...chats]);
        }
        setSelectedChat(response.data);
        navigation.navigate("MyChats")
    }catch(error){
        console.error("Error in creating group", error);
    }
}

  const handleCreateGroup = () => {
    // Logic to create group
    // console.log('Group Name:', groupChatName);
    // console.log('Selected Users:', selectedUsers);
    createGroup();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Create New Group</Text>
          <TouchableOpacity onPress={onClose}>
            <AntDesign name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter Group Name"
            value={groupChatName}
            onChangeText={setGroupChatName}
            style={styles.input}
          />
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Add Users eg. Maryam Khalid"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>
        <FlatList
          data={users.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()))}
          renderItem={renderUserItem}
          keyExtractor={item => item._id.toString()}
          style={styles.userList}
        />
        <Text style={styles.selectedUsersTitle}>Selected Users:</Text>
        <FlatList
          data={selectedUsers}
          renderItem={renderSelectedUserItem}
          keyExtractor={item => item._id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.selectedUsersList}
        />
        <TouchableOpacity onPress={handleCreateGroup} style={styles.createButton}>
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  userList: {
    marginBottom: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
  },
  selectedUsersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  selectedUsersList: {
    marginBottom: 20,
  },
  selectedUserItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  selectedUserImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 5,
  },
  selectedUserName: {
    fontSize: 16,
    marginRight: 5,
  },
  deleteIcon: {
    marginLeft: 5,
  },
  createButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default CreateGroupChatModal;
