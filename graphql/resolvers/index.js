import restaurantResolvers from "./restaurantResolvers.js";

const resolvers = {
    Query: {
        ...restaurantResolvers.Query,
    },
};

export default resolvers;
