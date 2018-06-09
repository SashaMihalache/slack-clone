export default `
  type User {
    id: Int!
    email: String!
    username: String!
  }

  type Query {
    getUser(id: Int!): User!
    allUsers: [User!]!
  }
  
  type Mutation {
    register(username: String!, email: String!, password: String!): Boolean!
  }
`;
