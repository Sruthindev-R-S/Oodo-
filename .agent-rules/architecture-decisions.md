# Architectural Blueprints & Trade-offs

## 1. Directory Structure Paradigm
We are utilizing a **Feature-based Screaming Architecture**. All concerns for a domain (e.g., `trips`) must remain encapsulated within `src/features/trips/`. 

## 2. Database Trade-offs (Relational/SQL)
* **Decision:** SQL via TypeORM & PostgreSQL.
* **Justification:** Core business rules mandate complex state management across multiple entities concurrently. ACID compliance and transaction support are strictly required to prevent race conditions. TypeORM provides robust transaction mapping via QueryRunner in a clean entity layer.
