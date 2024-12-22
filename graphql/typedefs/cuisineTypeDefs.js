import { gql } from "apollo-server-express";

const cuisineTypeDefs = gql`
    type Cuisine {
        restaurantId: ID!
        cuisines: [String]
    }
`;

export default cuisineTypeDefs;
