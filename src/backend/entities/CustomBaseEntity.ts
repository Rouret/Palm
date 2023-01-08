import { v4 } from 'uuid';
import {DateTimeType, PrimaryKey, Property} from "@mikro-orm/core";

export abstract class CustomBaseEntity {
    @PrimaryKey({ type: 'uuid' })
    uuid = v4();

    @Property({ type: DateTimeType })
    createdAt = new Date();

    @Property({ type: DateTimeType, onUpdate: () => new Date() })
    updatedAt = new Date();

}
