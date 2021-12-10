import * as Location from 'expo-location';

// google maps polyline decoder which converts encoded polyline string to array of latlngs
function decodePolyline(polylineCode) {
    if (!polylineCode) {
        return [];
    }
    let polyPathList = [];
    let len = polylineCode.length;
    let index = 0,
        lat = 0,
        lng = 0;

    while (index < len) {
        let b,
            shift = 0,
            result = 0;
        do {
            b = polylineCode.charCodeAt(index++) - 63;
            result = result | ((b & 0x1f) << shift);
            shift += 5;
        } while (b >= 0x20);

        let dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
        lat += dlat;
        shift = 0;
        result = 0;
        do {
            b = polylineCode.charCodeAt(index++) - 63;
            result = result | ((b & 0x1f) << shift);
            shift += 5;
        } while (b >= 0x20);
        let dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
        lng += dlng;
        let p = { lat: lat / 1e5, lng: lng / 1e5 };
        polyPathList.push(p);
    }
    return polyPathList;
}

const requestPermission = async () => {
    Location.installWebGeolocationPolyfill();
    // Location.PermissionStatus.GRANTED
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
        console.log('Permission to access foreground location was denied');
        return;
    }

    let location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true
    });
    // setLocation(location);
    // console.log(location)
    return location;
};





export {decodePolyline, requestPermission};
