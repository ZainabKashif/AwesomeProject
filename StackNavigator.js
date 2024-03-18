import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import your screens here
import MainScreen from './screens/MainScreen';
import MainScreen2 from './screens/MainScreen2';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import LawyerProfile from './screens/LawyerProfile';
import FindLawyers from './screens/FindLawyers';
import ChatBot from './screens/ChatBot';
import ExploreGroupChats from './screens/ExploreGroupChats';
import Blogs from './screens/Blogs';
import LawyerRegister from './screens/LawyerRegister';
import ChatMessageScreen from './screens/ChatMessageScreen';
import CustomDrawer from './components/CustomDrawer';
import ChatsScreen from './screens/ChatsScreen';
import ChatMessage from './screens/ChatMessage';
import NewChatScreen from './screens/NewChatScreen';
import Blog2 from './screens/Blog2';
import Dashboard from './screens/Dashboard';

// Define your stack navigator
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Define your bottom tab navigator screens
// function BottomTabs() {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen
//         name="ChatScreen"
//         component={ChatsScreen}
//         options={{
//           tabBarLabel: "Chat",
//           tabBarLabelStyle: { color: "black" },
//           headerShown: false,
//           tabBarIcon: ({ focused }) =>
//             focused ? (
//               <Entypo name="home" size={24} color="black" />
//             ) : (
//               <AntDesign name="home" size={24} color="black" />
//             )
//         }} />
   
//     </Tab.Navigator>
//   );
// }

function DrawerRoutes() {
  return (
    <Drawer.Navigator screenOptions={{drawerLabelStyle:{marginLeft: -20, fontSize: 15, fontWeight:"800"}, drawerActiveBackgroundColor: "#313742", drawerActiveTintColor: '#fff'}} drawerContent={props=><CustomDrawer {...props}/>}>
    <Drawer.Screen name="FindLawyers" component={FindLawyers} options={{
      drawerIcon:({color})=>(
        <AntDesign name="home" size={24} color={color} />
      ),
    }}/>
    <Drawer.Screen name="Chatbot" component={ChatBot} options={{
      drawerIcon:({color})=>(
        <MaterialCommunityIcons name="robot-outline" size={24} color={color} />
      )
    }} />
    <Drawer.Screen name="GroupChats" component={ExploreGroupChats}  options={{
      drawerIcon:({color})=>(
        <Ionicons name="chatbubbles-outline" size={24} color={color} />
      )
    }}/>
    <Drawer.Screen name="Blog2" component={Blog2} options={{
      drawerIcon:({color})=>(
        <Ionicons name="reader-outline" size={24} color={color}/>
      )
    }} />
    <Drawer.Screen name="MyChats" component={ChatsScreen} options={{
      drawerIcon:({color})=>(
        <Ionicons name="chatbubble-ellipses-outline" size={24} color={color}/>
      )
    }} />
    <Drawer.Screen name="Dashboard" component={Dashboard} options={{
      drawerIcon:({color})=>(
        <MaterialCommunityIcons name="view-dashboard-edit-outline" size={24} color={color}/>
      )
    }} />
  </Drawer.Navigator>
  )
}

// Define your stack navigator screens
const StackApp = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name='Main' component={MainScreen} options={{ headerShown: false }} />
      <Stack.Screen name='Main2' component={MainScreen2} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name='LawyerProfile' component={LawyerProfile} options={{ headerShown: false }} />
      <Stack.Screen name='DrawerRoutes' component={DrawerRoutes} options={{ headerShown: false }} />
      <Stack.Screen name='LawyerRegister' component={LawyerRegister} options={{ headerShown: false }} />
      <Stack.Screen name="Messages" component={ChatMessageScreen} />
      <Stack.Screen name="MessageAgain" component={ChatMessage}/>
      <Stack.Screen name="CreateNewChat" component={NewChatScreen}/>
      <Stack.Screen name="Blogs" component={Blogs} options={{ headerTitle: 'Contribute Your Voice', }} />
    </Stack.Navigator>
    </NavigationContainer>
  );
}

export default StackApp;
