# Product Requirements Document: TransitOps

## Product Vision
An end-to-end operational platform to digitize logistics, removing manual spreadsheet friction and ensuring strict business rule enforcement.

## Target Platform / UI
* **Primary Interface:** Desktop-first web application layout (prioritizing data density and complex datagrid management).

## Evals & Deterministic Test Criteria
### Eval 1: The Dispatch Guardrail
* **Given:** A driver with an expired license.
* **When:** The `DispatchTrip` use case is triggered.
* **Then:** System MUST abort transaction and return a `403` or `400`.

### Eval 2: Maintenance Status Lock
* **Given:** A vehicle 'Van-05' with status `Available`.
* **When:** `CreateMaintenance` is executed for 'Van-05'.
* **Then:** 'Van-05' status automatically becomes `In Shop` and is removed from dispatch pools.
