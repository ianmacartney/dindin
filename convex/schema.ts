import { Dinner, Person } from "../common";
export declare type DataModel = {
    dinners: {
        document: Dinner, indexes: {
            "by_host_time": ["host", "time"]
        }
    },
    person: { document: Person, indexes: {} },
};
