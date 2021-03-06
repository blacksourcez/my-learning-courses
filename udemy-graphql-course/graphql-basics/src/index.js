import { GraphQLServer } from "graphql-yoga";

// Scalar types - String, Boolean, Int, Float, ID

// Demo user data
const users = [
  {
    id: "1",
    name: "Ayuth",
    email: "ayuth@example.com",
    age: 23,
  },
  {
    id: "2",
    name: "Sarah",
    email: "Sarah@example.com",
    age: 22,
  },
  {
    id: "3",
    name: "Mike",
    email: "Mike@example.com",
    age: null,
  },
];

const posts = [
  {
    id: "1",
    title: "Learn GraphQL",
    body: "Find some place to learn GraphQL.",
    published: true,
    author: "1",
    comments: ["101", "102"],
  },
  {
    id: "2",
    title: "Learn JavaScript",
    body: "Find some place to learn JavaScript.",
    published: true,
    author: "1",
    comments: ["103"],
  },
  {
    id: "3",
    title: "Learn How to Love People",
    body: "Give love to everyone.",
    published: true,
    author: "2",
    comments: ["104"],
  },
];

const comments = [
  {
    id: "101",
    text: "Great post!",
    author: "1",
    post: "1",
  },
  {
    id: "102",
    text: "Awesome!",
    author: "1",
    post: "1",
  },
  {
    id: "103",
    text: "Can't wait for it!",
    author: "2",
    post: "2",
  },
  {
    id: "104",
    text: "Incredible!",
    author: "3",
    post: "3",
  },
];

// Type definitions (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    me: User!
    posts(query: String): [Post!]!
    comments: [Comment!]!
  }

  type User {
    id: ID!
    name: String!
    email: String
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!,
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }
      return users.filter((user) => {
        return user.name
          .toLocaleLowerCase()
          .includes(args.query.toLocaleLowerCase());
      });
    },
    me() {
      return {
        id: "1212312121",
        name: "Ayuth",
        email: "ayuth@example.com",
        age: 23,
      };
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }
      return posts.filter((post) => {
        const isMatchTitle = post.title
          .toLocaleLowerCase()
          .includes(args.query);
        const isMatchBody = post.body.toLocaleLowerCase().includes(args.query);
        return isMatchTitle || isMatchBody;
      });
    },
    comments(parent, args, ctx, info) {
      return comments;
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        // console.log(parent.commentIdRef, comment.id);
        // console.log(.includes(comment.id));
        return parent.comments.includes(comment.id);
      });
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => post.author === parent.id);
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => parent.id === comment.author);
    },
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author);
    },
    post(parent, args, ctx, inf0) {
      return posts.find((post) => post.id === parent.post);
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log("This server is up");
});
