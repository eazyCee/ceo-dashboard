/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface KPI {
  completion_pct: number;
  milestones_achieved: number;
  total_milestones: number;
  overdue_tasks: number;
  overdue_milestones: number;
  next_milestone: string | null;
  next_milestone_overdue: boolean;
}

export interface Section {
  row: number;
  title: string;
}

export interface Task {
  row: number;
  name: string;
  milestone: string;
  assignee: string;
  target_date: string | null;
  status: string;
  overdue: boolean;
  note: string;
  weight: number;
}

export interface Project {
  id: string;
  name: string;
  pm: string;
  health: string;
  deal_size: string;
  deal_size_num?: number | null;
  deal_size_usd?: string;
  status_note: string;
  final_deadline: string | null;
  revised_deadline: string | null;
  kpis: KPI;
  sections?: Section[];
  tasks: Task[];
}

export interface InactiveProject {
  id: string;
  name: string;
  pm: string;
  status: string;
  reason: string;
  deal_size: string;
  deal_size_num?: number | null;
  sector?: string;
  geography?: string;
  date_closed: string;
  date_started: string;
  duration_weeks: number | null;
  final_completion_pct: number | null;
  milestones_achieved: number | null;
  total_milestones: number | null;
  lessons_learned?: string;
  residual_actions?: string;
  tasks: Task[];
}

export interface PortfolioStats {
  total_projects: number;
  avg_completion_pct: number;
  milestone_hit_rate: number;
  total_overdue_tasks: number;
  total_overdue_milestones: number;
  health_counts: Record<string, number>;
}

export interface WeeklyChange {
  as_of_date: string;
  project_id: string;
  project_name: string;
  pm: string;
  display_item?: string;
  item?: string;
  impact: string;
  severity: string;
  change_category: string;
  field_label?: string;
  previous_value?: string;
  new_value?: string;
}

export interface WeeklyBatch {
  as_of_date: string;
  as_of_display: string;
  exported_at: string;
  previous_snapshot_date?: string;
  previous_snapshot_display?: string;
  is_baseline: boolean;
  summary: {
    total_changes: number;
    positive_changes: number;
    negative_changes: number;
    new_projects?: number;
  };
  changes: WeeklyChange[];
  message?: string;
}

export interface WeeklyUpdates {
  latest: WeeklyBatch;
  history: WeeklyBatch[];
}

export interface PortfolioPulse {
  active_projects: number;
  ma_capital_value: string;
  ma_capital_sub: string;
  delayed_count: number;
  value_at_risk: string;
  actions_required: number;
}

export interface PmLoad {
  pm: string;
  projects: number;
  at_risk_count: number;
  flag: string;
}

export interface CriticalityAssessment {
  methodology: string;
  reassessed_count: number;
  upgraded_to_at_risk: number;
  upgraded_to_delayed: number;
  pm_load: PmLoad[];
}

export interface Deviation {
  milestone: string;
  target_date: string;
  actual: string;
  days_over: number;
}

export interface DecisionOption {
  label: string;
  action: string;
  type: string;
}

export interface CeoProject {
  rank: number;
  id: string;
  name: string;
  pm: string;
  health: string;
  decision_type: string;
  severity: string;
  issue: string;
  value_at_risk: string;
  value_detail: string;
  blocker_type: string;
  blocker_detail: string;
  days_overdue: number;
  overdue_since: string;
  overdue_items: string;
  last_action: string;
  escalation_reason: string;
  next_steps: string;
  ceo_decision: string;
  decide_by: string;
  wow_status: string;
  callout_class: string;
  deviations?: Deviation[];
  options?: DecisionOption[];
  recommended_option?: string;
  if_no_action?: string;
}

export interface WatchItem {
  id: string;
  name: string;
  pm: string;
  health: string;
  overdue_tasks: number;
  note: string;
  reason_not_escalated: string;
}

export interface DeEscalatedItem {
  id: string;
  name: string;
  pm: string;
  note: string;
}

export interface ActionItem {
  date_added: string;
  action: string;
  owner: string;
  deadline: string;
  status: string;
  remarks?: string;
}

export interface MilestoneUpdate {
  achieved: number;
  total: number;
  hit_rate: number;
  prev_hit_rate?: number | null;
  narrative: string;
}

export interface ExecutiveSummary {
  as_of: string;
  compared_to_week: string;
  portfolio_pulse: PortfolioPulse;
  criticality_assessment: CriticalityAssessment;
  top_ceo_projects: CeoProject[];
  watch_list: WatchItem[];
  de_escalated: DeEscalatedItem[];
  open_items: ActionItem[];
  milestone_update: MilestoneUpdate;
}

export interface InstructionSection {
  title: string;
  items: string[];
}

export interface DashboardData {
  generated_at: string;
  portfolio: PortfolioStats;
  projects: Project[];
  inactive_projects: InactiveProject[];
  portfolio_previous: PortfolioStats | null;
  instructions: InstructionSection[];
  weekly_updates: WeeklyUpdates;
  executive_summary: ExecutiveSummary;
}

export interface Email {
  id: string;
  from: string;
  date: string;
  subject: string;
  body: string;
  summary?: string;
  priority?: 'Critical' | 'High' | 'Normal';
  reasoning?: string;
  suggested_action?: string;
  processed?: boolean;
}

export interface ProjectRisk {
  phase: string;
  risk: string;
  likelihood: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  mitigation: string;
  aiExplanation?: string;
}
