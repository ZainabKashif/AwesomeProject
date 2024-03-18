import React, { useState, useRef } from 'react';
import { View, TextInput, Button, Text, ScrollView, StyleSheet } from 'react-native';
import { sendMessageToRasa } from '../api/ChatbotService';

const ChatBot = () => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const scrollViewRef = useRef();

    const handleSendMessage = async () => {
        if (message.trim() === '') return;

        try {
            const response = await sendMessageToRasa(message);
            setChatHistory([...chatHistory, { text: message, isUser: true }, ...response.map(r => ({ text: r.text, isUser: false }))]);
            setMessage('');
            scrollToBottom();
        } catch (error) {
            console.error('Error sending message to Rasa:', error);
        }
    };

    const scrollToBottom = () => {
        scrollViewRef.current.scrollToEnd({ animated: true });
    };

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={styles.chatContainer}
                style={styles.chatScrollView}
            >
                {chatHistory.map((chat, index) => (
                    <View key={index} style={chat.isUser ? styles.userMessageContainer : styles.botMessageContainer}>
                        <Text style={chat.isUser ? styles.userMessageText : styles.botMessageText}>
                            {chat.text}
                        </Text>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.inputContainer}>
                <TextInput
                    value={message}
                    onChangeText={(text) => setMessage(text)}
                    placeholder="Type your message..."
                    style={styles.inputField}
                />
                <Button title="Send" onPress={handleSendMessage} color="#000000" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    chatContainer: {
        flexGrow: 1,
        paddingVertical: 10,
    },
    chatScrollView: {
        backgroundColor: '#f0f0f0',
    },
    userMessageContainer: {
        alignSelf: 'flex-end',
        backgroundColor: '#013220',
        borderRadius: 10,
        marginVertical: 5,
        marginRight: 10,
        maxWidth: '80%',
    },
    botMessageContainer: {
        alignSelf: 'flex-start',
        backgroundColor: '#011327',
        borderRadius: 10,
        marginVertical: 5,
        marginLeft: 10,
        maxWidth: '80%',
    },
    userMessageText: {
        color: 'white', // Set text color to white for user messages
        padding: 10,
        fontSize: 18,
    },
    botMessageText: {
        color: 'white', // Set text color to black for bot messages
        padding: 10,
        fontSize: 16,
        // fontWeight:'600',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    inputField: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginRight: 10,
    },
});

export default ChatBot;