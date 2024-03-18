import React, { useState } from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const RateLawyerModal = ({ visible, onClose, onRate }) => {
  const [rating, setRating] = useState(0);

  const handleStarPress = (starIndex) => {
    setRating(starIndex + 1);
  };

  const handleSubmitRating = () => {
    onRate(rating);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Rate Lawyer</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
            {[...Array(5)].map((_, index) => (
              <Pressable key={index} onPress={() => handleStarPress(index)}>
                <Ionicons name={index < rating ? "star" : "star-outline"} size={30} color="#cfb536" style={{ marginHorizontal: 5 }} />
              </Pressable>
            ))}
          </View>
          <Pressable style={{ backgroundColor: '#cfb536', padding: 10, borderRadius: 5 }} onPress={handleSubmitRating}>
            <Text style={{ color: 'white', textAlign: 'center' }}>Submit Rating</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default RateLawyerModal;
