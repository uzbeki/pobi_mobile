import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, Text, View, Image, ActivityIndicator, PermissionsAndroid } from "react-native";
import MapView, { Marker } from "react-native-maps";
// import { useDispatch, useSelector } from 'react-redux';
import tw from "tailwind-react-native-classnames";
// import { selectDestination, selectOrigin, setTravelInformation } from '../slices/navSlice';
// import MapViewDirections from 'react-native-maps-directions';
// import { Tooltip } from 'react-native-elements';
// import { GOOGLE_MAPS_API_KEY } from '@env'
// import { globalUserContext } from '../global/globalContext';
// import { requestPermission } from '../utils/mapUtils'
import * as Location from "expo-location";
import { button } from "aws-amplify";
// const { width, height } = Dimensions.get('window');
import { API } from "aws-amplify";
import { onUpdatePeopleLocationByRideEvent } from "../src/graphql/subscriptions";
import { tryUpdatePeopleLocation } from "../utils/PeopleLocation";

const avatar_1 = require("../assets/images/avatar-1.jpg");
const avatar_2 = require("../assets/images/avatar-2.jpg");

const initial = {
    latitude: 35.6804,
    longitude: 139.769,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
};
const myUserInfo = { id: "okuda" };
// const myUserInfo = { id: "beki" };

const Map = () => {
    const [myLocation, setMyLocation] = useState(initial);
    const [peopleMarkers, setPeopleMarkers] = useState([]);
    const [regionByUser, setRegionByUser] = useState(null);
    // const [myMarker, setMyMarker] = useState(null);
    // const [shouldTrack, setShouldTrack] = useState(true);
    const mapRef = useRef(null);

    useEffect(() => {
        let subscriptionToUpdateLocation;
        (async () => {
            //初めての位置情報取得
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== PermissionsAndroid.RESULTS.GRANTED) {
                console.log("Permission to access foreground location was denied");
                return;
            }
            let location = await Location.getCurrentPositionAsync({
                enableHighAccuracy: true,
            });
            //マップの中央を現在地に設定
            // setRegion({ ...location.coords, latitudeDelta: 0.05, longitudeDelta: 0.05 });
            setMyLocation({ ...location.coords, latitudeDelta: 0.05, longitudeDelta: 0.05 });
            const subscribeToUpdateLocation = async () => {
                subscriptionToUpdateLocation = await API.graphql({
                    query: onUpdatePeopleLocationByRideEvent,
                    variables: {
                        ride_event: "test0",
                    },
                }).subscribe({
                    next: event => {
                        console.log("subscription");
                        const newUserLocation = event.value.data.onUpdatePeopleLocationByRideEvent;
                        // console.log("newUserLocation =>", newUserLocation);

                        if (newUserLocation.user === myUserInfo.id) {
                            console.log("ほかのユーザーの位置情報が取得できません。");

                            return;
                        } else {
                            //新しい位置情報と一致するマーカーのインデックスを取得
                            const newUserLocIndex = peopleMarkers.findIndex(
                                marker => marker.user === newUserLocation.user
                            );
                            if (newUserLocIndex === -1) {
                                //新規ユーザーのマーカーを追加
                                console.log("add new user");
                                peopleMarkers.push(newUserLocation);
                                setPeopleMarkers(peopleMarkers);
                            } else {
                                //既存ユーザーのマーカーを更新
                                console.log("update marker");
                                peopleMarkers[newUserLocIndex] = {
                                    ...newUserLocation,
                                    title: newUserLocation.user,
                                    description: `This is ${newUserLocation.user}`,
                                    avatar: avatar_1,
                                    // avatar: avatar_2,
                                };
                                setPeopleMarkers(peopleMarkers);
                            }
                        }
                    },
                    error: error => console.warn(error),
                });
            };
            subscribeToUpdateLocation();

            // setMyLocation({ ...location.coords, latitudeDelta: 0.05, longitudeDelta: 0.05 });
            // console.log("location==> ", location);
        })();

        return () => {
            subscriptionToUpdateLocation.unsubscribe();
        };
    }, []);
    // const getPositionCallBack = async location => {
    //     console.log("loc==> ", location);
    //     if (!myMarker) {
    //         console.log("first");
    //         setMyMarker({
    //             latitude: location.coords.latitude,
    //             longitude: location.coords.longitude,
    //             latitudeDelta: 0.05,
    //             longitudeDelta: 0.05,
    //             title: "MY Marker ",
    //             description: "This is My marker",
    //         });
    //     } else {
    //         if (location.coords.latitude === myMarker.latitude && location.coords.longitude === myMarker.longitude) {
    //             console.log("same");
    //             return;
    //         } else {
    //             console.log("not same");
    //             setMyMarker({ ...myMarker, latitude: location.coords.latitude, longitude: location.coords.longitude });
    //         }
    //     }

    //     // setMyLocation({ ...location.coords, latitudeDelta: 0.05, longitudeDelta: 0.05 })
    // };

    // //位置情報を継続して監視する
    // useEffect(() => {
    //     let subscriber;
    //     const startWatching = async () => {
    //         try {
    //             const { status } = await Location.requestForegroundPermissionsAsync();
    //             subscriber = await Location.watchPositionAsync(
    //                 {
    //                     accuracy: Location.Accuracy.Highest,
    //                     timeInterval: 5000,
    //                     distanceInterval: 10,
    //                 },
    //                 getPositionCallBack
    //             );
    //             if (status !== "granted") {
    //                 throw new Error("Location permission not granted");
    //             }
    //         } catch (err) {
    //             console.log("Error: ", err);
    //             setError(err);
    //         }
    //     };

    //     if (shouldTrack) {
    //         console.log("start watching");
    //         startWatching();
    //     } else {
    //         subscriber?.remove();
    //         subscriber = null;
    //     }

    //     /*DBに現在の位置情報を保存する*/

    //     return () => {
    //         if (subscriber) {
    //             subscriber.remove();
    //         }
    //         setMyLocation(initial);
    //     };
    // }, [shouldTrack,getPositionCallBack]);

    return (
        <MapView
            style={tw`h-full`}
            ref={mapRef}
            initialRegion={initial}
            region={
                !regionByUser ? myLocation : regionByUser
                // myLocation.latitude === region.latitude && myLocation.longitude === region.longitude
                //     ? myLocation
                //     : false
            }
            // onRegionChangeComplete={(region, { isGesture }) => {
            //     // console.log("region change complete", isGesture);
            //     // if (isGesture) {
            //     //     console.log("isGesture");
            //     //     setRegionByUser(region);
            //     // } else {
            //     //     console.log("not gesture (showsMyLocationButton)");
            //     //     setRegionByUser(null);
            //     // }
            // }}
            followsUserLocation={true} //for iOS only
            showsUserLocation={true}
            showsMyLocationButton={true}
            onUserLocationChange={e => {
                const coordinate = e.nativeEvent.coordinate;
                // console.log("user location change", e.nativeEvent);
                setMyLocation({ ...e.nativeEvent.coordinate, latitudeDelta: 0.05, longitudeDelta: 0.05 });

                /*DBに現在の位置情報を保存する*/
                tryUpdatePeopleLocation({
                    ride_event: "test0",
                    user: myUserInfo.id,
                    latitude: coordinate.latitude,
                    longitude: coordinate.longitude,
                });
            }}
        >
            {peopleMarkers.map((marker, index) => (
                <Marker
                    key={index}
                    coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                    title={marker.title}
                    description={marker.description}
                >
                    <View
                        style={{
                            height: 40,
                            width: 40,
                            borderRadius: 20,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#54e346",
                        }}
                    >
                        <View
                            style={{
                                height: 32,
                                width: 32,
                                borderRadius: 15,
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "white",
                            }}
                        >
                            <Image
                                source={marker.avatar}
                                style={{
                                    width: 27,
                                    height: 27,
                                    // tintColor: COLORS.white
                                }}
                            />
                        </View>
                    </View>
                </Marker>
            ))}
            {/* {myMarker && (
                <Marker
                    coordinate={{ latitude: myMarker.latitude, longitude: myMarker.longitude }}
                    title={myMarker.title}
                    description={myMarker.description}
                />
            )} */}
        </MapView>
    );
};

export default Map;

// const styles = StyleSheet.create({})

// const Loading = () => {
//     return (
//         <View style={tw`flex-1 justify-center items-center flex-row p-3`}>
//             <ActivityIndicator size='large' color='#000000' />
//         </View>
//     )
// }
