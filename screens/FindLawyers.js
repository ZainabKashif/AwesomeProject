import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Modal, FlatList, } from 'react-native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import { SelectList } from 'react-native-dropdown-select-list'
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { UserType } from '../UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';
import { getSender } from '../config/ChatLogics';


const FindLawyers = () => {
    const navigation = useNavigation();
    const [selected, setSelected] = useState("");
    const {notification, setNotification, userId} = useContext(UserType);
    const [modalVisible, setModalVisible] = useState(false);
    const openModal = () => {
        setModalVisible(true);
    }

    const closeModal = () => {
        setModalVisible(false);
    }

    const data = [
        { key: '1', value: 'Prosecutor' },
        { key: '2', value: 'Family Lawyer' },
        { key: '3', value: 'Corporate lawyer' },
        { key: '4', value: 'Personal injury lawyer' },
        { key: '5', value: 'Maritime lawyers' },
        { key: '6', value: 'Counsel' },
        { key: '7', value: 'Workers compensation lawyer' },
    ]
    const [statusLawyers, setStatusLawyers] = useState([]);

    useEffect(()=>{
        fetchLawyers();
    },[]);

    const fetchLawyers = async() => {
        try{
            const response = await axios.get('http://10.0.2.2:4000/all-lawyers');
            if (response.status === 200){
                setStatusLawyers(response.data);
            }
        } catch(err){
            console.log('Error fetching lawyers', err);
        }
    };
    // console.log(statusLawyers);
   useEffect(()=>{
    console.log(notification, "------------- aya hay ya nae?");
   },[notification])

    const [statusUsers, setStatusUsers] = useState([
        { id: 1, name: 'Abdullah Khanzada', avatarUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D' },
        { id: 2, name: 'Maryam Khalid', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D' },
        { id: 3, name: 'Zainab Kashif', avatarUrl: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=600' },
        { id: 4, name: 'Alayna Khalid', avatarUrl: 'https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg' },
        { id: 5, name: 'Abdullah Khanzada', avatarUrl: 'https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg' },
        { id: 6, name: 'Fazal Baksh', avatarUrl: 'https://bootdey.com/img/Content/avatar/avatar6.png' },
        { id: 7, name: 'Hashim Kardar', avatarUrl: 'https://bootdey.com/img/Content/avatar/avatar7.png' },
        { id: 8, name: 'Zumar Yousuf', avatarUrl: 'https://bootdey.com/img/Content/avatar/avatar8.png' },
        { id: 9, name: 'Jihan Sikandar', avatarUrl: 'https://bootdey.com/img/Content/avatar/avatar1.png' },
        { id: 10, name: 'Ayesha Gul', avatarUrl: 'https://bootdey.com/img/Content/avatar/avatar2.png' },
    ])

    const LawyerListNearby = ({ lawyer }) => {

        // const baseUrl = "D:/Bot/y/AwesomeProject/api/files/";
        // const imageUrl = lawyer.image;
        // const filename = imageUrl.split("\\").pop();
        // const source = {uri: baseUrl + filename};
        // console.log(source);
        // const imageUrl = lawyer.image;
        // const filename = imageUrl.split('\\').pop();
        // console.log(filename);
        // const imageUri = `../images/${filename}`;
        // const sourcee = '../images/1708691287817-74863506-photo.jpg'
        const navigation = useNavigation();

        const goToLawyerProfile = (lawyerId) =>{
            navigation.navigate('LawyerProfile', {lawyerId});
        };
        const base64Image = lawyer.image;
        return (
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{lawyer.name}</Text>
                    <Text style={styles.headerSubtitle}>
                        {lawyer.email}
                    </Text>
                </View>

                <View style={styles.body}>
                    <Image source={{uri: `data:image/jpeg;base64,${base64Image}`}} style={styles.avatar} />
                    <View style={styles.userInfo}>
                        <TouchableOpacity onPress={()=>goToLawyerProfile(lawyer._id)}>
                        <Text style={styles.userName}>{lawyer.specialization}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };


    const UserListItem = ({ user }) => (
        <View style={styles.userItem}>
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
            <Text style={styles.statusUserName} ellipsizeMode='tail' numberOfLines={1}>{user.name}</Text>
        </View>
    );

    const NotificationModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    closeModal();
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeader}>Notifications</Text>
                        <FlatList
                            data={notification}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.notificationItem}>
                                    <Text>{item.chat.isGroupChat ? `New message in ${item.chat.chatName}` :`New message from ${getSender(userId, item.chat.users)}`}</Text>
                                </View>
                            )}
                        />
                        <TouchableOpacity style={styles.closeButton} onPress={() => closeModal()}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{ paddingHorizontal: 20, paddingTop:10 }}>
                <Text style={{ color: "#294c85", fontSize: 20, fontWeight: "900" }}>Filter Results</Text>
            </View>
            <TouchableOpacity onPress={() => openModal()} style={styles.notificationIconContainer}>
                    <FontAwesome name="bell" size={25} color="#294c85" />
                    {/* {notification.length > 0 && <View style={styles.notificationCountContainer}>
                        <Text style={styles.notificationCountText}>{notification.length}</Text>
                    </View>} */}
                    <View style={styles.notificationCountContainer}>
                    <Text style={styles.notificationCountText}>{notification.length}</Text>
                    </View>
                </TouchableOpacity>
                </View>
            <View style={{ flexDirection: "row", padding: 0 }}>
                <SelectList
                    setSelected={(val) => setSelected(val)}
                    data={data}
                    save="value"
                    boxStyles={{ borderWidth: 0, borderColor: "transparent" }}
                    inputStyles={{ fontSize: 15, padding: 0, color: "#294c85" }}
                    placeholder='Lawyers by Categories'
                    dropdownTextStyles={{ margin: 0, color: "#294c85" }}
                    dropdownStyles={{ borderWidth: 0, borderColor: "transparent", margin: 0 }}
                />
                <SelectList
                    setSelected={(val) => setSelected(val)}
                    data={data}
                    save="value"
                    boxStyles={{ borderWidth: 0, borderColor: "transparent" }}
                    inputStyles={{ fontSize: 15, padding: 0, color: "#294c85" }}
                    placeholder='Lawyers by Pricing'
                    dropdownTextStyles={{ margin: 0, color: "#294c85" }}
                    dropdownStyles={{ borderWidth: 0, borderColor: "transparent", margin: 0 }}
                />
            </View>
            <View style={{ paddingHorizontal: 15 }}>
                <Text style={{ color: "#294c85", fontSize: 20, fontWeight: "900" }}>Nearby Lawyers</Text>
            </View>
            <ScrollView horizontal>
                <View style={styles.userContainer}>
                    {statusLawyers.map(lawyer => <LawyerListNearby key={lawyer.id} lawyer={lawyer} />)}
                </View>
            </ScrollView>

            {/* <FlatList
                data={posts}
                contentContainerStyle={styles.postListContainer}
                keyExtractor={post => post.id.toString()}
                renderItem={({ item }) => <PostCard post={item} />}

            /> */}

            <View style={{ paddingHorizontal: 15 }}>
                <Text style={{ color: "#294c85", fontSize: 20, fontWeight: "900" }}>People with similar interests</Text>
            </View>

            <ScrollView horizontal>
                <View style={styles.userContainer}>
                    {statusUsers.map(user => <UserListItem key={user.id} user={user} />)}
                </View>
            </ScrollView>



            <View style={{ paddingHorizontal: 15 }}>
                <Text style={{ color: "#294c85", fontSize: 20, fontWeight: "900" }}>Famous Lawyers</Text>
            </View>
            <ScrollView horizontal>
                <View style={styles.userContainer}>
                    {statusLawyers.map(lawyer => <LawyerListNearby key={lawyer.id} lawyer={lawyer} />)}
                </View>
            </ScrollView>

            <View style={{ paddingHorizontal: 15 }}>
                <Text style={{ color: "#294c85", fontSize: 20, fontWeight: "900" }}>People with similar interests</Text>
            </View>

            <ScrollView horizontal>
                <View style={styles.userContainer}>
                    {statusUsers.map(user => <UserListItem key={user.id} user={user} />)}
                </View>
            </ScrollView>
            </ScrollView>
            <NotificationModal />
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    notificationIconContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    notificationCountContainer: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationCountText: {
        color: '#fff',
        fontSize: 12,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    notificationItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        alignSelf: 'flex-end',
    },
    closeButtonText: {
        fontWeight: 'bold',
    },
    // container: {
    //     paddingTop: 10,
    //     paddingBottom: 10,
    //     backgroundColor: "white",
    // },
    userContainer: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#fff',
        height: "auto",
    },
    postListContainer: {
        paddingTop: 20,
        paddingHorizontal: 15,
    },
    postCard: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    postAvatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
    },
    postUsername: {
        flex: 1,
    },
    postDate: {
        fontSize: 12,
        color: '#A9A9A9',
    },
    postDescription: {
        fontSize: 16,
        color: '#00008B'
    },
    postImage: {
        marginTop: 0,
        width: '100%',
        height: 200,
    },
    postFooter: {
        flexDirection: 'row',
        marginTop: 0,
    },
    postButton: {
        marginRight: 10,
    },
    postButtonText: {
        color: '#808080'
    },
    card: {
        flex: 1,
        backgroundColor: '#313742',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        marginBottom: 16,
        padding: 16,
        marginHorizontal: 10,
    },
    header: {
        marginBottom: 8,
    },
    headerTitle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#ffffff',
    },
    body: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginRight: 8,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
        paddingLeft: 10,
    },
    userRole: {
        fontSize: 12,
        color: '#ffffff',
    },
    userItem: {
        marginRight: 10,
        alignItems: 'center',
        marginLeft: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    statusUserName: {
        marginTop: 5,
        fontSize: 12,
        color: '#483D8B',
        width: 60,
        textAlign: 'center'
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
});


export default FindLawyers

