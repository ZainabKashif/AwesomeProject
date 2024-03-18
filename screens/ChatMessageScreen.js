import {StyleSheet,Text,View,ScrollView,KeyboardAvoidingView,TextInput,Pressable,Image} from 'react-native';
import React, {useState, useContext, useLayoutEffect, useEffect, useRef} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EmojiSelector from 'react-native-emoji-selector';
import {UserType} from '../UserContext';
import {useNavigation, useRoute} from '@react-navigation/native';
import io from 'socket.io-client';

const ChatMessageScreen = () => {
  const scrollViewRef = useRef();
  const navigation = useNavigation();
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const {userId, setUserId} = useContext(UserType);
  const [receipentData, setReceipentData] = useState();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const route = useRoute();
  const {lawyerId} = route.params;
  //   console.log('ye hay lawyer id', lawyerId);
  //   console.log('ye hay user Id', userId);
  const handleEmojiPress = () => {
    setShowEmojiSelector(!showEmojiSelector);
  };

  useEffect(() => {
    const fetchReceipentData = async () => {
      try {
        const response = await fetch(`http://10.0.2.2:4000/chat/${lawyerId}`);
        const data = await response.json();
        setReceipentData(data);
        // console.log('oyeee', data);
      } catch (error) {
        console.log('error retreiving details', error);
      }
    };
    fetchReceipentData();
  }, []);
  useEffect(() => {
    // Connect to the Socket.IO server when the component mounts
    const newSocket = io('http://10.0.2.2:4000');
    setSocket(newSocket);

    // Clean up the socket connection when the component unmounts
    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Listen for incoming messages from the server
    socket.on('receiveMessage', data => {
        // Update the messages state to display the received message
        setMessages(prevMessages => [...prevMessages, data]);
      });

    // Clean up the socket event listener when the component unmounts
    return () => {
      socket.off('receiveMessage');
    };
  }, [socket, messages]);

  useEffect(()=>{
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://10.0.2.2:4000/chat/${userId}/${receipentData._id}`);
        const data = await response.json();
        // console.log(data.messages);
        setMessages(data.messages); // Assuming data.messages contains the array of messages
      } catch (error) {
        console.log('error retrieving messages', error);
      }
    };
    fetchMessages();

  },[receipentData])

  const handleSendMessage = () => {
    // Send the message to the server
    if (socket) {
      socket.emit('sendMessage', {
        sender_id: userId,
        receiver_id: receipentData._id,
        message: message,
      });
      setMessage(''); // Clear the message input after sending
    }
  };

  useEffect(()=>{
    if (scrollViewRef.current){
      scrollViewRef.current.scrollToEnd({animated: true});
    }
  },[messages]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => (
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
          <Ionicons
            onPress={() => navigation.goBack()}
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
                source={{uri: `data:image/jpeg;base64,${receipentData.image}`}}
              />
              <Text style={{marginLeft: 5, fontSize: 15, fontWeight: 'bold'}}>
                {receipentData.name}
              </Text>
            </View>
          ) : (
            <Text>Loading...</Text>
          )}
        </View>
      ),
    });
  }, [navigation, receipentData]);
  const formatTime = time => {
    const options = {hour: 'numeric', minute: 'numeric'};
    return new Date(time).toLocaleString('en-US', options);
  };

  return (
    <KeyboardAvoidingView style={{flex: 1, backgroundColor: '#F0F0F0'}}>
      <ScrollView ref={scrollViewRef}>
        {messages.map((item, index) => {
          return (
            <Pressable
              key={index}
              style={[
                item?.sender_id === userId
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
                {item?.message}
              </Text>
              <Text
                style={{
                  textAlign: 'right',
                  fontSize: 9,
                  color: 'gray',
                  marginTop: 5,
                }}>
                {formatTime(item.timeStamp)}
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
          onChangeText={text => setMessage(text)}
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
        <Pressable
          onPress={handleSendMessage}
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
  );
};

export default ChatMessageScreen;

const styles = StyleSheet.create({});
