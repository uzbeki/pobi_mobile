import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, Text, View, Image, Button, ActivityIndicator, PermissionsAndroid } from "react-native";
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
import { tryUpdatePeopleLocation, tryOnUpdatePeopleLocationByRideEvent } from "../utils/PeopleLocation";

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
    const [isShareLocation, setIsShareLocation] = useState(false);
    const [shouldFollowUser, setShouldFollowUser] = useState(true);
    const mapRef = useRef(null);
    //位置情報のオブジェクトを受け取り、地図のセンターをそこに移動する
    const gotoGivenLocation = locObj => {
        console.log("gotocurrentlocation");
        mapRef.current.animateToRegion(locObj, 2000);
    };

    //useEffect[]→ 初めての位置情報取得
    useEffect(() => {
        const getFirstLocation = async () => {
            //初めての位置情報取得
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== PermissionsAndroid.RESULTS.GRANTED) {
                console.log("Permission to access foreground location was denied");
                return;
            }
            let currentLocation = await Location.getCurrentPositionAsync({
                enableHighAccuracy: true,
            });
            //マップの中央を現在地に設定
            const myLocObj = { ...currentLocation.coords, latitudeDelta: 0.05, longitudeDelta: 0.05 };
            console.log("first mylocation is", myLocObj);
            setMyLocation(myLocObj);
            //自分の位置情報にセンターを移動
            gotoGivenLocation(myLocObj);
        };
        getFirstLocation();
        return () => {};
    }, []);

    //useEffect[]→ 位置情報共有サブスクリプションの設定
    useEffect(() => {
        const subscriptionToUpdateLocation = tryOnUpdatePeopleLocationByRideEvent(
            { ride_event: "test0" },
            userLocation => {
                updatePeopleMarker(userLocation);
            }
        );

        return () => {
            subscriptionToUpdateLocation.unsubscribe();
        };
    }, []);

    const updatePeopleMarker = newUserLocation => {
        // console.log(newUserLocation);
        //自分の位置情報を更新
        if (newUserLocation.user === myUserInfo.id) {
            // console.log(newUserLocation);
            // gotoGivenLocation({ ...newUserLocation, latitudeDelta: 0.05, longitudeDelta: 0.05 });
            setMyLocation({ ...newUserLocation, latitudeDelta: 0.05, longitudeDelta: 0.05 });
            console.log("自分の位置情報を更新");
            return;
        } else {
            //新しい位置情報と一致するマーカーのインデックスを取得
            const newUserLocIndex = peopleMarkers.findIndex(marker => marker.user === newUserLocation.user);
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
    };

    //useEffect[isShareLocation, getPositionCallBack]→ 自分の位置情報を継続して監視するイベントハンドラーを設定
    useEffect(() => {
        let subscriber;
        const startWatching = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                subscriber = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.Highest,
                        timeInterval: 10000, //ms
                        distanceInterval: 0, //m
                    },
                    getPositionCallBack
                );
                if (status !== "granted") {
                    throw new Error("Location permission not granted");
                }
            } catch (err) {
                console.log("Error: ", err);
                setError(err);
            }
        };

        if (true /*todo isShowMyLocation*/) {
            console.log("start watching");
            startWatching();
        } else {
            subscriber?.remove();
            subscriber = null;
        }

        return () => {
            if (subscriber) {
                subscriber.remove();
            }
            setMyLocation(initial);
        };
    }, [isShareLocation, getPositionCallBack]);

    const getPositionCallBack = async location => {
        console.log("getPositionCallBack", shouldFollowUser); //BUG

        console.log("watched myloc==> ", location);
        if (shouldFollowUser) {
            /*BUG: shouldFollowUserがgetPositionCallBackが呼ばれるたびに初期化されているため強制的にtrueとなり、現在位置のセンター移動機能(onRegionChangeComplete時)のON/OFF切り替えが正常に動いていない*/
            console.log("should follow user");
            gotoGivenLocation({ ...location.coords, latitudeDelta: 0.05, longitudeDelta: 0.05 });
        }
        if (isShareLocation) {
            /*DBに自分の位置情報を保存する*/
            tryUpdatePeopleLocation({
                ride_event: "test0",
                user: myUserInfo.id,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        } else {
            return;
        }
    };
    return (
        <View>
            <View>
                <Text>latitude:{myLocation.latitude}</Text>
                <Text>latitude:{myLocation.longitude}</Text>
                <Button
                    title={!isShareLocation ? "start sharing my location" : "stop sharing my location"}
                    color={!isShareLocation ? "blue" : "red"}
                    onPress={() => {
                        setIsShareLocation(!isShareLocation);
                    }}
                ></Button>
            </View>

            <MapView
                style={tw`h-full`}
                ref={mapRef}
                initialRegion={initial}
                // followsUserLocation={true} //for iOS only
                showsUserLocation={true}
                showsMyLocationButton={true}
                onRegionChangeComplete={(region, { isGesture }) => {
                    //isGesture is only for google map
                    if (isGesture && shouldFollowUser) {
                        console.log("isGesture is true,gotoGivenLocationを停止");
                        //gotoGivenLocationを停止
                        setShouldFollowUser(false);
                    } else if (!isGesture && !shouldFollowUser) {
                        console.log("isGesture is false,gotoGivenLocationを再開");
                        //showsMyLocationButtonが押されたとき、gotoGivenLocationを再開
                        setShouldFollowUser(true);
                    } else {
                        return;
                    }
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
            </MapView>
        </View>
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
