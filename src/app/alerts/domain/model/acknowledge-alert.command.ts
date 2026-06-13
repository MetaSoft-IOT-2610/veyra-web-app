/**
 * Command to acknowledge an alert, removing it from the active alerts queue.
 */
export interface AcknowledgeAlertCommand {
  alertId: number;
  acknowledgedBy: string;
}
