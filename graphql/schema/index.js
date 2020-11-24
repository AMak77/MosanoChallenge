const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type User {
        _id: ID!
        email: String!
        password: String
    }
    type Person {
        _id: ID!
        name: String!
        surname: String!
        country: String!
        birthday: String!
    }
    type AuthData {
        userId: ID!
        token: String!
        tokenExpiration: Int!
    }
    input PersonInput {
        name: String!
        surname: String!
        country: String!
        birthday: String!
    }
    input UserInput {
        email: String!
        password: String!
    }
    input PersonUpdateInput {
        _id: ID!
        name: String!
        surname: String!
        country: String!
        birthday: String!
    }
    type RootQuery {
        users: [User!]!
        persons: [Person!]!
        login(email: String!, password: String!): AuthData!
    }
    type RootMutation {
        newUser(userInput: UserInput): User
        newPerson(personInput: PersonInput): Person
        deletePerson(id: ID!): Person
        updatePerson(id: ID!, name: String!, surname: String!, country: String!, birthday: String!): Person
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);