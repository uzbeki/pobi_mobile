import { graphqlOperation, API } from "aws-amplify";
import { listPeopleLocations } from "../src/graphql/queries";
import { createPeopleLocation, updatePeopleLocation } from "../src/graphql/mutations";
import { onCreatePeopleLocation } from "../src/graphql/subscriptions";


const tryListPeopleLocations = async ({ ride_event } = {}) => {
    // TODO: Receive 'nextToken'

    try {
        const response = await API.graphql(graphqlOperation(listPeopleLocations, {
            ride_event: ride_event,
        }))

        //console.log(response);
        // Response include 2 values, 'items' and 'nextToken'.
        const items = response.data.listPeopleLocations.items
        console.log(response.data.listPeopleLocations)
    } catch (error) {
        console.error(error);
    }
}

// Note: Not passed parameters do not poplulate into DB, instead of 'null'.
// params: ride_event and user are required.
const _tryCreatePeopleLocation = async ({ ride_event, user, longitude, latitude, speed }) => {

    if (!_requireDynamoID(ride_event, user)) {
        return
    }

    const input = {
        ride_event: ride_event,
        user: user,
        longitude: longitude,
        latitude: latitude,
        speed: speed
    }

    try {
        const response = await API.graphql(graphqlOperation(createPeopleLocation, { input: input }))
        console.log(response)
    } catch (error) {
        console.warn('Failed "createPeopleLocation"')
        console.error(error)
    }
}

const tryUpdatePeopleLocation = async ({ ride_event, user, longitude, latitude, speed }) => {

    if (!_requireDynamoID(ride_event, user)) {
        return
    }

    const input = {
        ride_event: ride_event,
        user: user,
        longitude: longitude,
        latitude: latitude,
        speed: speed
    }

    try {
        const response = await API.graphql(graphqlOperation(updatePeopleLocation, { input: input }))
        //console.log(response)
    } catch (error) {
        console.warn('Failed "updatePeopleLocation"')
        // If the item doesn't exist, creates a new item
        if (error.data.updatePeopleLocation === null) {
            _tryCreatePeopleLocation(input)
        }
        console.log('error=> ', error)
        // console.error(error)
    }
}

// Subscription from other file is not work. We can't unsubsctibe.  
const tryOnCreatePeopleLocation = async ({ } = {}) => {

    try {
        const subscription = await API.graphql(
            graphqlOperation(onCreatePeopleLocation, {})
        ).subscribe({
            next: (provider, value) => console.log(value),
            error: error => console.warn(error)
        });

    } catch (error) {
        console.error(error)
    }
}

// Prevent 'undefined' or 'null'
const _requireDynamoID = (ride_event, user) => {
    if (ride_event == null || user == null) {
        console.warn('"ride_event" and "user" are required')
        return false
    }

    return true
}


export { tryUpdatePeopleLocation, tryListPeopleLocations };
