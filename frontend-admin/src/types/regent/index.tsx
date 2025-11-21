export type REAGENT_TYPES =
  | "DILUENT"
  | "LYSING"
  | "STAINING"
  | "CLOTTING"
  | "CLEANER";

export const REAGENT_TYPE_VALUES: REAGENT_TYPES[] = [
  "DILUENT",
  "LYSING",
  "STAINING",
  "CLOTTING",
  "CLEANER",
];

export interface Reagent {
  id?: string;
  reagentType?: REAGENT_TYPES;
  reagentName?: string;
  lotNumber?: string;
  quantity: number;
  unit?: string;
  expiryDate?: string;
  vendorId?: string;
  vendorName?: string;
  vendorContact?: string;
  installedBy?: string;
  installedDate?: string;
  status?: string;
  remarks?: string;
}
