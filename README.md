Internship Dashboard Project
Welcome to the Internship Dashboard Project! This is a sample dashboard application developed as part of a company internship program. It focuses on managing entities like countries and departments through CRUD operations. The project was shared in advance to help future interns learn key technologies and best practices, making the onboarding process smoother and more productive.
This repo is designed for educational purposes—feel free to clone, explore, and experiment with the code to deepen your understanding of modern React development.
Introduction
The dashboard provides a user-friendly interface for:

Viewing, adding, editing, and deleting country records (with pagination and search).
Managing departments in a hierarchical tree structure.
Handling forms for data entry with validation.

It demonstrates a full-stack frontend approach, integrating RESTful APIs, state management, and reusable UI components. Built with React, this project emphasizes clean code, modular design, and real-world workflows.
Technologies Used

Frontend Framework: React.js (SPA structure)
UI Library: Material-UI (for tables, forms, tree views, date pickers, etc.)
Form Handling: Formik (with Yup for validation)
State Management: MobX (for reactive stores and observables)
Routing: React Router DOM
API Integration: Axios (for GET, POST, PUT, DELETE requests with async/await)
Data Handling: JSON files for mock data (e.g., CountryData.json)
Other: Hooks (useState, useEffect), Class vs. Function Components, Props drilling

Features
Basic React Concepts

SPA Setup with React.js: Initialize a single-page application with routing for Home, Countries, and Departments pages.
Class vs. Function Components: Implement reusable components for displaying country lists and handling user interactions.
Lifecycle Methods in Class Components: Manage mounting, updating, and unmounting for data fetching and cleanup.
Project Setup: Clone from SVN/Git, configure with sample data files like CountryData.json, and implement functions for Edit/Delete actions.

Routing and State Management

React Router DOM: Navigate between pages (e.g., Countries index) with protected routes.
State Management with React Hooks: Use useState and useEffect for local state, props passing, and API calls to update UI (e.g., search by name/code/description).

Forms and Validation

Props in Components: Pass data dynamically for form rendering and submission.
Formik for Forms: Handle country/department creation/editing with initial values, validation schema, and onSubmit handlers.
Validation Schema: Yup-based rules for required fields, ensuring data integrity before API submission.
Set Field Values: Dynamically update form fields based on API responses or user input.

RESTful API Integration

Building RESTful APIs: Mock endpoints for countries (e.g., GET /countries, POST /countries) using Axios.
HTTP Methods: Implement GET (fetch list), POST (create), PUT (update), DELETE (remove) with async/await and then() chaining.
Async/Await and Error Handling: Fetch data on load, handle promises for smooth user experience.

UI with Material-UI

Material-UI Components: Use tables for country lists, forms for CRUD, and integrate with API data.
Display Country in Table: Render fetched data in Material Table with Edit/Delete columns.
Country Service Code: API calls in CountryService.js for pagination, search, and form population.

Advanced CRUD Operations

Basic CRUD for Countries: Full cycle—create, read, update, delete with Material-UI forms and tables.
Department Management: Hierarchical CRUD for departments (parent-child relationships) using TreeView.
Display Departments in TreeView: Visualize structure with Material-UI TreeView, supporting expansion and selection.

MobX State Management

Introduction to MobX: Simple state management for reactive updates.
Using MobX in Country Store: Create CountryStore as a class component with @observable arrays (e.g., countryList) and actions for API integration.
Fetching and Updating Lists: Load countries via API, filter/search, and sync with UI.
MobX Core: Extend to handle department hierarchies, religions, or family relationships in stores.
Using MobX with Ethnic/Religion: Modular stores for related data, using computed values for derived state.

Advanced React Features

CRUD for Departments: Manage parent departments with fields like name, description, function block, founded number, display order.
Display in TreeView: Hierarchical rendering with Material-UI, including add/edit popups and Excel import/export.
MobX Core Integration: Reactive stores for department trees, ensuring real-time updates.

Custom Components

Reusable Components for TimeSheet: Build TextField and DatePicker with Material-UI for time tracking.
Date Picker with Local Format: Custom handling for date selection in forms.
Select Component: Dropdowns for multi-select options in surveys or filters.

Additional UI Enhancements

Pagination: Material-UI pagination for country lists (e.g., pageSize via API).
Search Functionality: Keyword-based filtering on countries.
Export/Import: Excel handling for bulk data operations.
TreeView for Hierarchies: Nested department display with expand/collapse.
Learning Points
This project is structured to teach progressively:

Basics: Start with components, hooks, and routing to build a solid foundation.
Intermediate: Dive into forms (Formik/Yup) and API calls (Axios) for dynamic data handling.
Advanced: Explore state management (MobX) and complex UIs (TreeView, pagination) for scalable apps.
Best Practices: Modular code, error handling, and reusable components for maintainability.

Experiment by adding features like authentication or charts to extend your learning.
