import { gql } from "apollo-server-express";

const reviewTypeDefs = gql`
    type Review {
        reviewId: ID!
        userId: String!
        rating: Float!
        comment: String!
        timestamp: String!
    }

    type Query {
        getReviews(restaurantId: ID!): [Review]
    }
`;

export default reviewTypeDefs;
