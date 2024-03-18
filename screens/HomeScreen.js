import { StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect, useEffect, useState , useContext} from 'react'
import { useNavigation } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {UserType } from '../UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import "core-js/stable/atob";
import User from '../components/User';

const HomeScreen = () => {
    const navigation = useNavigation();
    const {userId, setUserId} = useContext(UserType);
    const [users, setUsers] = useState([]);
    useLayoutEffect(()=>{
        navigation.setOptions({
            headerTitle:"",
            headerLeft:()=>(
                <Text style={{fontSize:15, fontWeight: "bold"}}>Swift Chat</Text>
        ),
        headerRight:()=>(
            <View style={{flexDirection: "row", alignItems: "center", gap:8}}>
                <Entypo onPress={()=>navigation.navigate("Chats")} name="chat" size={24} color="gray" style={{ marginLeft: 20 }} />
                <FontAwesome5 onPress={()=>navigation.navigate("Friends")} name="user-friends" size={24} color="gray" style={{ marginLeft: 20 }} />
            </View>
        )
        })
    },[])

    useEffect(() => {
        const fetchUsers = async ()=>{
            const token = await AsyncStorage.getItem("authToken");
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;
            setUserId(userId);

            axios.get(`http://10.0.2.2:4000/users/${userId}`).then((response)=>{
                setUsers(response.data)
            }).catch((error)=>{
                console.log("errors retrieving users", error);
            });
        };
        fetchUsers();
    }, []);

    console.log("users", users);
    
  return (
    <View style={{padding:10}}>
      {users.map((item, index)=>(
        <User key={index} item={item}/>
      ))}
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})