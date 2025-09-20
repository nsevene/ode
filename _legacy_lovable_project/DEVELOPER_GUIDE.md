# ODPortal Developer Guide

This document provides a technical overview of the ODPortal B2B application, its architecture, and key development practices.

## 1. Architecture Overview

The application is a **React (Vite) Single Page Application (SPA)** that serves as a B2B portal for various user roles (admins, tenants, investors). It is architected to be a standalone frontend that communicates with a **Supabase** backend for data persistence, authentication, and serverless functions.

-   **Frontend**: `React`, `TypeScript`, `Vite`, `TailwindCSS`, `Shadcn/ui`
-   **Backend**: `Supabase` (PostgreSQL, Auth, Edge Functions)
-   **State Management**: Primarily managed through custom hooks (`useState`, `useContext`) and `React Query` for server state.
-   **Routing**: `react-router-dom`

### Key Architectural Decisions:
1.  **Code Splitting**: All pages are lazy-loaded via the `src/pages/LazyPages.tsx` component to improve initial load times.
2.  **Hook-Based Data Fetching**: Data fetching and state management for complex views are encapsulated in custom hooks (e.g., `useAdminDashboard.ts`). This promotes reusability and separation of concerns.
3.  **Role-Based Access Control (RBAC)**: Access to specific routes is controlled by the `SecureRoute` component, which leverages the `useRoles` hook to verify user permissions against the `user_roles` table in the database.

## 2. Key Custom Hooks

The application relies heavily on custom hooks to manage state and logic.

-   **`useAuth()`**: Manages the global authentication state, providing access to the current user and session information from Supabase Auth.
-   **`useRoles()`**: Fetches the specific role (`admin`, `tenant`, etc.) for the currently authenticated user from our custom `user_roles` table. This is crucial for RBAC.
-   **`useAdminDashboard()`**: Fetches and aggregates all necessary data for the main admin dashboard. Utilizes efficient `count` queries for performance.
-   **`useTenantsPortal()`**: Fetches dynamic content for the Tenants Portal.
-   **`useInvestorsPortal()`**: Fetches dynamic content for the Investors Portal.
-   **`useDataRoom()`**: Fetches sections and recent file listings for the secure Data Room.

## 3. Getting Started

### Prerequisites
-   Node.js (v18.x or later)
-   npm
-   Supabase account and project set up

### Local Development Setup
1.  **Clone the repository.**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Set up environment variables**:
    -   Copy the `.env.example` file to a new file named `.env`.
    -   Fill in your Supabase project URL and Anon Key.
    ```
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```
4.  **Run the development server**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:8080` (or the next available port).

## 4. Deployment

A basic CI (Continuous Integration) workflow is set up using GitHub Actions in `.github/workflows/ci.yml`. This workflow automatically builds the project on every push to the `main` branch to ensure it remains in a buildable state.

### Manual Deployment Steps:
1.  **Build the project**:
    ```bash
    npm run build
    ```
2.  **Deploy the `dist/` directory**:
    -   The output of the build will be in the `dist/` folder.
    -   This folder can be deployed to any static hosting provider (e.g., Vercel, Netlify, AWS S3).
    -   Ensure your hosting provider is configured to handle client-side routing by redirecting all requests to `index.html`.
