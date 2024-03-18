import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import PieChartComponent from '../components/PieChart'; // Import PieChartComponent
import BarChartComponent from '../components/Barchart';
import LineChartComponent from '../components/Areachart';
import LineChart2Component from '../components/Areachart2';
import PieChart2Component from '../components/Literacyrate';
import PieChart3Component from '../components/PerFemaleJudges';
import axios from 'axios';

const Dashboard = () => {


    return (
        <View style={{ flex: 1, justifyContent: 'flex-start' }}>

            <ScrollView>
                <PieChartComponent />
                <BarChartComponent />
                <LineChartComponent />
                <LineChart2Component />
                <PieChart2Component />
                <PieChart3Component />
            </ScrollView>

        </View>



    );
};
export default Dashboard;
