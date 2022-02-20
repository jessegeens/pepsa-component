import { UserPreference } from "../ConfigurationManager/UserPreference";

export interface DataTreatmentRequest {
  rawData: string;
  treatedData?: string;
  timestamp: number;
  userPreference: UserPreference;
  resource: string;
  owner: string;
}
