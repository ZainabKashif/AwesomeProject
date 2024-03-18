import { StyleSheet, Text, View, Image, SafeAreaView, TextInput, Button, Alert, Pressable, ScrollView } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { UserType } from "../UserContext";
import axios from "axios";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import * as ImagePicker from "react-native-image-picker";
// socket
import io from "socket.io-client";

const Blogs = () => {
  const { userId, setUserId } = useContext(UserType);
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    console.log("User ID:", userId); // Debugging: Check if userId is set correctly

    if (userId) {
      axios.get(`http://10.0.2.2:4000/users/${userId}`)
        .then(response => {
          console.log("User Data:", response.data); // Debugging: Check the response data
          setName(response.data.name);
        })
        .catch(error => {
          console.log('Error fetching user data:', error);
        });
    }
  }, [userId]);

  // socket connection//
  useEffect(() => {
    // Connect to the Socket.IO server when the component mounts
    const newSocket = io('http://10.0.2.2:4000');
    setSocket(newSocket);

    // Clean up the socket connection when the component unmounts
    return () => newSocket.disconnect();
  }, []);


  // share post//
  const handlePostSubmit = () => {
    if (socket) {
      socket.emit('sendPost', {
        senderId: userId,
        author: author,
        content: content,
        url: url,
        image: image,
        userId: userId,
      });
      setAuthor("");
      setContent("");
      setUrl("");
      setImage("");
      Alert.alert('Success', 'Post shared successfully!');
    }
  };

  // upload image//
  const handlePickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
        includeBase64: true, // Ensure base64 encoding of the selected image
      });

      // console.log('ImagePicker Result: ', result);
      if (!result.didCancel && !result.error && !result.customButton) {
        // Check if assets array exists and has at least one item
        if (result.assets && result.assets.length > 0) {
          // Check if the first item has the base64 property
          if (result.assets[0].base64) {
            const imageBase64 = result.assets[0].base64;
            setImage(imageBase64);
            console.log(image);
          } else {
            console.error('Base64 data is missing.');
          }
        } else {
          console.error('No assets selected.');
        }
      } else {
        // Handle cases where image selection is canceled or an error occurs
        console.log('User canceled or error occurred during image selection.');
      }
    } catch (error) {
      console.error('Error picking image: ', error);
    }
  };

  return (
    <ScrollView>
      <SafeAreaView style={{ padding: 10 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            padding: 10,
          }}
        >
          <Image
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              resizeMode: "contain",
            }}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
            }}
          />

          <Text style={{ fontWeight: 'bold', fontSize: 17 }}>{name}</Text>
        </View>

        <View style={{ flexDirection: "column", marginLeft: 10 }}>

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>If you want to be anonymous, type in 'Anonymous'.</Text>
          </View>

          <TextInput
            value={author}
            onChangeText={(text) => setAuthor(text)}
            placeholderTextColor={"black"}
            placeholder="Post author's name?....."
            multiline
            style={styles.textInput}
          />
        </View>



        <View style={{ flexDirection: "column", marginLeft: 10 }}>
          <TextInput
            value={content}
            onChangeText={(text) => setContent(text)}
            placeholderTextColor={"black"}
            placeholder="Type your message..."
            multiline
            style={styles.textInput}
          />
        </View>

        <View style={{ flexDirection: "column", marginLeft: 10 }}>
          <TextInput
            value={url}
            onChangeText={(text) => setUrl(text)}
            placeholderTextColor={"black"}
            placeholder="Enter the URL..."
            multiline
            style={styles.textInput}
          />
        </View>


        {/* image */}
        <View style={{ marginTop: 10 }}>
          <Pressable onPress={handlePickImage} style={{ flexDirection: "row", alignItems: "center", gap: 20, borderColor: "grey", borderWidth: 1, paddingVertical: 3, borderRadius: 5, marginLeft: 12 }}>
            <FontAwesome name="image" size={24} color="grey" style={{ marginLeft: 20 }} />
            <Text style={{ color: 'black', marginVertical: 10, fontSize: 15 }}>Upload the image</Text>
          </Pressable>
        </View>
        {/* //// */}
        <View style={{ marginTop: 20 }} />

        <Button onPress={handlePostSubmit} title="Share Post" />
      </SafeAreaView>
    </ScrollView>
  );
};

export default Blogs;

const styles = StyleSheet.create({
  infoContainer: {
    backgroundColor: '#e6f2ff', // Light blue background color
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#333', // Dark gray text color
  },
  textInput: {
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    marginBottom: 15,
  },
});
