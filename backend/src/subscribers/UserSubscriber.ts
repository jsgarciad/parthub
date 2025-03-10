import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from "typeorm";
import { User } from "../entities/User";
import * as bcrypt from "bcrypt";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
    /**
     * Indicates that this subscriber only listens to User events.
     */
    listenTo() {
        return User;
    }

    /**
     * Called before user insertion.
     */
    async beforeInsert(event: InsertEvent<User>) {
        await this.hashPassword(event.entity);
    }

    /**
     * Called before user update.
     */
    async beforeUpdate(event: UpdateEvent<User>) {
        // Only hash the password if it was modified
        if (event.entity && event.entity.password && event.entity.password !== event.databaseEntity.password) {
            await this.hashPassword(event.entity as User);
        }
    }

    /**
     * Hash user password
     */
    private async hashPassword(user: User) {
        if (user.password) {
            user.password = await bcrypt.hash(user.password, 10);
        }
    }
} 