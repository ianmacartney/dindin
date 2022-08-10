import { Dinner, Account, Guest } from "../common";
export declare type DataModel = {
  dinners: {
    document: Dinner;
    indexes: {
      by_host_time: ["host", "time"];
    };
  };
  accounts: { document: Account; indexes: {} };
  guests: { document: Guest; indexes: {} };
};
