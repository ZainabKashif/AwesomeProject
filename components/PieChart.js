// // PieChartComponent.js
// import React from 'react';
// import { useState, useEffect } from 'react';
// import { View, Text } from 'react-native';
// import { PieChart } from "react-native-gifted-charts";
// import axios from 'axios';

// const PieChartComponent = () => {
//     const [trendingCases, setTrendingCases] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         fetchData();
//     }, []);

//     // FETCHING TRENDING CASES DATA //
//     const fetchData = async () => {
//         try {
//             const response = await axios.get('http://10.0.2.2:4000/api/trending-cases');
//             const transformedData = response.data.map(item => ({ value: item.value, label: item.category }));
//             setTrendingCases(transformedData);
//             setLoading(false);
//             console.log('Fetched data:', transformedData);
//         } catch (error) {
//             setError(error);
//             setLoading(false);
//             console.error('Error fetching data:', error);
//         }
//     };

//     if (loading) {
//         return (
//             <View>
//                 <Text>Loading...</Text>
//             </View>
//         );
//     }

//     if (error) {
//         return (
//             <View>
//                 <Text>Error: {error.message}</Text>
//             </View>
//         );
//     }
//     return (
//         // Bg-Box
//         <View
//             style={{
//                 // paddingVertical: 6,
//                 // backgroundColor: '#34448B',
//                 // width: 400,
//                 // flex: 1,
//                 // justifyContent: 'flex-start', // Align component to the top
//                 // paddingTop: 10, // Add padding if necessary
//                 // paddingHorizontal: 2, // Add padding if necessary
//                 // backgroundColor: 'white', 
//             }}>

//             {/* Pie-Chart Box */}
//             <View
//                 style={{
//                     // margin: 15,
//                     // paddingTop: 25,
//                     // borderRadius: 20,
//                     // backgroundColor: '#232B5D',
//                     margin: 10,
//                     padding: 16,
//                     borderRadius: 20,
//                     backgroundColor: '#232B5D',
//                 }}>
//                 <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>High Trending Cases</Text>
//                 <View style={{ alignItems: 'center', paddingTop: 13 }}>
//                     <PieChart
//                         data={trendingCases}
//                         donut
//                         showGradient
//                         showValuesAsLabels
//                         showText
//                         textColor="black"
//                         textSize={20}
//                         radius={110}
//                         innerRadius={30}
//                         innerCircleColor={'#232B5D'}
//                     />
//                     <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
//                         {trendingCases.map((item, index) => (
//                             <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20, marginBottom: 10 }}>
//                                 <View style={{ width: 10, height: 10, backgroundColor: item.color, marginRight: 5 }} />
//                                 <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, }}>{item.label} ({item.value}%)</Text>
//                             </View>
//                         ))}
//                     </View>
//                 </View>

//             </View>
//         </View>
//     );
// };

// export default PieChartComponent;

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';

const TrendingCasesComponent = () => {
    const [trendingCases, setTrendingCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    // FETCHING TRENDING CASES DATA //
    const fetchData = async () => {
        try {
            const response = await axios.get('http://10.0.2.2:4000/api/trending-cases');
            const transformedData = response.data.map(item => ({ label: item.category, value: item.value }));
            setTrendingCases(transformedData);
            setLoading(false);
            console.log('Fetched data:', transformedData);
        } catch (error) {
            setError(error);
            setLoading(false);
            console.error('Error fetching data:', error);
        }
    };

    if (loading) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View>
                <Text>Error: {error.message}</Text>
            </View>
        );
    }

    // Define an array of pastel colors
    const pastelColors = [
        '#ADD8E6', // Light Blue
        '#B0E0E6', // Powder Blue
        '#87CEEB', // Sky Blue
        '#AFEEEE', // Pale Turquoise
        '#00CED1', // Dark Turquoise
      ];
    return (
        <View style={styles.container}>
            <Text style={styles.title}>High Trending Cases</Text>
            {trendingCases.map((item, index) => (
                <View key={index} style={[styles.card, { backgroundColor: pastelColors[index % pastelColors.length] }]}>
                    <Text style={styles.label}>{item.label}</Text>
                    {/* <Text style={styles.value}>{item.value}%</Text> */}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 10,
        padding: 16,
        borderRadius: 20,
        backgroundColor: '#232B5D',
    },
    title: {
        color: '#f5f5f5',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    card: {
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    label: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign:'center'
    },
    value: {
        color: 'white',
        fontSize: 14,
    },
});

export default TrendingCasesComponent;

