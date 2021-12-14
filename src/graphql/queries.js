/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPeopleLocation = /* GraphQL */ `
  query GetPeopleLocation($ride_event: ID!, $user: ID!) {
    getPeopleLocation(ride_event: $ride_event, user: $user) {
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
export const listPeopleLocations = /* GraphQL */ `
  query ListPeopleLocations(
    $ride_event: ID
    $user: ModelIDKeyConditionInput
    $filter: ModelPeopleLocationFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listPeopleLocations(
      ride_event: $ride_event
      user: $user
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        ride_event
        user
        longitude
        latitude
        speed
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
