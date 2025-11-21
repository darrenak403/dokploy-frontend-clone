export interface Monitoring {
  service: string;
  action: string;
  entity: string;
  entityId: string | null;
  performedBy: string;
  status: "SUCCESS" | "FAILURE" | "ERROR";
  message: string;
  traceId: string;
  timestamp: string;
}
