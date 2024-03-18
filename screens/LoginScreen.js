import { StyleSheet, Text, View, SafeAreaView, Image, KeyboardAvoidingView, TextInput, Pressable, Alert } from 'react-native'
import React, { useState, useEffect, useContext } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { UserType } from '../UserContext';
import {io} from 'socket.io-client';



const LoginScreen = () => {
    const {setUserId} = useContext(UserType); 
    const {userId} = useContext(UserType);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation();
    const serverUrl = 'http://10.0.2.2:4000/';
    const socket = io(serverUrl);
    useEffect(()=>{
        console.log("Updated UserId", userId)
    }, [userId]);
    // useEffect(() => {
    //     const checkLoginStatus = async () => {
    //         try {
    //             const token = await AsyncStorage.getItem("authToken");

    //             if (token) {
    //                 navigation.replace("DrawerRoutes");
    //             } else {
    //                 //token not found, show the login screen itself
    //             }

    //         } catch (error) {
    //             console.log("error", error)
    //         }
    //     };

    //     checkLoginStatus();
    // }, [])
    const handleLogin = () => {
        const user = {
            email: email,
            password: password
        }

        axios.post("http://10.0.2.2:4000/login", user).then((response) => {
            // console.log(response);
            setUserId(response.data.userId);
            // console.log("hehehe", userId);
            const token = response.data.token;
            AsyncStorage.setItem("authToken", token);
            navigation.replace("DrawerRoutes");

            //Emit 'userLoggedIn' event
            socket.emit('userLoggedIn', {userId: response.data.userId});
        }).catch((error) => {
            Alert.alert("Login error!")
            console.log("error", error);
        })
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#313742", alignItems: "center" }}>
            <View style={{ marginTop: 85 }}>
            <FontAwesome name="balance-scale" size={100} color="#cfb536" />
            </View>
            <KeyboardAvoidingView>
                <View style={{ alignItems: "center", justifyContent: "center" }}>
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ fontSize: 17, fontWeight: "light", marginTop: 25, color: "white" }}>Login to your account</Text>
                    </View>
                    <View style={{ marginTop: 40 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 20, borderColor: "white", borderWidth: 1, paddingVertical: 5, borderRadius: 5 }}>
                            <MaterialIcons name="email" size={24} color="white" style={{ marginLeft: 20 }} />
                            <TextInput value={email} onChangeText={(text) => setEmail(text)} placeholderTextColor={"white"} style={{ color: "white", marginVertical: 10, width: 300, fontSize: email ? 16 : 16 }} placeholder='Enter your email' />
                        </View>
                    </View>
                    <View style={{ marginTop: 30 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 20, borderColor: "white", borderWidth: 1, paddingVertical: 5, borderRadius: 5 }}>
                            <AntDesign name="lock" size={24} color="white" style={{ marginLeft: 20 }} />
                            <TextInput secureTextEntry={true} value={password} onChangeText={(text) => setPassword(text)} placeholderTextColor={"white"} style={{ color: "white", marginVertical: 10, width: 300, fontSize: password ? 16 : 16 }} placeholder='Enter your Password' />
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12, width: 350 }}>
                        <Text style={{color:"white"}}>Keep me logged in</Text>
                        <Text style={{ fontWeight: "700", color: "#1dc23b" }}>Forgot Password</Text>
                    </View>
                </View>
                <View style={{ marginTop: 45 }}>
                    <Pressable
                         onPress={handleLogin} 
                        style={{ width: 200, backgroundColor: "#107021", padding: 15, marginTop: 40, marginLeft: "auto", marginRight: "auto", borderRadius: 6 }}>
                        <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, color: "white" }}>Login</Text>
                    </Pressable>
                    <Pressable style={{ marginTop: 10 }} onPress={() => navigation.navigate("Register")}>
                        <Text style={{ textAlign: "center", fontSize: 16, color:"white" }}>Don't have an account? Sign Up</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({})