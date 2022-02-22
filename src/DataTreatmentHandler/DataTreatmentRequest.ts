import internal from "stream";
import { UserPreference } from "../ConfigurationManager/UserPreference";

export interface DataTreatmentRequest {
  rawData: internal.Readable;
  treatedData?: string;
  timestamp: number;
  userPreference: UserPreference;
  resource: string;
  owner: string;
}
