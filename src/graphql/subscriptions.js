/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onUpdatePeopleLocationByRideEvent = /* GraphQL */ `
  subscription OnUpdatePeopleLocationByRideEvent($ride_event: ID!) {
    onUpdatePeopleLocationByRideEvent(ride_event: $ride_event) {
      ride_event
      user
      longitude
      latitude
      speed
      createdAt
      updatedAt
    }
  }
`;
export const onCreatePeopleLocation = /* GraphQL */ `
  subscription OnCreatePeopleLocation {
    onCreatePeopleLocation {
      ride_event
      user
      longitude
      latitude
      speed
      createdAt
      updatedAt
    }
  }
`;
export const onUpdatePeopleLocation = /* GraphQL */ `
  subscription OnUpdatePeopleLocation {
    onUpdatePeopleLocation {
      ride_event
      user
      longitude
      latitude
      speed
      createdAt
      updatedAt
    }
  }
`;
export const onDeletePeopleLocation = /* GraphQL */ `
  subscription OnDeletePeopleLocation {
    onDeletePeopleLocation {
      ride_event
      user
      longitude
      latitude
      speed
      createdAt
      updatedAt
    }
  }
`;
