import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { LineChart } from "react-native-gifted-charts";
import axios from 'axios';

const LineChartComponent = () => {
    const [lineData1, setLineData1] = useState([]);
    const [lineData2, setLineData2] = useState([]);
    const [lineData3, setLineData3] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response2019 = await axios.get('http://10.0.2.2:4000/api/comparing-cases?year=2019');
            const response2020 = await axios.get('http://10.0.2.2:4000/api/comparing-cases?year=2020');
            const response2021 = await axios.get('http://10.0.2.2:4000/api/comparing-cases?year=2021');

            const data2019 = response2019.data.map(item => ({
                
                label: item.Year,
                value: item.Killed,
              
            }));

            const data2020 = response2020.data.map(item => ({
                 label: item.Year,
                value: item.Killed,
              
            }));

            const data2021 = response2021.data.map(item => ({
                label: item.Year,
                value: item.Killed,
            }));

            setLineData1(data2019);
            setLineData2(data2020);
            setLineData3(data2021);

            setLoading(false);
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
            Trends in Women's Killings
            </Text>

            <View style={{ padding: 10, alignItems: 'center' }}>
                <LineChart
                    areaChart
                    curved
                    data={lineData1}
                    data2={lineData2}
                    data3={lineData3}
                    height={250}
                    showVerticalLines
                    spacing={100}
                    initialSpacing={20}
                    // color1="skyblue"
                    // color2="orange"
                    // color3="green"
                    // textColor1="green"
                    // textColor2="red"
                    // textColor3="blue"
                    // hideDataPoints
                    dataPointsColor1="red"
                    // dataPointsColor2="red"
                    // dataPointsColor3="red"
                    startFillColor1="skyblue"
                    startFillColor2="orange"
                    startFillColor3="green"
                    startOpacity={0.8}
                    endOpacity={0.3}
                    // rotateLabel
                    noOfSections={4}
                    maxValue={3000}
                    width={300}
                    yAxisThickness={0}
                    xAxisLabelTextStyle={{ color: 'lightgray', textAlign: 'center' }}
                    yAxisTextStyle={{ color: 'lightgray' }}
                />
            </View>

        </View>
    );
};

export default LineChartComponent;
