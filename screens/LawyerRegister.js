import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
//import { useNavigation } from '@react-navigation/core';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';

const LawyerRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [education, setEducation] = useState('');
  const [contact, setContact] = useState('');

  const navigation = useNavigation();
  const handleRegister = () => {
    const lawyer = {
      name: name,
      email: email,
      password: password,
      image: image,
      specialization: specialization,
      experience: experience,
      education: education,
      contact: contact,
    };
    axios
      .post('http://10.0.2.2:4000/lawyer-profile', lawyer)
      .then(response => {
        console.log(response);
        Alert.alert(
          'Registration successful',
          'you have been registered successfully',
        );
        setName('');
        setEmail('');
        setPassword('');
        setImage('');
        setSpecialization('');
        setExperience('');
        setEducation('');
        setContact('');
      })
      .catch(error => {
        Alert.alert(
          'Registeration failed',
          'an error occured during registration',
        );
        console.log('error', error);
      });
  };

  // Modify your handlePickImage function
  const handlePickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
        includeBase64: true,
      });

      if (!result.didCancel && !result.error && !result.customButton) {
        if (result.assets && result.assets.length > 0) {
          if (result.assets[0].base64) {
            const compressedImage = await resizeImage(result.assets[0].uri);
            // Extract only the Base64 string portion
            const base64String = compressedImage.split(';base64,').pop();
            console.log("Base64 Image:", base64String);
            setImage(base64String);
          } else {
            console.error('Base64 data is missing.');
          }
        } else {
          console.error('No assets selected.');
        }
      } else {
        console.log('User canceled or error occurred during image selection.');
      }
    } catch (error) {
      console.error('Error picking image: ', error);
    }
  };
  // Function to resize the image
  const resizeImage = async uri => {
    try {
      const resizedImage = await ImageResizer.createResizedImage(
        uri,
        200,
        200,
        'JPEG',
        80,
      );
      const compressedImage = await readFile(resizedImage.uri);
      return compressedImage;
    } catch (error) {
      console.error('Error resizing image: ', error);
      return null;
    }
  };

  // Function to read the resized image file
  const readFile = async uri => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      return new Promise((resolve, reject) => {
        reader.onloadend = () => {
          const base64data = reader.result;
          resolve(base64data);
        };
      });
    } catch (error) {
      console.error('Error reading file: ', error);
      return null;
    }
  };
  return (
    <ScrollView vertical>
      <SafeAreaView
        style={{flex: 1, backgroundColor: '#313742', alignItems: 'center'}}>
        {/* <View style={{ marginTop: 70 }}>
                <FontAwesome name="balance-scale" size={100} color="#cfb536" />
                </View>  */}
        <KeyboardAvoidingView>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: 'bold',
                  marginTop: 25,
                  color: 'white',
                }}>
                Register your account
              </Text>
            </View>
            <View style={{marginTop: 40}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 20,
                  borderColor: 'white',
                  borderWidth: 1,
                  paddingVertical: 5,
                  borderRadius: 5,
                }}>
                <Ionicons
                  name="person"
                  size={24}
                  color="white"
                  style={{marginLeft: 20}}
                />
                <TextInput
                  value={name}
                  onChangeText={text => setName(text)}
                  placeholderTextColor={'white'}
                  style={{
                    color: 'white',
                    marginVertical: 10,
                    width: 300,
                    fontSize: password ? 16 : 16,
                  }}
                  placeholder="Enter your Name"
                />
              </View>
            </View>
            <View style={{marginTop: 30}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 20,
                  borderColor: 'white',
                  borderWidth: 1,
                  paddingVertical: 5,
                  borderRadius: 5,
                }}>
                <MaterialIcons
                  name="email"
                  size={24}
                  color="white"
                  style={{marginLeft: 20}}
                />
                <TextInput
                  value={email}
                  onChangeText={text => setEmail(text)}
                  placeholderTextColor={'white'}
                  style={{
                    color: 'white',
                    marginVertical: 10,
                    width: 300,
                    fontSize: email ? 16 : 16,
                  }}
                  placeholder="Enter your email"
                />
              </View>
            </View>
            <View style={{marginTop: 30}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 20,
                  borderColor: 'white',
                  borderWidth: 1,
                  paddingVertical: 5,
                  borderRadius: 5,
                }}>
                <AntDesign
                  name="lock"
                  size={24}
                  color="white"
                  style={{marginLeft: 20}}
                />
                <TextInput
                  secureTextEntry={true}
                  value={password}
                  onChangeText={text => setPassword(text)}
                  placeholderTextColor={'white'}
                  style={{
                    color: 'white',
                    marginVertical: 10,
                    width: 300,
                    fontSize: password ? 16 : 16,
                  }}
                  placeholder="Enter your Password"
                />
              </View>
            </View>
            <View style={{marginTop: 30}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 20,
                  borderColor: 'white',
                  borderWidth: 1,
                  paddingVertical: 5,
                  borderRadius: 5,
                }}>
                <AntDesign
                  name="lock"
                  size={24}
                  color="white"
                  style={{marginLeft: 20}}
                />
                <TextInput
                  value={specialization}
                  onChangeText={text => setSpecialization(text)}
                  placeholderTextColor={'white'}
                  style={{
                    color: 'white',
                    marginVertical: 10,
                    width: 300,
                    fontSize: password ? 16 : 16,
                  }}
                  placeholder="Enter your Specialization"
                />
              </View>
            </View>
            <View style={{marginTop: 30}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 20,
                  borderColor: 'white',
                  borderWidth: 1,
                  paddingVertical: 5,
                  borderRadius: 5,
                }}>
                <AntDesign
                  name="lock"
                  size={24}
                  color="white"
                  style={{marginLeft: 20}}
                />
                <TextInput
                  value={experience}
                  onChangeText={text => setExperience(text)}
                  placeholderTextColor={'white'}
                  style={{
                    color: 'white',
                    marginVertical: 10,
                    width: 300,
                    fontSize: password ? 16 : 16,
                  }}
                  placeholder="Enter your Experience"
                />
              </View>
            </View>
            <View style={{marginTop: 30}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 20,
                  borderColor: 'white',
                  borderWidth: 1,
                  paddingVertical: 5,
                  borderRadius: 5,
                }}>
                <AntDesign
                  name="lock"
                  size={24}
                  color="white"
                  style={{marginLeft: 20}}
                />
                <TextInput
                  value={education}
                  onChangeText={text => setEducation(text)}
                  placeholderTextColor={'white'}
                  style={{
                    color: 'white',
                    marginVertical: 10,
                    width: 300,
                    fontSize: password ? 16 : 16,
                  }}
                  placeholder="Enter your Education"
                />
              </View>
            </View>
            <View style={{marginTop: 30}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 20,
                  borderColor: 'white',
                  borderWidth: 1,
                  paddingVertical: 5,
                  borderRadius: 5,
                }}>
                <AntDesign
                  name="lock"
                  size={24}
                  color="white"
                  style={{marginLeft: 20}}
                />
                <TextInput
                  value={contact}
                  onChangeText={text => setContact(text)}
                  placeholderTextColor={'white'}
                  style={{
                    color: 'white',
                    marginVertical: 10,
                    width: 300,
                    fontSize: password ? 16 : 16,
                  }}
                  placeholder="Enter your Contact"
                />
              </View>
            </View>

            {/* <View style={{ marginTop: 30 }}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 20, borderColor: "white", borderWidth: 1, paddingVertical: 5, borderRadius: 5 }}>
                                <AntDesign name="lock" size={24} color="white" style={{ marginLeft: 20 }} />
                                <TextInput value={image} onChangeText={(text) => setImage(text)} placeholderTextColor={"white"} style={{ color: "white", marginVertical: 10, width: 300, fontSize: password ? 16 : 16 }} placeholder='Upload your image' />
                            </View>
                        </View> */}

            <View style={{marginTop: 30}}>
              <Pressable
                onPress={handlePickImage}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 20,
                  borderColor: 'white',
                  borderWidth: 1,
                  paddingVertical: 5,
                  borderRadius: 5,
                }}>
                <FontAwesome
                  name="image"
                  size={24}
                  color="white"
                  style={{marginLeft: 20}}
                />
                <Text
                  style={{
                    color: 'white',
                    marginVertical: 10,
                    fontSize: password ? 16 : 16,
                  }}>
                  Upload your image
                </Text>
              </Pressable>
            </View>
          </View>
          <View style={{marginTop: 20}}>
            <Pressable
              onPress={handleRegister}
              style={{
                width: 200,
                backgroundColor: '#107021',
                padding: 15,
                marginTop: 30,
                marginLeft: 'auto',
                marginRight: 'auto',
                borderRadius: 6,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 16,
                  color: 'white',
                }}>
                Register
              </Text>
            </Pressable>
            <Pressable style={{marginTop: 10}}>
              <Text style={{textAlign: 'center', fontSize: 16, color: 'white'}}>
                Already have an account ? Sign In{' '}
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScrollView>
  );
};

export default LawyerRegister;
