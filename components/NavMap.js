import React, { useContext, useEffect, useRef } from 'react'
import { Dimensions, StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import MapView, { Marker } from 'react-native-maps';
// import { useDispatch, useSelector } from 'react-redux';
import tw from 'tailwind-react-native-classnames';
// import { selectDestination, selectOrigin, setTravelInformation } from '../slices/navSlice';
import MapViewDirections from 'react-native-maps-directions';
import { Tooltip } from 'react-native-elements';
import { GOOGLE_MAPS_API_KEY } from '@env'
import { globalUserContext } from '../global/globalContext';

const { width, height } = Dimensions.get('window');


const Map = () => {

    const mapRef = useRef(null);
    const { travel, setTravel } = useContext(globalUserContext);

    // if (!travel.origin || !travel.destination) return <Loading />
    // if (!travel.origin || !travel.destination) return null;
    
    // useEffect(() => {
    // }, [travel])


    return (
        <MapView
            style={tw`flex-1`}
            ref={mapRef}
            mapType="mutedStandard"  //standard, satellite, hybrid, terrain
            initialRegion={{
                latitude: travel.origin.location.lat,
                longitude: travel.origin.location.lng,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            }}
            onPress={(e) => {
                console.log('press')
                console.log(e.nativeEvent)
                /* e.nativeEvent
                    "action": "press",
                    "coordinate": Object {
                        "latitude": 35.959195514778784,
                        "longitude": 140.07390461862087,
                    },
                    "position": Object {
                        "x": 541,
                        "y": 484,
                    }, */
            }}
        >
            {travel.origin && travel.destination && (
                <MapViewDirections
                    origin={travel.origin.address}
                    destination={travel.destination.address}
                    apikey={GOOGLE_MAPS_API_KEY}
                    strokeWidth={4}
                    strokeColor="black"
                    lineCap="round"
                    mode='DRIVING' // DRIVING, WALKING, BICYCLING, TRANSIT
                    lineDashPattern={[1]}
                    waypoints={undefined}
                    onReady={result => {
                        // result.coordinates is a long array containing latitude, longitude of full route
                        console.log(`Distance: ${result.distance} km`)
                        console.log(`Duration: ${result.duration} min.`)

                        mapRef.current.fitToCoordinates(result.coordinates, {
                            edgePadding: {
                                right: (width / 20),
                                bottom: (height / 20),
                                left: (width / 20),
                                top: (height / 20),
                            }
                        });
                    }}
                />
            )}
            {travel.origin?.location &&
                <Marker
                    coordinate={{
                        latitude: travel.origin.location.lat,
                        longitude: travel.origin.location.lng,
                    }}
                    title="Origin"
                    description={travel.origin.address}
                    identifier="origin"
                />
            }
            {travel.destination?.location &&
                <Marker
                    coordinate={{
                        latitude: travel.destination.location.lat,
                        longitude: travel.destination.location.lng,
                    }}
                    title="Destination"
                    description={travel.destination.address}
                    identifier="destination"
                />
            }
        </MapView>
    )
}

export default Map

// const styles = StyleSheet.create({})


const Loading = () => {
    return (
        <View style={tw`flex-1 justify-center items-center flex-row p-3`}>
            <ActivityIndicator size='large' color='#000000'/>
        </View>
    )
}