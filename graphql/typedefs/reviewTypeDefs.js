import { gql } from "apollo-server-express";

const reviewTypeDefs = gql`
    type Review {
        reviewId: ID!
        userId: String!
        rating: Float!
        comment: String!
        timestamp: String!
    }
`;

export default reviewTypeDefs;
