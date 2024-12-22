import restaurantResolvers from "./restaurantResolvers.js";
import cuisineResolvers from "./cuisineResolvers.js";
import menuResolvers from "./menuResolvers.js";

const resolvers = {
    Query: {
        ...restaurantResolvers.Query,
        ...cuisineResolvers.Query,
        ...menuResolvers.Query,
    },
};

export default resolvers;
