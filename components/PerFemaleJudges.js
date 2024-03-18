import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { PieChart } from "react-native-gifted-charts";
import axios from 'axios';

const PieChart3Component = () => {
    const [trendingCases, setTrendingCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    // FETCHING TRENDING CASES DATA //
    const fetchData = async () => {
        try {
            const response = await axios.get('http://10.0.2.2:4000/api/female-judges');
            const transformedData = response.data.map((item, index) => ({
                value: item.value,
                label: item.category,
                color: getColor(index), // Assign color dynamically based on index
            }));
            setTrendingCases(transformedData);
            setLoading(false);
            console.log('Fetched data:', transformedData);
        } catch (error) {
            setError(error);
            setLoading(false);
            console.error('Error fetching data:', error);
        }
    };

    // Function to generate colors dynamically
    const getColor = (index) => {
        const colors = ['#F4D03F', '#58D68D', '#3498DB', '#EC7063', '#AF7AC5'];
        return colors[index % colors.length]; // Use index to cycle through colors
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

    return (
        // Bg-Box
        <View
            style={{

            }}>

            {/* Pie-Chart Box */}
            <View
                style={{
                    margin: 10,
                    padding: 16,
                    borderRadius: 20,
                    backgroundColor: '#232B5D',
                }}>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>Percenatage of Female Judges in Pakistan</Text>
                <View style={{ alignItems: 'center', paddingTop: 13 }}>
                    <PieChart
                        data={trendingCases}
                        donut
                        // showGradient
                        // showValuesAsLabels
                        showText
                        textColor="black"
                        textSize={17}
                        radius={130}
                        innerRadius={60}
                        innerCircleColor={'#232B5D'}
                    />
                    <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {trendingCases.map((item, index) => (
                            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20, marginBottom: 10 }}>
                                <View style={{ width: 10, height: 10, backgroundColor: item.color, marginRight: 5 }} />
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{item.label} ({item.value}%)</Text>
                            </View>
                        ))}
                    </View>
                </View>

            </View>
        </View>
    );
};

export default PieChart3Component;
