import { PageObservationSchema, type PageObservation } from "./schemas";

export function validatePageObservation(observation: unknown): PageObservation {
  return PageObservationSchema.parse(observation);
}

export interface PageRiskSummary {
  has_external_send_controls: boolean;
  has_payment_controls: boolean;
  has_auth_controls: boolean;
  has_destructive_controls: boolean;
  has_production_controls: boolean;
  risky_control_count: number;
  reason_codes: string[];
}

export function summarizePageRiskControls(page: PageObservation): PageRiskSummary {
  const reasonCodes: string[] = [];
  if (page.detected_external_send_controls.length > 0) reasonCodes.push("page_detected_external_send_controls");
  if (page.detected_payment_controls.length > 0) reasonCodes.push("page_detected_payment_controls");
  if (page.detected_auth_controls.length > 0) reasonCodes.push("page_detected_auth_controls");
  if (page.detected_destructive_controls.length > 0) reasonCodes.push("page_detected_destructive_controls");
  if (page.detected_production_controls.length > 0) reasonCodes.push("page_detected_production_controls");
  const riskyControlCount = page.detected_external_send_controls.length
    + page.detected_payment_controls.length
    + page.detected_auth_controls.length
    + page.detected_destructive_controls.length
    + page.detected_production_controls.length;

  return {
    has_external_send_controls: page.detected_external_send_controls.length > 0,
    has_payment_controls: page.detected_payment_controls.length > 0,
    has_auth_controls: page.detected_auth_controls.length > 0,
    has_destructive_controls: page.detected_destructive_controls.length > 0,
    has_production_controls: page.detected_production_controls.length > 0,
    risky_control_count: riskyControlCount,
    reason_codes: reasonCodes.sort()
  };
}

export function pageObservationHasRiskyControls(page: PageObservation): boolean {
  return summarizePageRiskControls(page).risky_control_count > 0;
}
