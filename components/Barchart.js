import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { BarChart } from "react-native-gifted-charts";
import axios from 'axios';

const BarChartComponent = () => {
    const [barData, setBarData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://10.0.2.2:4000/api/combined-cases'); // Adjust the URL to your backend endpoint
            const transformedData = response.data.map(item => ({
                value: item.value,
                label: item.label,
                frontColor: item.frontColor,
                sideColor: item.sideColor,
                topColor: item.topColor
            }));
            setBarData(transformedData);
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

    return (

        <View
            style={{
                margin: 10,
                padding: 16,
                borderRadius: 20,
                backgroundColor: '#232B5D',
            }}>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                Cases over the past 3 years
            </Text>

            <View style={{ padding: 20, alignItems: 'center' }}>
                <BarChart
                    // rotateLabel
                    initialSpacing={16}
                    spacing={25}
                    yAxisThickness={0}
                    xAxisLabelTextStyle={{ color: 'lightgray', textAlign: 'center' }}
                    yAxisTextStyle={{ color: 'lightgray' }}
                    showFractionalValue
                    showYAxisIndices
                    hideRules
                    noOfSections={5}
                    maxValue={50000}
                    data={barData}
                    barWidth={28}
                    sideWidth={15}
                    isThreeD
                    isAnimated
                    side="right"
                    labelWidth={35}
                    yAxisLabelTexts={['0', '10k', '20k', '30k', '40k', '50k']}
                />
            </View>
        </View>
    );
}

export default BarChartComponent;





