import { graphqlOperation, API } from "aws-amplify";
import { listPeopleLocations } from "../src/graphql/queries";
import { createPeopleLocation } from "../src/graphql/mutations";


// Note: Not passed parameters do not poplulate into DB, instead of 'null'.
const tryCreatePeopleLocation =  async ({ride_event=undefined, user=undefined, longitude=undefined, latitude=undefined, speed=undefined}) => {
    const input = {
        ride_event: ride_event,
        user: user,
        longitude: longitude,
	    latitude: latitude,
	    speed: speed,
    };
    
    try {
        const response = await API.graphql(graphqlOperation(createPeopleLocation, {input: input}));
        console.log(response)
    } catch (error){
        console.error(error)
    }
}

const tryListPeopleLocations = async ({ride_event=undefined}) => {
    try {
        const response = await API.graphql(graphqlOperation(listPeopleLocations, {
            ride_event: ride_event,
        }))

        console.log(response);

    } catch (error) {
        console.error(error);
    }
}


export{ tryCreatePeopleLocation, tryListPeopleLocations};
