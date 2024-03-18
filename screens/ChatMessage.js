import {StyleSheet,Text,View,ScrollView,KeyboardAvoidingView,TextInput,Pressable,Image} from 'react-native';
import React, {useState, useContext, useLayoutEffect, useEffect, useRef} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EmojiSelector from 'react-native-emoji-selector';
import {UserType} from '../UserContext';
import {useNavigation, useRoute} from '@react-navigation/native';
import io from 'socket.io-client';
import axios from 'axios';
import { UserContext } from "../UserContext";

const ENDPOINT = "http://10.0.2.2:4000";

const ChatMessage = () => {
  const scrollViewRef = useRef();
  const navigation = useNavigation();
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [receipentData, setReceipentData] = useState();
  const [message, setMessage] = useState('');


  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [loading, setLoading] = useState(false);
  const {userId, setUserId, selectedChat, setSelectedChat, notification, setNotification} = useContext(UserType);
  const [selectedChatCompare, setSelectedChatCompare] = useState();
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const route = useRoute();
  const [chatDetails, setChatDetails] = useState();
  const {itemId} = route.params;
  //console.log(itemId);
    // console.log('ye hay receiver id', itemId);
    // console.log('ye hay user Id', userId);
    //console.log("ye me jisse bAAT krrhy wo hay", selectedChat)
    useEffect(() => {
      const fetchChatDetails = async () => {
        try {
          if (itemId) {
            const response = await axios.get(`http://10.0.2.2:4000/specific-chat/${itemId}`);
            setChatDetails(response.data);
            console.log("details laao", response.data);
          }
        } catch (error) {
          console.log('error retreiving details', error);
        }
      };
      fetchChatDetails();
    },[itemId]);

    //console.log(chatDetails.chatName);

  const handleEmojiPress = () => {
    setShowEmojiSelector(!showEmojiSelector);
  };
  useEffect(() => {
    const newSocket = io(ENDPOINT);
    setSocket(newSocket);
  
    // Clean up the socket connection when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);
  
  useEffect(() => {
    if (socket) {
      socket.emit("setup", userId);
  
      // Listen for connection event
      socket.on("connected", () => {
        setSocketConnected(true);
      });

      socket.on("typing",() => setIsTyping(true));
      socket.on("stop typing", ()=> setIsTyping(false));
  
      // Handle disconnection
      socket.on("disconnect", () => {
        setSocketConnected(false);
      });
    }
  }, [socket, userId])


  useEffect(() => {
    const fetchReceipentData = async () => {
      try {
        const response = await fetch(`http://10.0.2.2:4000/chat-for-user/${itemId}`);
        const data = await response.json();
        setReceipentData(data);
        //console.log('oyeee', data);
      } catch (error) {
        console.log('error retreiving details', error);
      }
    };
    fetchReceipentData();
  }, []);

  const sendMessage = async () => {
    socket.emit("stop typing", selectedChat._id);
    try {
      const response = await axios.post('http://10.0.2.2:4000/send-message', {
        content: message,
        chatId: selectedChat._id,
        senderId: userId,
      });
      const newMessage = response.data;
      //console.log('ye message bheja', newMessage);
      socket.emit('new message', newMessage)
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setNewMessage('');
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://10.0.2.2:4000/get-all-messages/${selectedChat._id}`);
        const fetchedMessages = response.data;
        setMessages(fetchedMessages);
        setLoading(false); // Set loading to false after fetching messages
        // Emit 'join chat' event if socket is not null
        if (socket) {
          socket.emit('join chat', selectedChat._id);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        setLoading(false); // Set loading to false in case of error
      }
    };
    if (selectedChat) {
      fetchMessages();
    }
  }, [selectedChat, socket]); // Include socket in the dependency array

  useEffect(() => {
    setSelectedChatCompare(selectedChat);
  }, [selectedChat]);

  useEffect(() => {
    if (socket) {
      socket.on("message received", (newMessageReceived) => {
        //console.log("new msgs received hua hay", newMessageReceived)
        if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
          // give notification
          if (!notification.includes(newMessageReceived)){
            setNotification([newMessageReceived, ...notification]);
          }

        } else {
          setMessages([...messages, newMessageReceived]);
        }
      });
    }
  }, [socket, selectedChatCompare, messages, notification]); 

  useEffect(()=>{
    if (scrollViewRef.current){
      scrollViewRef.current.scrollToEnd({animated: true});
    }
  },[messages]);

  // console.log("messgsss arrayyy",messages)

  const typingHandler =(text)=>{
    setMessage(text);

    if (!socketConnected) return;

    if (!typing){
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }
    let lastTypingTime = new Date().getTime()
    var timerLength = 3000;
    setTimeout(()=>{
      var timeNow =   new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing){
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  }
  const goBack =()=>{
    navigation.goBack();
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => (
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
          <Ionicons
            onPress={goBack}
            name="chevron-back"
            size={24}
            color="black"
          />
          {receipentData ? (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  resizeMode: 'cover',
                }}
                source={{uri: `data:image/jpeg;base64,${receipentData?.image}`}}
              />
              <Text style={{marginLeft: 5, fontSize: 15, fontWeight: 'bold'}}>
                {receipentData?.name}
              </Text >
              {isTyping? <Text style={{fontSize: 15, marginLeft: 5}}>Typing...</Text> : <></>}
            </View>
          ) : (
            <Text style={{marginLeft: 5, fontSize: 15, fontWeight: 'bold'}}>
            {chatDetails?.chatName}
          </Text>
          )}
        </View>
      ),
    });
  }, [navigation, receipentData, isTyping]);

  return (
    <UserContext selectedChatCompare={selectedChatCompare}>
    <KeyboardAvoidingView style={{flex: 1, backgroundColor: '#F0F0F0'}}>
      <ScrollView ref={scrollViewRef}>
        {messages.map((item, index) => {
          return (
            <Pressable
              key={index}
              style={[
                item?.sender._id === userId
                  ? {
                      alignSelf: 'flex-end',
                      backgroundColor: '#DCF8C6',
                      padding: 8,
                      maxWidth: '60%',
                      borderRadius: 7,
                      margin: 10,
                    }
                  : {
                      alignSelf: 'flex-start',
                      backgroundColor: 'white',
                      padding: 8,
                      margin: 10,
                      borderRadius: 7,
                      maxWidth: '60%',
                    },
              ]}>
              <Text style={{fontSize: 13, textAlign: 'left'}}>
                {item?.content}
              </Text>
              <Text
                style={{
                  textAlign: 'right',
                  fontSize: 9,
                  color: 'gray',
                  marginTop: 5,
                }}>
                {item.sender.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: '#dddddd',
          marginBottom: showEmojiSelector ? 0 : 25,
        }}>
        <Entypo
          onPress={handleEmojiPress}
          style={{marginRight: 5}}
          name="emoji-happy"
          size={24}
          color="gray"
        />
        <TextInput
          value={message}
          onChangeText={typingHandler}
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: '#dddddd',
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
          placeholder="Type your message"
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 7,
            marginHorizontal: 8,
          }}></View>
        <Pressable onPress={sendMessage}
          style={{
            backgroundColor: '#007bff',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 20,
          }}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Send</Text>
        </Pressable>
      </View>
      {showEmojiSelector && (
        <EmojiSelector
          onEmojiSelected={emoji => {
            setMessage(prevMessage => prevMessage + emoji);
          }}
          style={{height: 250}}
        />
      )}
    </KeyboardAvoidingView>
    </UserContext>
  );
};

export default ChatMessage;

const styles = StyleSheet.create({});
