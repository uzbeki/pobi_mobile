import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Image, PermissionsAndroid, TouchableOpacity } from 'react-native'
import tw from 'tailwind-react-native-classnames';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
// import Geolocation from 'react-native-geolocation-service';
import * as Location from 'expo-location';
// import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { globalUserContext } from '../global/globalContext';
import { GOOGLE_MAPS_API_KEY } from '@env'
import { Button } from 'react-native-elements';



const requestPermission = async () => {
    Location.installWebGeolocationPolyfill();
    // Location.PermissionStatus.GRANTED
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== PermissionsAndroid.RESULTS.GRANTED) {
        setErrorMsg('Permission to access foreground location was denied');
        return;
    }

    let location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true
    });
    // setLocation(location);
    // console.log(location)
    return location;
};





const InputScreen = () => {
    const navigation = useNavigation();
    const { travel, setTravel } = useContext(globalUserContext)
    const [location, setLocation] = useState(null);

    useEffect(() => {
        Location.installWebGeolocationPolyfill();
        // (async () => {
        //     let { status } = await Location.requestForegroundPermissionsAsync();
        //     if (status !== PermissionsAndroid.RESULTS.GRANTED) {
        //         setErrorMsg('Permission to access foreground location was denied');
        //         return;
        //     }

        //     let location = await Location.getCurrentPositionAsync({
        //         enableHighAccuracy: true
        //     });
        //     // setLocation(location);
        //     console.log(location)
        // })();
        requestPermission().then(location => {
            console.log(location)
            setLocation(location)
        })
    }, [])

    const goToMap = () => navigation.navigate('MapScreen');



    return (
        <SafeAreaView style={tw`bg-white h-full`}>
            <View style={tw`p-5`}>
                <Text>Input Screen</Text>
                <GooglePlacesAutocomplete
                    placeholder='Origin'
                    nearbyPlacesAPI='GooglePlacesSearch'
                    debounce={400} // dont search on every key stroke, wait for 400ms after stopped typing
                    returnKeyType='search' // search when return key is pressed
                    fetchDetails={true} // get address details, geometry, location, coordinates, etc.
                    onPress={(data, details = null) => {
                        // 'details' is provided when fetchDetails = true
                        setTravel({
                            ...travel,
                            origin: {
                                location: details.geometry.location,
                                address: details.formatted_address
                            }
                        })
                    }}
                    query={{
                        key: GOOGLE_MAPS_API_KEY,
                        language: 'en',
                    }}
                    minLength={2} // minimum length of text to search
                    enablePoweredByContainer={false} // remove powered by Google
                    enableHighAccuracyLocation={true}
                    styles={{
                        container: {
                            flex: 0,
                        },
                        textInput: {
                            fontSize: 18,
                        }
                    }}
                    currentLocation={true}
                />
                <GooglePlacesAutocomplete
                    placeholder='Destination'
                    nearbyPlacesAPI='GooglePlacesSearch'
                    debounce={400} // dont search on every key stroke, wait for 400ms after stopped typing
                    returnKeyType='search' // search when return key is pressed
                    fetchDetails={true} // get address details, geometry, location, coordinates, etc.
                    onPress={(data, details = null) => {
                        // 'details' is provided when fetchDetails = true
                        setTravel({
                            ...travel,
                            destination: {
                                location: details.geometry.location,
                                address: details.formatted_address
                            }
                        })
                    }}
                    query={{
                        key: GOOGLE_MAPS_API_KEY,
                        language: 'en',
                    }}
                    minLength={2} // minimum length of text to search
                    enablePoweredByContainer={false} // remove powered by Google
                    enableHighAccuracyLocation={true}
                    styles={{
                        container: {
                            flex: 0,
                        },
                        textInput: {
                            fontSize: 18,
                        }
                    }}
                    currentLocation={true}
                />
                
                <TouchableOpacity >
                    <Button onPress={goToMap} title='Go to Map'/>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default InputScreen

const styles = StyleSheet.create({
    text: {
        fontSize: 30,
        color: 'blue',
        fontWeight: 'bold'
    }
})


