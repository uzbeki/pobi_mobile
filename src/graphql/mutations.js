/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPeopleLocation = /* GraphQL */ `
  mutation CreatePeopleLocation(
    $input: CreatePeopleLocationInput!
    $condition: ModelPeopleLocationConditionInput
  ) {
    createPeopleLocation(input: $input, condition: $condition) {
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
export const updatePeopleLocation = /* GraphQL */ `
  mutation UpdatePeopleLocation(
    $input: UpdatePeopleLocationInput!
    $condition: ModelPeopleLocationConditionInput
  ) {
    updatePeopleLocation(input: $input, condition: $condition) {
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
export const deletePeopleLocation = /* GraphQL */ `
  mutation DeletePeopleLocation(
    $input: DeletePeopleLocationInput!
    $condition: ModelPeopleLocationConditionInput
  ) {
    deletePeopleLocation(input: $input, condition: $condition) {
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
