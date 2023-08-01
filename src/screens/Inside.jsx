import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Entypo';

import Home from './Home'
import Choice from './Choice'
import Demand from './Demand'
import Status from './Status'

const Tab = createBottomTabNavigator()

export default function Inside() {

    return(
            <Tab.Navigator
                InitialRouteName="Inicio"    
            >
                <Tab.Screen 
                    name="Inicio"
                    component={Home}
                    options={{
                        tabBarIcon: ({color, size}) => (
                            <Icon name='home' size={35} />
                        ),
                    }} 
                />
                <Tab.Screen
                    name="Escolher"
                    component={Choice}
                    options={{
                        tabBarIcon: ({color, size}) => (
                            <Icon name='list' size={35} />
                        ),
                    }} 
                />
                <Tab.Screen
                    name="Pedido"
                    component={Demand}
                    options={{
                        tabBarIcon: ({color, size}) => (
                            <Icon name='shop' size={35} />
                        ),
                    }} 
                />
                <Tab.Screen
                    name="Developer" 
                    component={Status}
                    options={{
                        tabBarIcon: ({color, size}) => (
                            <Icon name='keyboard' size={35} />
                        ),
                    }} 
                />
            </Tab.Navigator>
    )   
}