import { Alert, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View, Pressable } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { StatusBar } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Svg, { Line } from 'react-native-svg'
import AntDesign from "react-native-vector-icons/AntDesign";
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';
import axios from 'axios';
import RateLawyerModal from '../components/RateLawyerModal';
import { UserType } from '../UserContext';

const LawyerProfile = () => {

  const { userId, setUserId, selectedChat, setSelectedChat, chats, setChats } = useContext(UserType);
  const [isModalVisible, setModalVisible] = useState(false);
  const [itemId, setItemId] = useState('');

  const handleRateLawyer = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const navigation = useNavigation();
  const route = useRoute();
  const {lawyerId} = route.params;
  const [lawyerDetails, setLawyerDetails] = useState(null);
  const [rating, setRating] = useState(0);
  const onChat = () =>{
    navigation.navigate("Messages", {lawyerId});
  }
  const handlePress = ()=>{
    navigation.navigate("FindLawyers");
  }
  useEffect(()=>{
    fetchLawyerDetails();
  },[]);
  const fetchLawyerDetails = async () =>{
    try{
      const response = await axios.get(`http://10.0.2.2:4000/SingleLawyer/${lawyerId}`);
      if (response.status === 200){
        setLawyerDetails(response.data);
        // console.log("hehhehehh" , lawyerDetails);
      }
    } catch (err){
      console.log('Error fetching lawyers', err)
    }
  }
  const handleRate = async (starIndex) =>{
    setRating(starIndex);
    try {
      const response = await fetch(`http://10.0.2.2:4000/lawyer/${lawyerId}/rating`,{
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({rating: starIndex}),
        
      });
      if (!response.ok){
        throw new Error('Failed to update rating');
      }
      Alert.alert("Thankyou for rating");
    } catch (err){
      console.error('Error updating rating:', err);
    }
  }
  const goBack=()=>{
    navigation.replace("BottomTabs");
  };

  useEffect(() => {
    setItemId(lawyerId); // Move setting itemId inside useEffect
    fetchLawyerDetails(); // Fetch details after setting itemId
  }, [lawyerId]);
   // Function to create a new chat object
   const createChat = async () => {
    try {
      const response = await axios.post('http://10.0.2.2:4000/access-chats', { itemId, userId });
      // Handle response, e.g., update UI to show the new chat
      // console.log('New chat created:', response);
      const data = response.data;
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      navigation.navigate("MyChats")
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  if (!lawyerDetails) {
    return (
        <View>
            <Text>Loading...</Text>
        </View>
    );
}
  const base64Image = lawyerDetails.image;

  return (
    <SafeAreaView style={{flex:1, marginTop:0, backgroundColor: 'white'}}>
      <View style={styles.ImageContainer}>
        <ImageBackground source={{uri: "https://img.freepik.com/premium-photo/judge-gavel-scales-justice-court-hall-law-concept-judiciary-jurisprudence-justice-copy-space-based-generative-ai_438099-11331.jpg"}} style={styles.ImageBackground} imageStyle={styles.image}>
        <Ionicons onPress={handlePress} name="chevron-back-sharp" size={30} color="white" style={{marginLeft:10, marginTop:10}}/>
        </ImageBackground>
      </View>
      <View style={styles.MainContainer}>
        <View style={styles.OverlayContainer}>
        <View style={styles.profileContainer}>
              <Image
                source={{uri: `data:image/jpeg;base64,${base64Image}`}}
                style={styles.profileImage}
              />
            </View>
            <View style={styles.NameContainer}>
              <Text style={styles.LawyerName}>{lawyerDetails.name}</Text>
              <Text style={styles.SubTitle}>{lawyerDetails.specialization}</Text>
              <View style={styles.InfoContainer}>
              <MaterialIcons name="bar-chart" size={20} color="#cfb536" style={{marginRight:8}}/>
            <Text style={styles.textStyle}>Average Rating: </Text>
            <Text style={styles.textStyle}>{lawyerDetails.averageRating}</Text>
          </View>
          <View style={styles.InfoContainer}>
          <MaterialIcons name="school" size={20} color="#cfb536" style={{marginRight:8}}/>
            <Text style={styles.textStyle}>Education: </Text>
            <Text style={styles.textStyle}>{lawyerDetails.education}</Text>
          </View>
          <View style={styles.InfoContainer}>
          <MaterialIcons name="work" size={20} color="#cfb536" style={{marginRight:8}}/>
            <Text style={styles.textStyle}>Experience: </Text>
            <Text style={styles.textStyle}>{lawyerDetails.experience} years</Text>
          </View>
          <View style={styles.InfoContainer}>
          <MaterialIcons name="phone" size={20} color="#cfb536" style={{marginRight:8}}/>
            <Text style={styles.textStyle}>Contact: </Text>
            <Text style={styles.textStyle}>{lawyerDetails.contact}</Text>
          </View>
            </View>
           {/* <View style={styles.StarContainer}>
            {[...Array(5)].map((_,index)=>(
              <TouchableOpacity key={index} onPress={()=>handleStarPress(index)}>
                <Ionicons name={index < rating ? "star": "star-outline"} size={20} color="#cfb536"/>
              </TouchableOpacity>
            ))}
           </View> */}

        </View>


        <View style={styles.SecondContainer}>
          <Text style={{ fontSize: 20, color: "black", fontWeight: "600", paddingHorizontal: 10, paddingVertical: 7 }}>Online Consultation</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10, paddingVertical: 5 }}>
            <Text style={{ fontWeight: "500", fontSize: 18 }}>Date</Text>
            <Text style={{ fontWeight: "500", fontSize: 18 }}>19.07.2023</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10, paddingVertical: 5 }}>
            <Text style={{ fontWeight: "500", fontSize: 18 }}>Time Slot</Text>
            <Text style={{ fontWeight: "500", fontSize: 18 }}>10am - 11am</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10, paddingVertical: 5 }}>
            <Text style={{ fontWeight: "500", fontSize: 18 }}>Amount</Text>
            <Text style={{ fontWeight: "500", fontSize: 18 }}>$15</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10, paddingVertical: 5 }}>
            <Text style={{ fontWeight: "500", fontSize: 18 }}>Platform Fee 0.15</Text>
            <Text style={{ fontWeight: "500", fontSize: 18 }}>$2.25</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10, paddingVertical: 5 }}>
            <Text style={{ fontWeight: "500", fontSize: 18 }}>Total</Text>
            <Text style={{ fontWeight: "500", fontSize: 18 }}>$17.25</Text>
          </View>
          <View style={styles.LineContainer}>
            <Svg height="1" width="100%">
              <Line x1="0" y1="0" x2="100%" y2="0" stroke="black" strokeWidth="1" />
            </Svg>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10, paddingVertical: 5 }}>
            <Pressable onPress={createChat} style={{ width: 160, backgroundColor: "#313742", padding: 15, marginTop: 40, marginLeft: 2, marginRight: 10, borderRadius: 6 }}>
            <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, color: "white" }}>Message</Text>
            </Pressable>
            <Pressable onPress={handleRateLawyer} style={{ width: 160, backgroundColor: "#313742", padding: 15, marginTop: 40, marginLeft: 10, marginRight: 2, borderRadius: 6 }}>
            <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, color: "white" }}>Rate Lawyer</Text>
            </Pressable>
          </View>
        </View>
      </View>
      <RateLawyerModal visible={isModalVisible} onClose={handleCloseModal} onRate={handleRate} />
    </SafeAreaView>

  )
}

export default LawyerProfile

const styles = StyleSheet.create({
  ImageContainer: {
    flex: 2,
  },
  ImageBackground:{
    flex: 1,
    resizeMode: 'cover',
  },
  image:{
    opacity: 0.8,
  },
  MainContainer: {
    flex: 5,
    paddingHorizontal:20,
  },
  OverlayContainer:{
    backgroundColor: 'rgba(255, 2555, 255, 0.9)',
    height: 'auto',
    top: -140,
    borderRadius: 7,
    alignItems: 'center',
    // Add shadow properties
    shadowColor: '#000',
    shadowOpacity: 0.9,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 10, // Android only
    paddingBottom: 2,
  },
  profileContainer: {
    top: -40, // Adjust this value as needed for the position of the profile picture container
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 0,
  },
  NameContainer:{
    top: -31,
  },
  LawyerName:{
    fontWeight: '600',
    fontSize: 20,
    color: 'black'
  },
  SubTitle:{
    fontSize: 18,
    color: 'rgba(74, 154, 192, 1)',
    fontWeight: '800',
    textAlign:'center',
  },
  StarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  InfoContainer :{
    flexDirection: "row", 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  textStyle:{
    fontWeight: "500", 
    fontSize: 18,
  },
  SecondContainer: {
    height: "auto",
    top: -120,
  }

})