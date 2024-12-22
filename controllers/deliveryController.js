import { v4 as uuidv4 } from "uuid"; // For generating unique IDs
import { createSession } from "../graphDb.js";

// Create a new DeliveryAgent

export const createDeliveryAgent = async (req, res) => {
    try {
        const { name, phone, current_location } = req.body;

        // Generate a unique ID for the delivery agent
        const id = uuidv4();

        // Save the delivery agent and create relationships in Neo4j
        const session = createSession("WRITE");
        try {
            const result = await session.run(
                `
                CREATE (d:DeliveryAgent { 
                    id: $id,
                    name: $name, 
                    phone: $phone, 
                    current_location: $current_location 
                })
                WITH d
                MATCH (r:Restaurant {location: d.current_location})
                WITH d, r, 1 + rand() * 9 AS randomDistance
                CREATE (r)-[rel:DELIVERS { distance: round(randomDistance * 100) / 100 }]->(d)
                RETURN d, r, rel
                `,
                {
                    id,
                    name,
                    phone,
                    current_location,
                }
            );

            // Extract results for response
            const createdAgent = result.records[0]?.get("d").properties;
            const deliveries = result.records.map((record) => ({
                restaurant: record.get("r").properties,
                distance: record.get("rel").properties.distance,
            }));

            res.status(201).json({
                success: true,
                message:
                    "Delivery agent created successfully and relationships established",
                agent: createdAgent,
                deliveries,
            });
        } finally {
            session.close();
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error creating delivery agent",
            error: error.message,
        });
    }
};

//MOST IMPORTANT USAGE
export const getClosestDeliveryAgent = async (req, res) => {
    try {
        const { restaurantId } = req.params;

        const session = createSession("READ");
        try {
            const result = await session.run(
                `MATCH (r:Restaurant {id: $restaurantId})-[:DELIVERS]->(d:DeliveryAgent)
                 RETURN d
                 ORDER BY r.distance
                 LIMIT 1`,
                { restaurantId }
            );

            if (result.records.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No delivery agents found for this restaurant",
                });
            }

            const agent = result.records[0].get("d").properties;

            res.status(200).json({
                success: true,
                agent,
            });
        } finally {
            session.close();
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching delivery agent",
            error: error.message,
        });
    }
};
