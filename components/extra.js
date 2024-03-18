<PieChart
data={data}
// radius={150}
// innerRadius={20}
// outerRadius={100}
// labelStyle={{ fontSize: 12, color: 'white' }}
// labelTextStyle={{ fontSize: 14, color: 'white' }}
// labelRadius={110}
// colors={['#FF5733', '#FFC300', '#C70039', '#900C3F', '#581845']}
// backgroundColor="black"
/>



// PieChartComponent.js
import React from 'react';
import { View, Text } from 'react-native';
import { PieChart } from "react-native-gifted-charts";

const renderLegendComponent = () => {
    return (
        <>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: 10,
                    // height:200,
                }}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width:250,
                        // marginRight: 20,
                    }}>
                    {/* {renderDot('#006DFF')} */}
                    <Text style={{ color: 'white' }}>Excellent: 47%</Text>
                </View>

                <View
                    style={{ flexDirection: 'row', alignItems: 'center', width: 120 }}>
                    {/* {renderDot('#8F80F3')} */}
                    <Text style={{ color: 'white' }}>Okay: 16%</Text>
                </View>

            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: 120,
                        marginRight: 20,
                    }}>
                    {/* {renderDot('#3BE9DE')} */}
                    <Text style={{ color: 'white' }}>Good: 40%</Text>
                </View>
                <View
                    style={{ flexDirection: 'row', alignItems: 'center', width: 120 }}>
                    {/* {renderDot('#FF7F97')} */}
                    <Text style={{ color: 'white' }}>Poor: 3%</Text>
                </View>
            </View>
        </>
    );
};


const PieChartComponent = ({ data }) => {
    return (
        <View
            style={{
                paddingVertical: 10,
                backgroundColor: '#34448B',
                // flex: 2,
            }}>
            <View
                style={{
                    margin: 20,
                    padding: 16,
                    borderRadius: 20,
                    backgroundColor: '#232B5D',
                }}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' ,textAlign:'center'}}>
                    HIGH TRENDING CASES
                </Text>
                <View style={{ padding: 20, alignItems: 'center' }}>
                    <PieChart
                        data={data}
                        donut
                        showGradient
                        sectionAutoFocus
                        radius={90}
                        innerRadius={60}
                        innerCircleColor={'#232B5D'}
                        // centerLabelComponent={() => {
                        //     return (
                        //         <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        //             <Text
                        //                 style={{ fontSize: 22, color: 'white', fontWeight: 'bold' }}>
                        //                 Trending
                        //             </Text>
                        //             <Text style={{ fontSize: 14, color: 'white' }}>Cases</Text>
                        //         </View>
                        //     );
                        // }}
                    />
                </View>
                {renderLegendComponent()}
            </View>
        </View>
    );
};

export default PieChartComponent;




import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PieChartComponent from './components/PieChart'; // Import PieChartComponent
import axios from 'axios';

const Dashboard = () => {
  const [trendingCases, setTrendingCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:4000/api/trending-cases');
      const transformedData = response.data.map(item => ({ value: 1, label: item.category }));
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
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {trendingCases.length > 0 ? (
        <View>
          <PieChartComponent data={trendingCases} /> 
        </View>
      ) : (
        <View>
        <Text style={styles.noDataText}>No data available</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  noDataText: {
    fontSize: 18,
    marginTop: 20,
  },
});

export default Dashboard;



// piechart.js
// PieChartComponent.js
import React from 'react';
import { View, Text } from 'react-native';
import { PieChart } from "react-native-gifted-charts";


const PieChartComponent = ({ data }) => {
    return (
        //  Bg-Box
        <View
            style={{
                paddingVertical: 10,
                backgroundColor: '#34448B',
                // backgroundColor: 'black',
                width: 390,
                // flex: 2,
            }}>

            {/* Pie-Chart Box */}
            <View
                style={{
                    margin: 20,
                    padding: 16,
                    borderRadius: 20,
                    backgroundColor: '#232B5D',
                    height: 400,

                }}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
                    HIGH TRENDING CASES
                </Text>
                <View style={{ padding: 20, alignItems: 'center' }}>
                    <PieChart
                        data={data}
                        donut
                        showGradient
                        // sectionAutoFocus
                        radius={90}
                        innerRadius={60}
                        innerCircleColor={'#232B5D'}
                    />
                </View>
            </View>
        </View>
    );
};

export default PieChartComponent;


