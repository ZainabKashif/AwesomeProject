import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Entypo from "react-native-vector-icons/Entypo";
import { useNavigation } from '@react-navigation/native';

const MainScreen2 = () => {
    const navigate = useNavigation();
    const handlePress =()=>{
        navigate.replace('Login');
    }
    const handleLawyerPress =()=>{
      navigate.replace('LawyerRegister');
    }
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={{ color: 'white', marginLeft: 10, fontSize: 45 }}>AdalNow</Text>
        <Text style={{ color: 'white', marginLeft: 10, fontSize: 20 }}>Justice for Her</Text>
      </View>
      <View style={{flexDirection: 'row', padding: 50, marginTop: 20}}>
        <Pressable onPress={handleLawyerPress} style={({ pressed }) => [{ flexDirection: "row", paddingHorizontal: 10, paddingVertical:25 ,borderRadius: 15, borderColor: pressed ? '#cfb536' : '#cfb536', borderWidth: 2, backgroundColor: pressed? '#cfb536': 'transparent', marginRight: 20, width: 150, justifyContent: "center"}]}>
          <Text style={{ color: 'white', paddingRight: 5, fontSize: 25 }}>Lawyer</Text>
          <FontAwesome6 name="landmark" size={35} color="#cfb536" />
        </Pressable>
        <Pressable onPress={handlePress} style={({ pressed }) => [{ flexDirection: "row",paddingHorizontal: 10, paddingVertical:25 ,borderRadius: 15, borderColor: pressed ? '#cfb536' : '#cfb536', borderWidth: 2, backgroundColor: pressed? 'yellow': 'transparent', width: 150, justifyContent: "center"}]}>
          <Text style={{ color: 'white', paddingRight: 5, fontSize: 25 }}>User</Text>
          <Entypo name="user" size={35} color="#cfb536" />
        </Pressable>
      </View>
      <View style={{justifyContent:"flex-end", alignItems:"flex-end", marginTop: 280}}>
        <Text style={{color:"white"}}>All rights belong to Team AdalNow</Text>
      </View>
    </View>
  );
};

export default MainScreen2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#313742',
    fontFamily: 'Protest Riot Regular',
  },
  content: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 220,
  },
});
