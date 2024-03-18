import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useNavigation } from '@react-navigation/native';

const MainScreen = () => {
    const navigation = useNavigation();
    useEffect(()=>{
        const timer = setTimeout(()=>{
            navigation.replace('Main2');
        }, 3000);

        return () => clearTimeout(timer);
    },[navigation]);
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <FontAwesome name="balance-scale" size={50} color="#cfb536" />
        <Text style={{color: "white", marginLeft: 10, fontSize: 35}}>AdalNow</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#313742",
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default MainScreen;
