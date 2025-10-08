# 🎓 Internship Dashboard Project

> A React-based educational dashboard built during a company internship.  
> This project demonstrates practical implementation of **React concepts**, **state management**, **API integration**, and **Material-UI components** for managing countries and departments.

<p align="center">
  <em>Goal:</em> Help future interns explore, learn, and practice real-world React development patterns.
</p>

---

## 📘 Overview

The **Internship Dashboard Project** is a learning-oriented React application developed during an internship program.  
It provides a **comprehensive example** of how to build modular, maintainable React applications that interact with APIs and manage complex state.

The system allows users to manage **Countries** and **Departments** with CRUD operations, including:
- Pagination, search, and filtering.
- Form handling with validation.
- Tree view hierarchy for departments.
- State management using **MobX**.

This project is intended as a **reference and practice guide** for future interns preparing to work with enterprise-level React projects.

---

## 🧭 Table of Contents
## 🧭 Table of Contents

1. [📘 Overview](#-overview)
2. [🧱 Technologies Stack](#-technologies-stack)
3. [🚀 Project Features](#-project-features)
   - [🧩 Basic React Concepts](#-basic-react-concepts)
   - [🧭 Routing and State Management](#-routing-and-state-management)
   - [📝 Forms and Validation](#-forms-and-validation)
   - [🌐 RESTful API Integration](#-restful-api-integration)
   - [🎨 UI with Material-UI](#-ui-with-material-ui)
   - [⚙️ Advanced CRUD Operations](#%EF%B8%8F-advanced-crud-operations)
   - [🔄 MobX State Management](#-mobx-state-management)
   - [🧠 Advanced React Features](#-advanced-react-features)
   - [🧩 Custom Components](#-custom-components)
   - [💡 Additional Enhancements](#-additional-enhancements)
---

## 🧱 Technologies Stack

| Category | Technologies / Tools |
|:----------|:--------------------|
| **Frontend** | React.js (SPA) |
| **UI Library** | Material-UI (Tables, Forms, TreeView) |
| **Forms** | Formik + Yup (Validation) |
| **State Management** | MobX (Stores, Observables, Computed) |
| **Routing** | React Router DOM |
| **API Client** | Axios (GET / POST / PUT / DELETE) |
| **Data Source** | JSON Mock Files (e.g., `CountryData.json`) |
| **Other** | React Hooks (`useState`, `useEffect`), Props, Class & Function Components |

---

## 🚀 Project Features

### 🧩 Basic React Concepts
- **SPA Setup** using React with routes for Home, Countries, and Departments.  
- Demonstrates **Class vs. Function Components** and lifecycle methods (`componentDidMount`, `componentDidUpdate`).  
- Uses **mock data** (`CountryData.json`) for initial CRUD simulation.  

### 🧭 Routing and State Management
- Implements **React Router DOM** for page navigation.  
- Uses **React Hooks** (`useState`, `useEffect`) for UI updates and API data fetching.  
- Handles search and filter logic within stateful components.  

### 📝 Forms and Validation
- Dynamic **Props Passing** to forms and components.  
- **Formik** for building forms (Countries, Departments).  
- **Yup** for validation schemas (required fields, format checking).  
- Ability to **set field values** dynamically from API responses.  

### 🌐 RESTful API Integration
- Simulated API endpoints for `/countries` and `/departments`.  
- CRUD methods implemented using **Axios** and async/await syntax.  
- Promise-based error handling and user feedback.  

### 🎨 UI with Material-UI
- Clean and responsive UI built with **Material-UI**.  
- **Tables** for country lists with Edit/Delete actions.  
- **Dialog/Modal Popups** for create/edit forms.  
- **Service Layer** (`CountryService.js`) for centralized API calls.  

### ⚙️ Advanced CRUD Operations
- Complete CRUD for both **Countries** and **Departments**.  
- **Pagination**, **search**, and **hierarchical tree view** for departments.  
- Supports sorting, filtering, and multi-level data manipulation.  

### 🔄 MobX State Management
- Centralized state management with **MobX stores**.  
- `@observable` country and department lists.  
- Actions for API synchronization and computed values for derived states.  
- Extensible design for future entities (e.g., Ethnics, Religions).  

### 🧠 Advanced React Features
- Deep hierarchy management in Department CRUD.  
- **TreeView rendering** with expandable nodes using Material-UI.  
- Real-time UI reactivity powered by MobX observables.  

### 🧩 Custom Components
- **Reusable components** for inputs, dropdowns, and date pickers.  
- Custom TimeSheet component for tracking and data entry.  
- Support for **multi-select dropdowns** and formatted date pickers.  

### 💡 Additional Enhancements
- **Pagination** with server-side page size handling.  
- **Search** with keyword filtering.  
- **Excel Import/Export** for bulk operations.  
- **TreeView** with nested expansion for complex data structures.  

---
