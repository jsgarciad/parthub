import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from "typeorm";
import { Part } from "../entities/Part";

@EventSubscriber()
export class PartSubscriber implements EntitySubscriberInterface<Part> {
    /**
     * Indicates that this subscriber only listens to Part events.
     */
    listenTo() {
        return Part;
    }

    /**
     * Called before part insertion.
     */
    async beforeInsert(event: InsertEvent<Part>) {
        // Ensure price is a valid number
        if (event.entity.price) {
            event.entity.price = parseFloat(event.entity.price.toString());
        }
    }

    /**
     * Called before part update.
     */
    async beforeUpdate(event: UpdateEvent<Part>) {
        // Ensure price is a valid number if it's being updated
        if (event.entity && event.entity.price) {
            event.entity.price = parseFloat(event.entity.price.toString());
        }
    }
} 