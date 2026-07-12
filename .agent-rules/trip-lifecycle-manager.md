---
name: trip-lifecycle-manager
description: Executes state changes for trips and associated entities (Vehicles/Drivers) based on business rules.
trigger: "User requests to dispatch, complete, or cancel a trip"
---

# Skill: Trip Lifecycle Management

## Procedural Steps
When executing a trip state change, perform the following in a single database transaction:

### 1. Execute Transition Rules
* **If Dispatching (Draft -> Dispatched):**
    * Verify `Vehicle` capacity >= Trip `cargo_weight`.
    * Verify `Vehicle` status is `Available`.
    * Verify `Driver` status is `Available` and license is NOT expired.
    * Update `Vehicle` and `Driver` status to `On Trip`.
* **If Completing (Dispatched -> Completed):**
    * Update `Vehicle` and `Driver` status to `Available`.
* **If Canceling (Dispatched -> Cancelled):**
    * Revert `Vehicle` and `Driver` status to `Available`.
