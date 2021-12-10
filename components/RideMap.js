import React, { useContext, useEffect, useRef, useState } from 'react'
import { Dimensions, StyleSheet, Text, View, ActivityIndicator, PermissionsAndroid } from 'react-native'
import MapView, { Marker } from 'react-native-maps';
// import { useDispatch, useSelector } from 'react-redux';
import tw from 'tailwind-react-native-classnames';
// import { selectDestination, selectOrigin, setTravelInformation } from '../slices/navSlice';
// import MapViewDirections from 'react-native-maps-directions';
// import { Tooltip } from 'react-native-elements';
// import { GOOGLE_MAPS_API_KEY } from '@env'
// import { globalUserContext } from '../global/globalContext';
// import { requestPermission } from '../utils/mapUtils'
import * as Location from 'expo-location';
// const { width, height } = Dimensions.get('window');

const initial = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
}


const Map = () => {
    const [currentLocation, setCurrentLocation] = useState(initial)
    const mapRef = useRef(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Permission to access foreground location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({
                enableHighAccuracy: true
            });
            setCurrentLocation({ ...location.coords, latitudeDelta: 0.05, longitudeDelta: 0.05 });
            console.log("location==> ", location);
        })();

        return () => setCurrentLocation(initial);
    }, [])

    
    

    return (
        <MapView
            style={tw`h-full`}
            ref={mapRef}
            initialRegion={currentLocation}
            region={currentLocation}
            showsUserLocation={true}
            showsMyLocationButton={false}
            onUserLocationChange={(e) => {
                console.log("user location change", e);
                setCurrentLocation({ ...e.nativeEvent.coordinate, latitudeDelta: 0.05, longitudeDelta: 0.05 });
            }}
        />
        // <Text>Map</Text>
    )
}

export default Map

// const styles = StyleSheet.create({})


// const Loading = () => {
//     return (
//         <View style={tw`flex-1 justify-center items-center flex-row p-3`}>
//             <ActivityIndicator size='large' color='#000000' />
//         </View>
//     )
// }