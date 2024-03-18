import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useEffect, useContext, useState, useCallback } from "react";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { UserType } from "../UserContext";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Linking, Alert } from 'react-native';
import io from "socket.io-client";

// Inside your component
<FontAwesome name="star" size={30} color="#900" />;

function Blog2() {
    const navigation = useNavigation();

    // Navigating to creating post//
    const handlePress = () => {
        navigation.navigate('Blogs');
    };

    const { userId, setUserId } = useContext(UserType);
    const [posts, setPosts] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            // const token = await AsyncStorage.getItem("authToken");
            // const decodedToken = jwt_decode(token);
            // const userId = decodedToken.userId;
            setUserId(userId);
        };
        fetchUsers();
    }, []);

    // Displaying posts as soon they are shared
    // useEffect(() => {
    //     fetchPosts();
    // }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get("http://10.0.2.2:4000/get-posts");
            setPosts(response.data);
        } catch (error) {
            console.log("error fetching posts", error);
        }
    };

    // Socket connection
    useEffect(() => {
        const newSocket = io('http://10.0.2.2:4000');
        setSocket(newSocket);

        return () => newSocket.disconnect();
    }, []);

    // Receiving posts from the server
    useEffect(() => {
        if (!socket) return;
        socket.on('receivePostMessage', data => {
            console.log('Received new post:', data);
            console.log('Current user ID:', userId);
            setPosts(prevPosts => [...prevPosts, data]);
        });

        return () => {
            socket.off('receivePostMessage');
        };
    }, [socket, posts, userId]);

    useEffect(() => {
        fetchPosts();
    }, []);

    // Function to delete a post
    const handleDelete = async (postId) => {
        try {
            await axios.delete(`http://10.0.2.2:4000/delete-post/${postId}`);
            socket.emit("delete_post", postId);
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    useEffect(() => {
        if (!socket) return;

        socket.on('postDeleted', (postId) => {
            setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
        });

        return () => {
            socket.off('postDeleted');
        };
    }, [socket, posts]);

    // POST LIKE
    const handleLike = async (postId) => {
        try {
            const response = await axios.put(
                `http://10.0.2.2:4000/posts/${postId}/${userId}/like`
            );
            const updatedPost = response.data;
        } catch (error) {
            console.log("Error liking the post", error);
        }
    };

    useEffect(() => {
        if (!socket) return;

        socket.on("postLiked", (updatedPost) => {
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === updatedPost._id ? updatedPost : post
                )
            );
        });

        return () => {
            socket.off("postLiked");
        };
    }, [socket]);

    // POST DISLIKE
    const handleDislike = async (postId) => {
        try {
            const response = await axios.put(
                `http://10.0.2.2:4000/posts/${postId}/${userId}/unlike`
            );
            const updatedPost = response.data;
            const updatedPosts = posts.map((post) =>
                post._id === updatedPost._id ? updatedPost : post
            );

            setPosts(updatedPosts);
        } catch (error) {
            console.error("Error unliking post:", error);
        }
    };

    useEffect(() => {
        if (!socket) return;

        socket.on('postUnliked', (updatedPost) => {
            setPosts(prevPosts => prevPosts.map(post => post._id === updatedPost._id ? updatedPost : post));
        });

        return () => {
            socket.off('postUnliked');
        };
    }, [socket]);


    return (
        <ScrollView style={{ marginTop: 15, flex: 1, backgroundColor: "white" }}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Blogs & Articles</Text>
                <TouchableOpacity onPress={handlePress}>
                    <Ionicons name="create" size={30} color="black" />
                </TouchableOpacity>
            </View>

            <View style={{ marginTop: 0 }}>
                {posts?.map((post) => {
                    return (
                        <View
                            key={post?._id}
                            style={{
                                padding: 15,
                                borderColor: "#D0D0D0",
                                borderTopWidth: 1,
                                flexDirection: "row",
                                gap: 8,
                                marginVertical: 10,
                            }}
                        >
                            <View>
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
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 17, fontWeight: "bold", marginBottom: 10, marginTop: 8 }} >
                                    {post?.author}
                                </Text>


                                <View style={{marginLeft:-45,marginTop:15}}>

                                    <Text style={{ fontSize: 15, color: 'black' ,textAlign:"justify"}}>{post?.content}</Text>

                                    <TouchableOpacity onPress={() => Linking.openURL(post?.url)}>
                                        <Text style={{ color: 'blue', fontSize: 15,textAlign:'justify'}}>{post?.url}</Text>
                                    </TouchableOpacity>

                                    {post.image && (
                                        <Image
                                            source={{ uri: `data:image/jpeg;base64,${post.image}` }}
                                            style={styles.postImage}
                                        />
                                    )}

                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10, }}>
                                        {post?.likes?.includes(userId) ? (
                                            <AntDesign
                                                onPress={() => handleDislike(post?._id)}
                                                name="heart"
                                                size={18}
                                                color="red"
                                            />
                                        ) : (
                                            <AntDesign
                                                onPress={() => handleLike(post?._id)}
                                                name="hearto"
                                                size={18}
                                                color="black"
                                            />
                                        )}
                                        {post.user && post.user._id === userId && (
                                            <TouchableOpacity onPress={() => Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [{ text: 'Cancel' }, { text: 'Delete', onPress: () => handleDelete(post._id) }])}>
                                                <AntDesign name="delete" size={18} color="red" />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                    <Text style={{ marginTop: 7, color: "gray" }}>
                                        {post?.likes?.length} likes
                                    </Text>
                                </View>
                            </View></View>
                    );
                })}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#f0f0f0', // Background color for the header
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',

    },
    postImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 10,
        marginTop: 20,
    },
});

export default Blog2;
