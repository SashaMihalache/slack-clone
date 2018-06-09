export default `
  type Channel {
    id: Int!
    name: String!
    public: Boolean!
    messages: [Message!]!
    team: Team!
    users: [User!]!
  }

  type Mutation {
    createChannel(name: String!, teamId: Int!, public: Boolean=false): Boolean!
  }
`;
