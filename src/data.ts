import { DashboardData, Email } from "./types";

export const INITIAL_DASHBOARD_DATA: DashboardData = {
  "generated_at": "29-Jun-2026 09:00",
  "portfolio": {
    "total_projects": 13,
    "avg_completion_pct": 0.5519,
    "milestone_hit_rate": 0.4685,
    "total_overdue_tasks": 14,
    "total_overdue_milestones": 12,
    "health_counts": {
      "On Track": 3,
      "At Risk": 3,
      "Delayed": 7
    }
  },
  "projects": [
    {
      "id": "Project-Alpha",
      "name": "Project Alpha",
      "pm": "PM Alpha",
      "health": "Delayed",
      "deal_size": "$XX EV",
      "deal_size_num": 150,
      "deal_size_usd": "US$150M",
      "status_note": "Regulator/Foreign Investment Approval Process Underway",
      "final_deadline": "2026-09-04",
      "revised_deadline": null,
      "kpis": {
        "completion_pct": 0.6636,
        "milestones_achieved": 5,
        "total_milestones": 14,
        "overdue_tasks": 1,
        "overdue_milestones": 1,
        "next_milestone": "2026-07-10",
        "next_milestone_overdue": false
      },
      "sections": [],
      "tasks": [
        {
          "row": 10,
          "name": "Regulatory Review - items requested by Regulator",
          "milestone": "No",
          "assignee": "PM Alpha",
          "target_date": "2026-06-15",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 1
        },
        {
          "row": 11,
          "name": "Regulatory Review - external expert committee review",
          "milestone": "Yes",
          "assignee": "PM Alpha",
          "target_date": "2026-06-15",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 12,
          "name": "Regulatory Review - internal Regulator committee review",
          "milestone": "Yes",
          "assignee": "PM Alpha",
          "target_date": "2026-07-10",
          "status": "In Progress",
          "overdue": false,
          "note": "start W5 Jun",
          "weight": 3
        },
        {
          "row": 13,
          "name": "Regulatory Review - approval",
          "milestone": "Yes",
          "assignee": "PM Alpha",
          "target_date": "2026-07-10",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 5
        },
        {
          "row": 14,
          "name": "Foreign Investment Approval - National Intelligence Service (NIS) review",
          "milestone": "Yes",
          "assignee": "PM Alpha",
          "target_date": "2026-07-10",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 5
        },
        {
          "row": 15,
          "name": "Foreign Investment Approval - Professional Committee review",
          "milestone": "Yes",
          "assignee": "PM Alpha",
          "target_date": "2026-08-07",
          "status": "In Progress",
          "overdue": false,
          "note": "start W3 Jul",
          "weight": 3
        },
        {
          "row": 16,
          "name": "Foreign Investment Approval - Foreign Investment Committee review",
          "milestone": "Yes",
          "assignee": "PM Alpha",
          "target_date": "2026-08-21",
          "status": "In Progress",
          "overdue": false,
          "note": "start W1 Aug",
          "weight": 5
        },
        {
          "row": 17,
          "name": "Regulator final approval",
          "milestone": "Yes",
          "assignee": "PM Alpha",
          "target_date": "2026-08-21",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 5
        },
        {
          "row": 18,
          "name": "LoG (Letter of Guarantee) signed by Buyer Entity (asked by Regulator)",
          "milestone": "No",
          "assignee": "",
          "target_date": "2026-06-08",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 1
        },
        {
          "row": 19,
          "name": "Competition Authority Merger Filing",
          "milestone": "Yes",
          "assignee": "",
          "target_date": "2026-04-17",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 5
        },
        {
          "row": 20,
          "name": "W&I / Tax Insurance",
          "milestone": "Yes",
          "assignee": "",
          "target_date": "2026-04-24",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 21,
          "name": "Change of Control CP",
          "milestone": "Yes",
          "assignee": "",
          "target_date": "2026-04-27",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 22,
          "name": "Term Sheet Negotiations / Harmonisation",
          "milestone": "Yes",
          "assignee": "",
          "target_date": "2026-01-30",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 23,
          "name": "Financing Documentation Drafting",
          "milestone": "Yes",
          "assignee": "",
          "target_date": "2026-07-15",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 24,
          "name": "Meeting with seller and legal of both ends for expectation alignment",
          "milestone": "No",
          "assignee": "PM Alpha",
          "target_date": "2026-07-02",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 1
        },
        {
          "row": 25,
          "name": "Bank account opening process",
          "milestone": "Yes",
          "assignee": "",
          "target_date": "2026-06-12",
          "status": "In Progress",
          "overdue": true,
          "note": "",
          "weight": 1
        },
        {
          "row": 26,
          "name": "Project completion",
          "milestone": "Yes",
          "assignee": "PM Alpha",
          "target_date": "2026-09-04",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 5
        }
      ]
    },
    {
      "id": "Project-Beta",
      "name": "Project Beta",
      "pm": "PM Beta",
      "health": "Delayed",
      "deal_size": "$XX EV",
      "deal_size_num": 320,
      "deal_size_usd": "US$320M",
      "status_note": "Regulatory Approval Pending, Financing In Progress",
      "final_deadline": "2026-07-31",
      "revised_deadline": null,
      "kpis": {
        "completion_pct": 0.8571,
        "milestones_achieved": 15,
        "total_milestones": 19,
        "overdue_tasks": 4,
        "overdue_milestones": 4,
        "next_milestone": "2026-05-26",
        "next_milestone_overdue": true
      },
      "sections": [],
      "tasks": [
        {
          "row": 11,
          "name": "CSPA Variation",
          "milestone": "Yes",
          "assignee": "Buyer & Seller",
          "target_date": "2026-05-15",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 12,
          "name": "Competition Clearance",
          "milestone": "Yes",
          "assignee": "Buyer & Seller",
          "target_date": "2026-06-11",
          "status": "Completed",
          "overdue": false,
          "note": "Subject to 14 days review by 08 Jul",
          "weight": 5
        },
        {
          "row": 13,
          "name": "Regulatory Approval",
          "milestone": "Yes",
          "assignee": "Buyer & Seller",
          "target_date": "2026-06-18",
          "status": "In Progress",
          "overdue": true,
          "note": "est by 10 July 2026 (referred to Competition Clearance)",
          "weight": 5
        },
        {
          "row": 14,
          "name": "Financing – OpCo",
          "milestone": "Yes",
          "assignee": "Buyer / Borrower / Lender",
          "target_date": "2026-06-06",
          "status": "In Progress",
          "overdue": true,
          "note": "Insurance Co decision pending",
          "weight": 3
        },
        {
          "row": 15,
          "name": "Financing – OpCo (CG Related to Bank)",
          "milestone": "Yes",
          "assignee": "Buyer",
          "target_date": "2026-06-22",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 16,
          "name": "Financing – HoldCo",
          "milestone": "Yes",
          "assignee": "Buyer / Borrower / Lender",
          "target_date": "2026-06-06",
          "status": "Completed",
          "overdue": false,
          "note": "Awaiting for signing",
          "weight": 3
        },
        {
          "row": 17,
          "name": "Financing – HoldCo (CG Related)",
          "milestone": "Yes",
          "assignee": "Buyer",
          "target_date": "2026-06-06",
          "status": "Completed",
          "overdue": false,
          "note": "Awaiting for signing",
          "weight": 3
        },
        {
          "row": 18,
          "name": "Financing – Lender Bank (Super HoldCo)",
          "milestone": "Yes",
          "assignee": "Buyer / Borrower / Lender",
          "target_date": "2026-05-22",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 19,
          "name": "Full Earnout EBITDA – Potential Projects (3rd Earnout)",
          "milestone": "Yes",
          "assignee": "Buyer & Seller",
          "target_date": "2026-05-26",
          "status": "In Progress",
          "overdue": true,
          "note": "To be finalized by 23-25 June 2026",
          "weight": 3
        },
        {
          "row": 20,
          "name": "Interim Earnout HY FY26",
          "milestone": "Yes",
          "assignee": "Buyer",
          "target_date": "2026-06-05",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 21,
          "name": "Second W&I Policy",
          "milestone": "Yes",
          "assignee": "Buyer",
          "target_date": "2026-06-09",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 22,
          "name": "Fund Co Deed of Settlement",
          "milestone": "Yes",
          "assignee": "Seller",
          "target_date": "2026-05-29",
          "status": "In Progress",
          "overdue": true,
          "note": "Awaiting the Earnout Amount Calc",
          "weight": 3
        },
        {
          "row": 23,
          "name": "Bank Account Set Up - SPV",
          "milestone": "Yes",
          "assignee": "Buyer / Target Co",
          "target_date": "2026-05-29",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 1
        },
        {
          "row": 24,
          "name": "Bank Account Set Up - DSRA for Bank at EM Finco",
          "milestone": "Yes",
          "assignee": "Target Co",
          "target_date": "2026-05-29",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 1
        },
        {
          "row": 25,
          "name": "Change of Control Consent – Licenses (Port Authority)",
          "milestone": "Yes",
          "assignee": "Seller",
          "target_date": "2026-05-29",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 1
        },
        {
          "row": 26,
          "name": "Change of Control Consent – Customers",
          "milestone": "Yes",
          "assignee": "Seller",
          "target_date": "2026-05-29",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 1
        },
        {
          "row": 27,
          "name": "Option Cancellation Deeds",
          "milestone": "Yes",
          "assignee": "Seller",
          "target_date": "2026-05-29",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 1
        },
        {
          "row": 28,
          "name": "Financial Assistance Whitewash",
          "milestone": "Yes",
          "assignee": "Buyer & Seller",
          "target_date": "2026-05-29",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 29,
          "name": "Post-Completion Assurance Letter",
          "milestone": "Yes",
          "assignee": "Buyer",
          "target_date": "2026-05-29",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 1
        }
      ]
    },
    {
      "id": "Project-Gamma",
      "name": "Project Gamma",
      "pm": "PM Alpha",
      "health": "At Risk",
      "deal_size": "$XX",
      "deal_size_num": 80,
      "deal_size_usd": "US$80M",
      "status_note": "Awaiting Partner Co guidance on offer letter",
      "final_deadline": null,
      "revised_deadline": null,
      "kpis": {
        "completion_pct": 0.5000,
        "milestones_achieved": 0,
        "total_milestones": 3,
        "overdue_tasks": 0,
        "overdue_milestones": 0,
        "next_milestone": "2026-07-10",
        "next_milestone_overdue": false
      },
      "sections": [],
      "tasks": [
        {
          "row": 1,
          "name": "Awaiting Partner Co's guidance on their intent on the offer letter adjustment along with exclusivity for 60days to lead up to a exchange submission for a potential VO strategy",
          "milestone": "Yes",
          "assignee": "PM Alpha",
          "target_date": "2026-07-10",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 5
        },
        {
          "row": 2,
          "name": "For Exclusivity, to engage different DD track to gain heightened confidence and understanding of target before going to regulator for consultation on a VO",
          "milestone": "Yes",
          "assignee": "PM Alpha",
          "target_date": "2026-09-11",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 5
        },
        {
          "row": 3,
          "name": "Financing structuring kick off by FA / Lender during the same 60D",
          "milestone": "Yes",
          "assignee": "PM Alpha",
          "target_date": null,
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 3
        }
      ]
    },
    {
      "id": "Project-Delta",
      "name": "Project Delta",
      "pm": "PM Beta",
      "health": "Delayed",
      "deal_size": "$XX",
      "deal_size_num": 110,
      "deal_size_usd": "US$110M",
      "status_note": "Seller Counter Proposal received, awaiting meeting",
      "final_deadline": null,
      "revised_deadline": null,
      "kpis": {
        "completion_pct": 0.2981,
        "milestones_achieved": 4,
        "total_milestones": 16,
        "overdue_tasks": 1,
        "overdue_milestones": 1,
        "next_milestone": "2026-06-24",
        "next_milestone_overdue": true
      },
      "sections": [],
      "tasks": [
        {
          "row": 10,
          "name": "Engagement Letter with Advisor",
          "milestone": "Yes",
          "assignee": "Advisor",
          "target_date": "2026-06-24",
          "status": "In Progress",
          "overdue": true,
          "note": "",
          "weight": 1
        },
        {
          "row": 11,
          "name": "Preliminary Analysis",
          "milestone": "Yes",
          "assignee": "BC",
          "target_date": "2026-04-30",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 1
        },
        {
          "row": 12,
          "name": "Parent Co Board Approval and Discussion",
          "milestone": "Yes",
          "assignee": "IB",
          "target_date": "2026-05-08",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 13,
          "name": "NBIO",
          "milestone": "Yes",
          "assignee": "BC",
          "target_date": "2026-05-15",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 14,
          "name": "Seller Counter Proposal",
          "milestone": "Yes",
          "assignee": "BC",
          "target_date": "2026-06-21",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 5
        },
        {
          "row": 15,
          "name": "Seller to meet with Buyer",
          "milestone": "Yes",
          "assignee": "BC",
          "target_date": "2026-07-01",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 5
        },
        {
          "row": 16,
          "name": "DD Phase 1 – Internal Assessment",
          "milestone": "Yes",
          "assignee": "Buyer",
          "target_date": null,
          "status": "Pending",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 17,
          "name": "DD Phase 2 – Detailed Assessment with Advisers",
          "milestone": "Yes",
          "assignee": "Buyer & Advisers",
          "target_date": null,
          "status": "Pending",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 18,
          "name": "Final DD Report",
          "milestone": "Yes",
          "assignee": "Buyer & Advisers",
          "target_date": null,
          "status": "Pending",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 19,
          "name": "CSPA Drafting & Negotiation",
          "milestone": "Yes",
          "assignee": "Buyer & Seller",
          "target_date": null,
          "status": "Pending",
          "overdue": false,
          "note": "",
          "weight": 5
        },
        {
          "row": 20,
          "name": "CSPA Signing",
          "milestone": "Yes",
          "assignee": "Buyer & Seller",
          "target_date": null,
          "status": "Pending",
          "overdue": false,
          "note": "",
          "weight": 5
        },
        {
          "row": 21,
          "name": "Explore Lenders & Provide Data Room Information",
          "milestone": "Yes",
          "assignee": "Buyer",
          "target_date": null,
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 1
        },
        {
          "row": 22,
          "name": "Bank Indicative Offer",
          "milestone": "Yes",
          "assignee": "Lenders",
          "target_date": null,
          "status": "Pending",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 23,
          "name": "Term Sheet Negotiation",
          "milestone": "Yes",
          "assignee": "Buyer & Lenders",
          "target_date": null,
          "status": "Pending",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 24,
          "name": "Commitment Letter Negotiation",
          "milestone": "Yes",
          "assignee": "Buyer & Lenders",
          "target_date": null,
          "status": "Pending",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 25,
          "name": "Commitment Letter Signing",
          "milestone": "Yes",
          "assignee": "Buyer & Lenders",
          "target_date": null,
          "status": "Pending",
          "overdue": false,
          "note": "",
          "weight": 5
        }
      ]
    },
    {
      "id": "Project-Epsilon",
      "name": "Project Epsilon",
      "pm": "PM Beta",
      "health": "On Track",
      "deal_size": "TBD",
      "deal_size_num": 0,
      "status_note": "Financial Model sent to Client Co, awaiting feedback",
      "final_deadline": "2026-07-31",
      "revised_deadline": null,
      "kpis": {
        "completion_pct": 0.8644,
        "milestones_achieved": 16,
        "total_milestones": 19,
        "overdue_tasks": 0,
        "overdue_milestones": 0,
        "next_milestone": "2026-07-11",
        "next_milestone_overdue": false
      },
      "sections": [],
      "tasks": [
        {
          "row": 10,
          "name": "Consultant Gap Analysis Report",
          "milestone": "Yes",
          "assignee": "Team Member 4 / Consultant",
          "target_date": "2026-05-29",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 1
        },
        {
          "row": 11,
          "name": "Regulatory Pathway Assessment (Flag & Compliance Strategy)",
          "milestone": "Yes",
          "assignee": "Team Member 2 / Team Member 4 / Team Member 3",
          "target_date": "2026-06-12",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 5
        },
        {
          "row": 12,
          "name": "Regional Marine Orders Compliance Assessment",
          "milestone": "Yes",
          "assignee": "Team Member 4",
          "target_date": "2026-06-12",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 5
        },
        {
          "row": 13,
          "name": "Flag State Strategy (Option A vs Flag of Convenience)",
          "milestone": "Yes",
          "assignee": "Team Member 4 / PM Beta",
          "target_date": "2026-06-12",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 5
        },
        {
          "row": 14,
          "name": "Vessel Redeployment Strategy (Regional Operations)",
          "milestone": "Yes",
          "assignee": "Company / Parent",
          "target_date": "2026-06-12",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 15,
          "name": "Vessel Modification & Establishment CAPEX Assessment",
          "milestone": "Yes",
          "assignee": "Technical Team",
          "target_date": "2026-06-12",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 16,
          "name": "Technical Engineering Review Support",
          "milestone": "Yes",
          "assignee": "Company / Client Co",
          "target_date": "2026-06-12",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 1
        },
        {
          "row": 17,
          "name": "Marine RFP Release",
          "milestone": "Yes",
          "assignee": "Client Co",
          "target_date": "2026-06-12",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 5
        },
        {
          "row": 18,
          "name": "RFP Release",
          "milestone": "Yes",
          "assignee": "Client Co",
          "target_date": null,
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 19,
          "name": "RFP Commercial & Technical Assessment",
          "milestone": "Yes",
          "assignee": "Company / Parent",
          "target_date": null,
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 20,
          "name": "Finance Model Finalisation",
          "milestone": "Yes",
          "assignee": "Team Member 1 / Team Member 2",
          "target_date": "2026-06-09",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 5
        },
        {
          "row": 21,
          "name": "Charter Rate Build-Up",
          "milestone": "Yes",
          "assignee": "Company / Parent",
          "target_date": null,
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 22,
          "name": "Critical Spares Review & Integration",
          "milestone": "Yes",
          "assignee": "Technical Team",
          "target_date": null,
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 1
        },
        {
          "row": 23,
          "name": "Biosecurity Shipyard Cost Estimate",
          "milestone": "Yes",
          "assignee": "Team Member 4",
          "target_date": null,
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 1
        },
        {
          "row": 24,
          "name": "Mobilisation Cost Assessment (Region B Deployment)",
          "milestone": "Yes",
          "assignee": "Company / Parent",
          "target_date": null,
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 1
        },
        {
          "row": 25,
          "name": "Financial Model Review",
          "milestone": "Yes",
          "assignee": "PM Beta / Team Member 3 / Team Member 1",
          "target_date": "2026-06-23",
          "status": "Completed",
          "overdue": false,
          "note": "<< Sent to Client Co on 26 Jun",
          "weight": 3
        },
        {
          "row": 26,
          "name": "Financial Model Feedback",
          "milestone": "Yes",
          "assignee": "PM Beta / Team Member 3 / Team Member 1",
          "target_date": "2026-07-11",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 27,
          "name": "Board Paper Preparation",
          "milestone": "Yes",
          "assignee": "PM Beta / Team Member 2 / Team Member 1",
          "target_date": null,
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 28,
          "name": "Final RFP Submission",
          "milestone": "Yes",
          "assignee": "Company / Parent",
          "target_date": null,
          "status": "Pending",
          "overdue": false,
          "note": "",
          "weight": 5
        }
      ]
    },
    {
      "id": "Project-Zeta",
      "name": "Project Zeta",
      "pm": "PM Alpha",
      "health": "At Risk",
      "deal_size": "N/A",
      "deal_size_num": 0,
      "status_note": "",
      "final_deadline": null,
      "revised_deadline": null,
      "kpis": {
        "completion_pct": 0.6500,
        "milestones_achieved": 1,
        "total_milestones": 3,
        "overdue_tasks": 0,
        "overdue_milestones": 0,
        "next_milestone": "2026-07-07",
        "next_milestone_overdue": false
      },
      "sections": [],
      "tasks": [
        {
          "row": 10,
          "name": "Determine release of Secured Line of Credit (SLoC) with Lender to enlarge NLR",
          "milestone": "Yes",
          "assignee": "Team Member 5",
          "target_date": "2026-07-07",
          "status": "In Progress",
          "overdue": false,
          "note": "waiting Lender credit approval",
          "weight": 3
        },
        {
          "row": 11,
          "name": "Extending feasibility into Regional Bank working capital opportunity",
          "milestone": "No",
          "assignee": "Team Member 5",
          "target_date": null,
          "status": "In Progress",
          "overdue": false,
          "note": "<< initial initiative, not yet confirmed. Will be updated at next committee meeting",
          "weight": 1
        },
        {
          "row": 12,
          "name": "Budget P&L",
          "milestone": "Yes",
          "assignee": "Team Member 5",
          "target_date": "2026-06-12",
          "status": "Completed",
          "overdue": false,
          "note": "confirmed no changes",
          "weight": 3
        },
        {
          "row": 13,
          "name": "Budget capex & Delegation of Authority (DoA)",
          "milestone": "Yes",
          "assignee": "Team Member 5",
          "target_date": "2026-07-20",
          "status": "In Progress",
          "overdue": false,
          "note": "next Board meeting 20 Jul",
          "weight": 3
        }
      ]
    },
    {
      "id": "Project-Eta",
      "name": "Project Eta",
      "pm": "PM Alpha",
      "health": "On Track",
      "deal_size": "N/A",
      "deal_size_num": 0,
      "status_note": "Consortium formation and Advisory Firm advisory tracks underway",
      "final_deadline": null,
      "revised_deadline": null,
      "kpis": {
        "completion_pct": 0.5000,
        "milestones_achieved": 0,
        "total_milestones": 5,
        "overdue_tasks": 0,
        "overdue_milestones": 0,
        "next_milestone": "2026-07-10",
        "next_milestone_overdue": false
      },
      "sections": [],
      "tasks": [
        {
          "row": 10,
          "name": "Sale process on the coal piece which is targeting to be kick end of June is likely to be delayed to Mid July.",
          "milestone": "Yes",
          "assignee": "PM Alpha",
          "target_date": "2026-07-15",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 11,
          "name": "Consortium working on partnership formation",
          "milestone": "Yes",
          "assignee": "PM Alpha",
          "target_date": null,
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 12,
          "name": "Advisory Firm working on cost benefit analysis on the consortium",
          "milestone": "Yes",
          "assignee": "PM Alpha",
          "target_date": "2026-07-10",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 13,
          "name": "Advisory Firm initiate works with legal counsel on the Competition Clearance understanding",
          "milestone": "Yes",
          "assignee": "PM Alpha",
          "target_date": "2026-07-10",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 14,
          "name": "Advisory Firm sizing and structuring of the acquisition debt",
          "milestone": "Yes",
          "assignee": "PM Alpha",
          "target_date": "2026-07-10",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 3
        }
      ]
    },
    {
      "id": "Project-Theta",
      "name": "Project Theta",
      "pm": "PM Gamma",
      "health": "On Track",
      "deal_size": "N/A",
      "deal_size_num": 0,
      "status_note": "Revised deadline 03-Jul, opco closing dates confirmed",
      "final_deadline": "2026-06-19",
      "revised_deadline": "2026-07-03",
      "kpis": {
        "completion_pct": 0.6250,
        "milestones_achieved": 0,
        "total_milestones": 1,
        "overdue_tasks": 0,
        "overdue_milestones": 0,
        "next_milestone": "2026-07-03",
        "next_milestone_overdue": false
      },
      "sections": [
        {
          "row": 20,
          "title": "1. Team members from each opco will submit to consolidator"
        },
        {
          "row": 21,
          "title": "2. Consolidator will compile data and submit to management"
        },
        {
          "row": 22,
          "title": "3. Management will review and discuss"
        }
      ],
      "tasks": [
        {
          "row": 10,
          "name": "Cheking each opco monthly closing dates",
          "milestone": "No",
          "assignee": "Team Member 3",
          "target_date": "2026-06-09",
          "status": "Completed",
          "overdue": false,
          "note": "actual: 08-Jun-2026",
          "weight": 1
        },
        {
          "row": 11,
          "name": "Financial Reports from Opco to HoldCo",
          "milestone": "Yes",
          "assignee": "Team Member 3",
          "target_date": "2026-07-03",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 3
        }
      ]
    },
    {
      "id": "Project-Iota",
      "name": "Project Iota",
      "pm": "PM Delta",
      "health": "Delayed",
      "deal_size": "N/A",
      "deal_size_num": 0,
      "status_note": "",
      "final_deadline": null,
      "revised_deadline": null,
      "kpis": {
        "completion_pct": 0.1096,
        "milestones_achieved": 2,
        "total_milestones": 8,
        "overdue_tasks": 2,
        "overdue_milestones": 1,
        "next_milestone": "2026-05-29",
        "next_milestone_overdue": true
      },
      "sections": [
        {
          "row": 10,
          "title": "Requirement Identification"
        },
        {
          "row": 14,
          "title": "Partner Sourcing"
        },
        {
          "row": 19,
          "title": "Technical & Commercial Review"
        },
        {
          "row": 28,
          "title": "Contract Signing"
        },
        {
          "row": 32,
          "title": "NB Supervisor Sourcing"
        },
        {
          "row": 38,
          "title": "Construction / Newbuilding"
        }
      ],
      "tasks": [
        {
          "row": 11,
          "name": "Operational Profile",
          "milestone": "No",
          "assignee": "Ops",
          "target_date": "2026-01-16",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 1
        },
        {
          "row": 12,
          "name": "Preliminary Technical Specifications",
          "milestone": "Yes",
          "assignee": "Tech",
          "target_date": "2026-01-30",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 1
        },
        {
          "row": 15,
          "name": "Sourcing",
          "milestone": "No",
          "assignee": "Proc",
          "target_date": "2026-01-30",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 1
        },
        {
          "row": 16,
          "name": "Request for Proposal",
          "milestone": "No",
          "assignee": "Proc",
          "target_date": "2026-02-27",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 1
        },
        {
          "row": 17,
          "name": "Partner Shortlisting",
          "milestone": "Yes",
          "assignee": "Proc",
          "target_date": "2026-03-13",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 20,
          "name": "Technical Proposal Submission",
          "milestone": "No",
          "assignee": "Vendor",
          "target_date": "2026-04-24",
          "status": "In Progress",
          "overdue": true,
          "note": "",
          "weight": 3
        },
        {
          "row": 21,
          "name": "Technical Proposal Review & Finalization",
          "milestone": "Yes",
          "assignee": "Tech",
          "target_date": "2026-05-29",
          "status": "In Progress",
          "overdue": true,
          "note": "Still in progress, vendor will inform soon",
          "weight": 3
        },
        {
          "row": 22,
          "name": "Site Survey & Inspection",
          "milestone": "No",
          "assignee": "Vendor",
          "target_date": "2026-06-05",
          "status": "Completed",
          "overdue": false,
          "note": "<< charging station location is being discussed at local jetty (currently proposed at the utmost left dolphin, might need to build extension)",
          "weight": 1
        },
        {
          "row": 23,
          "name": "Commercial Proposal",
          "milestone": "No",
          "assignee": "Vendor",
          "target_date": "2026-06-26",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 24,
          "name": "Commercial Proposal Review & Finalization",
          "milestone": "Yes",
          "assignee": "Proc",
          "target_date": "2026-07-10",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 25,
          "name": "Shipyard Inspection",
          "milestone": "No",
          "assignee": "Proc & Tech",
          "target_date": "2026-06-26",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 1
        },
        {
          "row": 26,
          "name": "Shipyard Selection",
          "milestone": "Yes",
          "assignee": "Proc & Tech",
          "target_date": "2026-07-17",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 29,
          "name": "Contract Drafting & Review",
          "milestone": "No",
          "assignee": "Proc",
          "target_date": "2026-08-14",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 30,
          "name": "Contract Signing",
          "milestone": "Yes",
          "assignee": "Proc",
          "target_date": "2026-08-28",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 5
        },
        {
          "row": 33,
          "name": "Sourcing",
          "milestone": "No",
          "assignee": "Proc",
          "target_date": "2026-06-26",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 1
        },
        {
          "row": 34,
          "name": "Request for Proposal",
          "milestone": "No",
          "assignee": "Proc",
          "target_date": "2026-07-17",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 1
        },
        {
          "row": 35,
          "name": "Selection",
          "milestone": "Yes",
          "assignee": "Proc",
          "target_date": "2026-07-31",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 36,
          "name": "Contract Drafting & Signing",
          "milestone": "Yes",
          "assignee": "Proc",
          "target_date": "2026-08-14",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 5
        },
        {
          "row": 39,
          "name": "Preliminary & Basic Design",
          "milestone": "Yes",
          "assignee": "Vendor",
          "target_date": "2026-10-30",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 40,
          "name": "Class Approval",
          "milestone": "Yes",
          "assignee": "Vendor",
          "target_date": "2026-12-31",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 5
        },
        {
          "row": 41,
          "name": "Detailed Engineering Design",
          "milestone": "Yes",
          "assignee": "Vendor",
          "target_date": "2027-01-29",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 42,
          "name": "Material and Equipment Procurement",
          "milestone": "Yes",
          "assignee": "Vendor",
          "target_date": "2027-03-31",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 43,
          "name": "Hull Building & Outfitting",
          "milestone": "Yes",
          "assignee": "Vendor",
          "target_date": "2027-08-31",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 44,
          "name": "Integration & Testing",
          "milestone": "Yes",
          "assignee": "Vendor",
          "target_date": "2027-10-29",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 45,
          "name": "Sea Trials & Commissioning",
          "milestone": "Yes",
          "assignee": "Vendor",
          "target_date": "2027-12-31",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 5
        },
        {
          "row": 46,
          "name": "Delivery",
          "milestone": "Yes",
          "assignee": "Proc",
          "target_date": "2027-02-26",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 5
        }
      ]
    },
    {
      "id": "Project-Kappa",
      "name": "Project Kappa",
      "pm": "PM Epsilon",
      "health": "Delayed",
      "deal_size": "N/A",
      "deal_size_num": 0,
      "status_note": "",
      "final_deadline": null,
      "revised_deadline": null,
      "kpis": {
        "completion_pct": 0.3478,
        "milestones_achieved": 6,
        "total_milestones": 11,
        "overdue_tasks": 2,
        "overdue_milestones": 2,
        "next_milestone": "2026-04-24",
        "next_milestone_overdue": true
      },
      "sections": [],
      "tasks": [
        {
          "row": 10,
          "name": "Program preparation",
          "milestone": "Yes",
          "assignee": "",
          "target_date": "2026-02-28",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 1
        },
        {
          "row": 11,
          "name": "Kick-off",
          "milestone": "Yes",
          "assignee": "",
          "target_date": "2026-03-06",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 1
        },
        {
          "row": 12,
          "name": "Champion training & appointment",
          "milestone": "Yes",
          "assignee": "",
          "target_date": "2026-03-20",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 1
        },
        {
          "row": 13,
          "name": "Project initiatives submission & approval (P1)",
          "milestone": "Yes",
          "assignee": "",
          "target_date": "2026-03-20",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 14,
          "name": "Verification process HR, GMO, Comm (P1)",
          "milestone": "Yes",
          "assignee": "",
          "target_date": "2026-04-03",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 1
        },
        {
          "row": 15,
          "name": "Verification process HR, Finance, Risk, Legal (P2)",
          "milestone": "Yes",
          "assignee": "",
          "target_date": "2026-04-10",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 1
        },
        {
          "row": 16,
          "name": "Selection process (team presentation to committee) (P2)",
          "milestone": "Yes",
          "assignee": "",
          "target_date": "2026-04-17",
          "status": "In Progress",
          "overdue": true,
          "note": "",
          "weight": 3
        },
        {
          "row": 17,
          "name": "Project milestone & progress tracking (P3-P4)",
          "milestone": "Yes",
          "assignee": "",
          "target_date": "2026-04-24",
          "status": "In Progress",
          "overdue": true,
          "note": "",
          "weight": 3
        },
        {
          "row": 18,
          "name": "Realisation phase (P5)",
          "milestone": "Yes",
          "assignee": "",
          "target_date": "2027-01-05",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 5
        },
        {
          "row": 19,
          "name": "Project result presentation to Chairman committee",
          "milestone": "Yes",
          "assignee": "",
          "target_date": "2027-02-12",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 20,
          "name": "Winner award",
          "milestone": "Yes",
          "assignee": "",
          "target_date": "2027-02-26",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 1
        }
      ]
    },
    {
      "id": "Project-Lambda",
      "name": "Project Lambda",
      "pm": "PM Zeta",
      "health": "Delayed",
      "deal_size": "N/A",
      "deal_size_num": 0,
      "status_note": "",
      "final_deadline": "2026-11-30",
      "revised_deadline": null,
      "kpis": {
        "completion_pct": 0.5000,
        "milestones_achieved": 0,
        "total_milestones": 1,
        "overdue_tasks": 1,
        "overdue_milestones": 1,
        "next_milestone": "2026-06-09",
        "next_milestone_overdue": true
      },
      "sections": [],
      "tasks": [
        {
          "row": 10,
          "name": "Presentation to Project Kappa team",
          "milestone": "Yes",
          "assignee": "PM Zeta",
          "target_date": "2026-06-09",
          "status": "In Progress",
          "overdue": true,
          "note": "",
          "weight": 1
        }
      ]
    },
    {
      "id": "Project-Mu",
      "name": "Project Mu",
      "pm": "PM Eta",
      "health": "Delayed",
      "deal_size": "N/A",
      "deal_size_num": 0,
      "status_note": "Contract signing overdue, draft contract awaited",
      "final_deadline": null,
      "revised_deadline": null,
      "kpis": {
        "completion_pct": 0.7424,
        "milestones_achieved": 3,
        "total_milestones": 6,
        "overdue_tasks": 3,
        "overdue_milestones": 2,
        "next_milestone": "2026-06-19",
        "next_milestone_overdue": true
      },
      "sections": [
        {
          "row": 24,
          "title": "Stream 1"
        },
        {
          "row": 26,
          "title": "Holco-Opco governance cockpit feature is designed for prototyped and roadmap developed (Stream 1-AI)"
        },
        {
          "row": 28,
          "title": "Stream 2"
        },
        {
          "row": 29,
          "title": "Risk cockpit POC deployed to production and adopted in Risk Committee / Shareholder meetings (Stream 2-AI)"
        },
        {
          "row": 31,
          "title": "Stream 3a"
        },
        {
          "row": 32,
          "title": "Portfolio prioritization, growth strategy, and OpCo-level effort allocation sign-off by mgmt (Stream 3a)"
        },
        {
          "row": 34,
          "title": "Stream 3b"
        },
        {
          "row": 35,
          "title": "$XX worth of initiatives are moved to L4 level with Consulting Firm A support (Stream 3b)"
        },
        {
          "row": 36,
          "title": "Stream 3b 4-month monitoring window completed"
        },
        {
          "row": 40,
          "title": "Focus on: deliverables vs actual"
        }
      ],
      "tasks": [
        {
          "row": 10,
          "name": "Proposal revision received",
          "milestone": "No",
          "assignee": "",
          "target_date": "2026-05-22",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 1
        },
        {
          "row": 11,
          "name": "Proposal reviewed and approved",
          "milestone": "Yes",
          "assignee": "",
          "target_date": "2026-06-05",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 12,
          "name": "Finalise Parent Co entity used for engagement",
          "milestone": "No",
          "assignee": "",
          "target_date": "2026-06-12",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 1
        },
        {
          "row": 13,
          "name": "Draft NDA received",
          "milestone": "No",
          "assignee": "",
          "target_date": "2026-06-09",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 1
        },
        {
          "row": 14,
          "name": "NDA signed",
          "milestone": "Yes",
          "assignee": "",
          "target_date": "2026-06-12",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 15,
          "name": "Draft contract received",
          "milestone": "No",
          "assignee": "",
          "target_date": "2026-06-12",
          "status": "In Progress",
          "overdue": true,
          "note": "<< awaiting for draft contract",
          "weight": 3
        },
        {
          "row": 16,
          "name": "Contract confirmation",
          "milestone": "Yes",
          "assignee": "",
          "target_date": "2026-06-19",
          "status": "In Progress",
          "overdue": true,
          "note": "",
          "weight": 5
        },
        {
          "row": 17,
          "name": "F1 approved",
          "milestone": "No",
          "assignee": "",
          "target_date": "2026-06-19",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 1
        },
        {
          "row": 18,
          "name": "Contract signing",
          "milestone": "Yes",
          "assignee": "",
          "target_date": "2026-06-19",
          "status": "In Progress",
          "overdue": true,
          "note": "",
          "weight": 5
        },
        {
          "row": 19,
          "name": "Project kickoff",
          "milestone": "Yes",
          "assignee": "",
          "target_date": "2026-06-26",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 5
        },
        {
          "row": 20,
          "name": "Project completion",
          "milestone": "Yes",
          "assignee": "",
          "target_date": null,
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 5
        }
      ]
    },
    {
      "id": "Project-Nu",
      "name": "Project Nu",
      "pm": "PM Eta",
      "health": "At Risk",
      "deal_size": "N/A",
      "deal_size_num": 0,
      "status_note": "",
      "final_deadline": "2026-07-10",
      "revised_deadline": null,
      "kpis": {
        "completion_pct": 0.5172,
        "milestones_achieved": 0,
        "total_milestones": 5,
        "overdue_tasks": 0,
        "overdue_milestones": 0,
        "next_milestone": "2026-07-03",
        "next_milestone_overdue": false
      },
      "sections": [],
      "tasks": [
        {
          "row": 10,
          "name": "Proposal revision received",
          "milestone": "No",
          "assignee": "PM Eta",
          "target_date": "2026-05-22",
          "status": "Completed",
          "overdue": false,
          "note": "",
          "weight": 1
        },
        {
          "row": 11,
          "name": "Proposal reviewed and approved",
          "milestone": "Yes",
          "assignee": "PM Eta",
          "target_date": "2026-07-03",
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 12,
          "name": "Draft contract received",
          "milestone": "No",
          "assignee": "PM Eta",
          "target_date": null,
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 3
        },
        {
          "row": 13,
          "name": "Contract confirmation",
          "milestone": "Yes",
          "assignee": "PM Eta",
          "target_date": null,
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 5
        },
        {
          "row": 14,
          "name": "F1 approved",
          "milestone": "No",
          "assignee": "PM Eta",
          "target_date": null,
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 1
        },
        {
          "row": 15,
          "name": "Contract signing",
          "milestone": "Yes",
          "assignee": "PM Eta",
          "target_date": null,
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 5
        },
        {
          "row": 16,
          "name": "Project kickoff",
          "milestone": "Yes",
          "assignee": "PM Eta",
          "target_date": null,
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 5
        },
        {
          "row": 17,
          "name": "Project monitoring",
          "milestone": "No",
          "assignee": "PM Eta",
          "target_date": null,
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 1
        },
        {
          "row": 18,
          "name": "Project completion",
          "milestone": "Yes",
          "assignee": "PM Eta",
          "target_date": null,
          "status": "In Progress",
          "overdue": false,
          "note": "",
          "weight": 5
        }
      ]
    }
  ],
  "inactive_projects": [
    {
      "id": "Project-Omicron",
      "name": "Project Omicron",
      "pm": "PM Alpha",
      "status": "Not Awarded",
      "reason": "Tender not awarded",
      "deal_size": "$XX EV",
      "deal_size_num": 0,
      "sector": "Infrastructure",
      "geography": "Region A",
      "date_closed": "2026-06-25",
      "date_started": "2026-03-10",
      "duration_weeks": 15,
      "final_completion_pct": 0.45,
      "milestones_achieved": 3,
      "total_milestones": 8,
      "lessons_learned": "Competitor submitted lower bid structure based on alternative logistics rail route. In future, due diligence should include competitor route profiling earlier.",
      "residual_actions": "Archive folders, formal client feedback session, de-allocate team.",
      "tasks": []
    }
  ],
  "portfolio_previous": {
    "total_projects": 13,
    "avg_completion_pct": 0.2416,
    "milestone_hit_rate": 0.3204,
    "total_overdue_tasks": 33,
    "total_overdue_milestones": 31,
    "health_counts": {
      "On Track": 4,
      "At Risk": 8,
      "Delayed": 1
    }
  },
  "instructions": [
    {
      "title": "Step 1 — Intake: Project Office Upload",
      "items": [
        "Project Office personnel open the Project Dashboard Admin Panel.",
        "Drag-and-drop source files (Excel trackers, MS Project/P6 exports, PDF reports) into the upload area.",
        "Review queued files for completeness — ensure all active projects have updated inputs.",
        "Click [Run Update] to confirm — a warning will display that the AI agent will process files and update the dashboard.",
        "Estimated time: 5-10 minutes per upload cycle."
      ]
    },
    {
      "title": "Step 2 — AI Processing (Automated)",
      "items": [
        "Gemini AI ingests uploaded files and detects file type (Excel, P6 XML, PDF).",
        "Structured data extraction: KPIs, task statuses, milestone progress, overdue flags.",
        "Dashboard data layer is updated (project completion %, health status, overdue counts).",
        "Executive insights generated: top 3 CEO escalation items, updated automatically.",
        "Dashboard is marked as DRAFT pending review.",
        "Estimated time: 3-5 minutes (fully automated, no human input required)."
      ]
    },
    {
      "title": "Step 3 — Project Office Review & Approval",
      "items": [
        "Open the DRAFT dashboard and compare figures against source files.",
        "Option A: [Approve & Publish] — dashboard goes live for CEO synthesis.",
        "Option B: [Re-run AI] — add reviewer notes (e.g. 'SPA target date is 30-Jun not 22-May') and AI re-processes.",
        "Option C: [Edit Manually] — correct specific data points directly in the edit panel (logged as manual override).",
        "All manual edits are flagged in the audit trail for traceability.",
        "Estimated time: 10-20 minutes."
      ]
    },
    {
      "title": "Step 4 — Timeliness Monitoring (Automated)",
      "items": [
        "System continuously checks whether the Project Dashboard has been updated for the current week.",
        "Reminder 1: If not updated by Thursday EOD — notification sent to Project Office owner.",
        "Reminder 2: If still not updated by Friday 12pm — escalated notification (cc CEO Office).",
        "Deadlines automatically adjust for public holidays (reads from company Google Calendar).",
        "If still not updated: dashboard is flagged as 'stale' for CEO synthesis with a visible warning."
      ]
    },
    {
      "title": "Step 5 — CEO Synthesis (Triggered by CEO Office)",
      "items": [
        "CEO Office opens the Synthesis Panel and reviews readiness status of all CXO dashboards.",
        "Readiness check shows: Published / Stale (with age) / Pending per dashboard.",
        "For stale dashboards: one-click chase message to the responsible office.",
        "Click [Run CEO Synthesis] — AI reads Project Dashboard data + other CXO dashboards.",
        "Escalation logic applied: projects with >25% schedule overrun, pending CEO decisions, or blocked milestones are surfaced.",
        "CEO Dashboard is generated and marked as DRAFT.",
        "Can be run multiple times (e.g. after a late update arrives)."
      ]
    },
    {
      "title": "Step 6 — CEO Office QC & Publication",
      "items": [
        "CEO Office reviews the synthesised CEO Dashboard for accuracy.",
        "Verify top 3 escalation items are appropriate and correctly sourced.",
        "Check for stale data warnings — decide whether to proceed or chase.",
        "Approve — dashboard published for CEO consumption. CEO receives notification.",
        "Reject — re-run synthesis or flag specific CXO dashboard for correction.",
        "Estimated time: 10-15 minutes."
      ]
    }
  ],
  "weekly_updates": {
    "latest": {
      "as_of_date": "2026-06-29",
      "as_of_display": "29-Jun-2026",
      "exported_at": "29-Jun-2026 09:00",
      "previous_snapshot_date": "2026-06-26",
      "previous_snapshot_display": "26-Jun-2026",
      "is_baseline": false,
      "summary": {
        "total_changes": 7,
        "positive_changes": 3,
        "negative_changes": 3,
        "new_projects": 1
      },
      "changes": [
        {
          "as_of_date": "2026-06-29",
          "project_id": "Project-Omicron",
          "project_name": "Project Omicron",
          "pm": "PM Alpha",
          "display_item": "Not awarded",
          "impact": "Project removed from active portfolio. $XX CAPEX deal not awarded.",
          "severity": "negative",
          "change_category": "project"
        },
        {
          "as_of_date": "2026-06-29",
          "project_id": "Project-Beta",
          "project_name": "Project Beta",
          "pm": "PM Beta",
          "display_item": "Competition Clearance completed",
          "impact": "Major regulatory milestone achieved. Subject to 14-day review by 08-Jul.",
          "severity": "positive",
          "change_category": "task"
        },
        {
          "as_of_date": "2026-06-29",
          "project_id": "Project-Epsilon",
          "project_name": "Project Epsilon",
          "pm": "PM Beta",
          "display_item": "Health: At Risk → Delayed",
          "impact": "14 tasks completed this week but timeline dependent on Client Co feedback.",
          "severity": "warning",
          "change_category": "project"
        },
        {
          "as_of_date": "2026-06-29",
          "project_id": "Project-Eta",
          "project_name": "Project Eta",
          "pm": "PM Alpha",
          "display_item": "Health: At Risk → On Track",
          "impact": "Consortium formation and Advisory Firm tracks structured with clear milestones.",
          "severity": "positive",
          "change_category": "project"
        },
        {
          "as_of_date": "2026-06-29",
          "project_id": "Project-Theta",
          "project_name": "Project Theta",
          "pm": "PM Gamma",
          "display_item": "Health: At Risk → Delayed",
          "impact": "Original deadline 19-Jun missed. Revised to 03-Jul.",
          "severity": "negative",
          "change_category": "project"
        },
        {
          "as_of_date": "2026-06-29",
          "project_id": "Project-Delta",
          "project_name": "Project Delta",
          "pm": "PM Beta",
          "display_item": "Seller Counter Proposal completed",
          "impact": "Key external dependency resolved. Seller meeting scheduled for 01-Jul.",
          "severity": "positive",
          "change_category": "task"
        },
        {
          "as_of_date": "2026-06-29",
          "project_id": "Project-Nu",
          "project_name": "Project Nu",
          "pm": "PM Eta",
          "display_item": "New project added",
          "impact": "New project added to portfolio.",
          "severity": "neutral",
          "change_category": "project"
        }
      ]
    },
    "history": [
      {
        "as_of_date": "2026-06-29",
        "as_of_display": "29-Jun-2026",
        "exported_at": "29-Jun-2026 09:00",
        "previous_snapshot_date": "2026-06-26",
        "previous_snapshot_display": "26-Jun-2026",
        "is_baseline": false,
        "summary": {
          "total_changes": 7,
          "positive_changes": 3,
          "negative_changes": 3,
          "new_projects": 1
        },
        "changes": []
      },
      {
        "as_of_date": "2026-06-01",
        "as_of_display": "01-Jun-2026",
        "exported_at": "01-Jun-2026 09:00",
        "previous_snapshot_date": "2026-05-25",
        "previous_snapshot_display": "25-May-2026",
        "is_baseline": false,
        "summary": {
          "total_changes": 0,
          "positive_changes": 0,
          "negative_changes": 0
        },
        "changes": []
      },
      {
        "as_of_date": "2026-06-09",
        "as_of_display": "09-Jun-2026",
        "exported_at": "09-Jun-2026 09:00",
        "previous_snapshot_date": "2026-06-02",
        "previous_snapshot_display": "02-Jun-2026",
        "is_baseline": false,
        "summary": {
          "total_changes": 3,
          "positive_changes": 1,
          "negative_changes": 1
        },
        "changes": [
          {
            "as_of_date": "2026-06-09",
            "project_id": "Project-Omicron",
            "project_name": "Project Omicron",
            "pm": "PM Alpha",
            "display_item": "Health: On Track → Delayed",
            "impact": "Project health deteriorated.",
            "severity": "negative",
            "change_category": "project"
          }
        ]
      }
    ]
  },
  "executive_summary": {
    "as_of": "29-Jun-2026",
    "compared_to_week": "26-Jun-2026",
    "portfolio_pulse": {
      "active_projects": 13,
      "ma_capital_value": "US$660M",
      "ma_capital_sub": "across 4 active M&A projects (Project Omicron not awarded)",
      "delayed_count": 7,
      "value_at_risk": "US$540M",
      "actions_required": 1
    },
    "criticality_assessment": {
      "methodology": "Projects assessed on: (1) Financial materiality, (2) Hard deadline proximity, (3) % milestones overdue, (4) Blocker controllability, (5) Dependency cascade, (6) PM capacity concentration",
      "reassessed_count": 13,
      "upgraded_to_at_risk": 3,
      "upgraded_to_delayed": 7,
      "pm_load": [
        {"pm": "PM Beta", "projects": 3, "at_risk_count": 2, "flag": "Watch"},
        {"pm": "PM Alpha", "projects": 4, "at_risk_count": 2, "flag": "Watch"},
        {"pm": "PM Gamma", "projects": 1, "at_risk_count": 0, "flag": "Normal"},
        {"pm": "PM Delta", "projects": 1, "at_risk_count": 1, "flag": "Normal"},
        {"pm": "PM Epsilon", "projects": 1, "at_risk_count": 1, "flag": "Normal"},
        {"pm": "PM Zeta", "projects": 1, "at_risk_count": 1, "flag": "Normal"},
        {"pm": "PM Eta", "projects": 2, "at_risk_count": 1, "flag": "Normal"}
      ]
    },
    "top_ceo_projects": [
      {
        "rank": 1,
        "id": "Project-Beta",
        "name": "Project Beta",
        "pm": "PM Beta",
        "health": "Delayed",
        "decision_type": "Decision Required",
        "severity": "Critical",
        "issue": "Regulatory Approval clearance overdue (11 days) with longstop 31-Jul only 32 days away. Competition Clearance completed but subject to 14-day review (by 08-Jul). Financing OpCo still pending Insurance Co decision. Full Earnout and Fund Co Deed still unresolved.",
        "value_at_risk": "US$320M",
        "value_detail": "$320M EV | 18.5% levered equity IRR | 100% acquisition at completion",
        "blocker_type": "External",
        "blocker_detail": "Regulatory Approval (regulator, overdue 11d, est 10-Jul) is the remaining external Hard CP. Financing OpCo (Insurance Co decision) is internal but sequentially dependent on Regulatory Approval clearing.",
        "days_overdue": 11,
        "overdue_since": "2026-06-18",
        "overdue_items": "Regulatory Approval (target 18-Jun), Financing OpCo (target 06-Jun), Full Earnout EBITDA (target 26-May), Fund Co Deed of Settlement (target 29-May)",
        "last_action": "Competition Clearance completed (subject to 14-day review by 08-Jul). Financing HoldCo and CG Related completed (awaiting signing). OpCo CG Related to Bank completed.",
        "escalation_reason": "Highest financial materiality among active M&A deals + Regulatory Approval as sole remaining external regulatory Hard CP + compressed timeline to longstop + financing drawdown dependent on Regulatory Approval clearing",
        "next_steps": "Monitor Regulatory Approval determination (est 10-Jul). Prepare financing documents for immediate execution upon clearance. Finalise Full Earnout calculation (target 23-25 Jun already passed, follow up). Progress Fund Co Deed once Earnout Amount confirmed.",
        "ceo_decision": "Direct escalation to Regulatory Board contact by CEO to expedite determination before 10-Jul, or prepare longstop date extension proposal.",
        "decide_by": "2026-07-10",
        "wow_status": "Remains #1 — Competition Clearance resolved (positive), Regulatory Approval still pending. 3 financing items completed this week.",
        "callout_class": "callout-red",
        "deviations": [
          {"milestone": "Regulatory Approval Clearance", "target_date": "2026-06-18", "actual": "In Progress (est 10-Jul)", "days_over": 11},
          {"milestone": "Financing – OpCo", "target_date": "2026-06-06", "actual": "In Progress (Insurance Co pending)", "days_over": 23},
          {"milestone": "Full Earnout EBITDA", "target_date": "2026-05-26", "actual": "In Progress", "days_over": 34},
          {"milestone": "Fund Co Deed of Settlement", "target_date": "2026-05-29", "actual": "In Progress", "days_over": 31}
        ]
      }
    ],
    "watch_list": [
      {
        "id": "Project-Mu",
        "name": "Project Mu",
        "pm": "PM Eta",
        "health": "Delayed",
        "overdue_tasks": 3,
        "note": "Contract signing overdue (target 19-Jun). Draft contract still not received from Consulting Firm A. Project kickoff occurred but contract formalities remain incomplete.",
        "reason_not_escalated": "Low financial materiality. Project has kicked off regardless. Contract formality issue, not transaction risk."
      },
      {
        "id": "Project-Gamma",
        "name": "Project Gamma",
        "pm": "PM Alpha",
        "health": "At Risk",
        "overdue_tasks": 0,
        "note": "$80M deal restructured around Partner Co exclusivity and VO strategy. Awaiting Partner Co's guidance on offer letter adjustment. No overdue items but significant strategic uncertainty.",
        "reason_not_escalated": "No hard deadline, awaiting counterparty response. Strategic direction pivot in progress. No CEO action possible until Partner Co responds."
      },
      {
        "id": "Project-Delta",
        "name": "Project Delta",
        "pm": "PM Beta",
        "health": "Delayed",
        "overdue_tasks": 1,
        "note": "Seller Counter Proposal received (positive). Engagement Letter with Advisor still pending (5 days overdue). Seller meeting scheduled for 01-Jul.",
        "reason_not_escalated": "Seller engagement achieved. Meeting scheduled. No CEO action needed unless meeting does not materialise."
      },
      {
        "id": "Project-Nu",
        "name": "Project Nu",
        "pm": "PM Eta",
        "health": "At Risk",
        "overdue_tasks": 0,
        "note": "Early stage. Proposal approved target 03-Jul. Multiple subsequent milestones without dates. Low financial materiality but needs contracting momentum.",
        "reason_not_escalated": "Early-stage consulting engagement. No overdue items yet. Monitor for contracting delays."
      }
    ],
    "de_escalated": [
      {
        "id": "Project-Epsilon",
        "name": "Project Epsilon",
        "pm": "PM Beta",
        "note": "Major progress — 16 of 19 milestones completed (86%). All regulatory, RFP, and financial model items completed. Financial Model sent to Client Co on 26-Jun. No overdue items. Upgraded to On Track."
      },
      {
        "id": "Project-Theta",
        "name": "Project Theta",
        "pm": "PM Gamma",
        "note": "Revised deadline 03-Jul agreed. No overdue items remaining. Opco closing dates confirmed. Upgraded to On Track."
      },
      {
        "id": "Project-Eta",
        "name": "Project Eta",
        "pm": "PM Alpha",
        "note": "Upgraded to On Track. Consortium formation underway (Consortium Partners). Advisory Firm engaged on multiple advisory tracks. No overdue items."
      }
    ],
    "open_items": [
      {"date_added": "29-Jun-2026", "action": "Monitor Regulatory Approval determination (est 10-Jul)", "owner": "PM Beta", "deadline": "10-Jul-2026", "status": "Open"},
      {"date_added": "29-Jun-2026", "action": "Chase Consulting Firm A for draft contract", "owner": "PM Eta", "deadline": "03-Jul-2026", "status": "Open"},
      {"date_added": "29-Jun-2026", "action": "Follow up on Full Earnout finalisation (was target 23-25 Jun)", "owner": "PM Beta", "deadline": "03-Jul-2026", "status": "Open"},
      {"date_added": "26-Jun-2026", "action": "Finance Model sign-off for Project Epsilon", "owner": "Team Member 1", "deadline": "03-Jul-2026", "status": "Closed", "remarks": "Completed — sent to Client Co 26-Jun"},
      {"date_added": "29-Jun-2026", "action": "Project Omicron — tender outcome", "owner": "PM Alpha", "deadline": "20-Jun-2026", "status": "Closed", "remarks": "Not awarded. $XX CAPEX removed from active portfolio."}
    ],
    "milestone_update": {
      "achieved": 52,
      "total": 111,
      "hit_rate": 0.4685,
      "narrative": "Portfolio milestone hit rate: 46.8% (52 of 111 achieved). 14 total overdue tasks across 13 projects. Significant improvement from last week (32.0%)."
    }
  }
};

export const INITIAL_MOCK_EMAILS: Email[] = [
  {
    id: "mail-1",
    from: "pm.beta@ceo-office.com",
    date: "2026-06-29T08:15:00Z",
    subject: "Project Beta - CRITICAL longstop deadline risk & regulatory delay",
    body: "Dear CEO,\n\nI am writing to raise an urgent flag regarding Project Beta. The Regulatory Approval clearance is now 11 days overdue (our target was 18-Jun). \n\nWe have received positive Competition Clearance on 11-Jun, but it is subject to a 14-day review period which ends on 08-Jul. The regulator seems to have referred our final approval to this timeline, which pushes the estimated determination date to 10-Jul.\n\nOur longstop date is 31-Jul-2026 — just 32 days away. We also have a dependency on the OpCo financing drawdown (pending Insurance Co decision) which cannot clear until the Regulatory Approval is obtained.\n\nCould you directly engage the Treasury contacts to seek an expedited review? If not, we should immediately prepare a proposal for a longstop date extension.\n\nBest regards,\nPM Beta",
    processed: false
  },
  {
    id: "mail-2",
    from: "pm.alpha@ceo-office.com",
    date: "2026-06-28T14:30:00Z",
    subject: "Project Alpha - Regulatory NIS review schedule & Seller alignment",
    body: "Hi CEO,\n\nWe have completed the External Expert Committee Review on 15-Jun successfully, and the Letter of Guarantee (LoG) was signed by the Buyer Entity as requested by the regulator.\n\nHowever, the National Intelligence Service (NIS) review and internal Regulator committee reviews are scheduled for 10-Jul. \n\nWe are holding an alignment meeting with the seller and legal representatives on 02-Jul to align expectations regarding this timeline. Financing documentation drafting is progressing as scheduled and we target completion by 15-Jul.\n\nEverything else is on track.\n\nBest,\nPM Alpha",
    processed: false
  },
  {
    id: "mail-3",
    from: "engagements@consultinga.com",
    date: "2026-06-29T07:45:00Z",
    subject: "Project Mu - Delay in Draft Contract Delivery",
    body: "Dear PM Eta,\n\nWe apologize for the delay in sending over the draft contract for the HoldCo-OpCo governance cockpit feature under Stream 1.\n\nAlthough we have kicked off the project and our team is actively working on the prototype, our legal department is still finalizing the contract formalities. We anticipate delivering the formal draft contract to you by Friday, 03-Jul-2026.\n\nThank you for your patience.\n\nWarm regards,\nClient Services Team\nConsulting Firm A",
    processed: false
  },
  {
    id: "mail-4",
    from: "pm.gamma@ceo-office.com",
    date: "2026-06-29T06:00:00Z",
    subject: "Project Theta - Opco closing dates confirmed, no overdue items",
    body: "Hi everyone,\n\nGreat news for Project Theta. We checked each OpCo's monthly closing dates and the team successfully submitted reports. The actual closing was completed on 08-Jun-2026.\n\nWe have agreed on a revised deadline of 03-Jul-2026 for the final consolidation. There are no overdue items left on this project. I recommend upgrading Project Theta's health to 'On Track' in this week's report.\n\nBest,\nPM Gamma",
    processed: false
  },
  {
    id: "mail-5",
    from: "engineering@technovend.com",
    date: "2026-06-27T11:20:00Z",
    subject: "Project Iota - Site survey completed and jetty extension challenge",
    body: "Dear PM Delta,\n\nWe have completed the site survey and shipyard inspection for the construction/newbuilding phase. \n\nHowever, we have encountered a structural challenge during our technical review of the charging station. The proposed location at the local jetty (the utmost left dolphin) might not support the weight structure. We might need to build a structural jetty extension, which is currently being discussed. \n\nBecause of this, the Technical Proposal Review & Finalization (originally target 29-May) is still in progress and will be delayed. We are awaiting a formal confirmation from our engineers soon.\n\nBest regards,\nTechnical Operations\nTechnoVend",
    processed: false
  }
];
