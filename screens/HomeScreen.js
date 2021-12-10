import React from 'react'
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, TouchableOpacityBase } from 'react-native'
import tw from 'tailwind-react-native-classnames'
// import Map from "../components/Map";
// import MapView from 'react-native-maps';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import NavigateCard from '../components/NavigateCard';
// import RideOptionsCard from '../components/RideOptionsCard';
import { Button, Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import RideMap from '../components/RideMap'

const Stack = createNativeStackNavigator();


const HomeScreen = () => {

    return (
        <View>
            <TouchableOpacity style={tw`absolute bg-gray-100 top-10 left-8 z-50 p-3 rounded-full shadow-lg`}
                onPress={() => console.log('hello')}>
                <Icon name='menu'></Icon>
            </TouchableOpacity>
            <View style={tw`h-full`}>
                {/* <TouchableOpacity style={tw`w-40 m-auto`} onPress={()=>{}}>
                    <Button title="Go to Ride Map" />
                </TouchableOpacity> */}
                <RideMap />

            </View>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})
