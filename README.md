# 📝 Llani's To-Do List

A high-performance, modular Task Management application built with Vanilla JavaScript. This project features a sophisticated "Redux-lite" state management system, persistent storage, and a modern Dark Mode UI.

Developed as part of **The Odin Project** curriculum to demonstrate mastery of modern JavaScript tooling and software design patterns.

## 🔗 [Live Demo] https://llani-rainey.github.io/odin-todolist/

---

## 🚀 Key Features

* **Project-Based Organization:** Categorize tasks into custom projects with a default "Inbox" for general items.
* **Intelligent Filtering:** View tasks by "Today," "This Week," or catch up on "Overdue" items.
* **Advanced Search & Sort:** Live-search through titles and notes; sort by priority, due date, or creation time.
* **Persistence:** Automatic synchronization with `localStorage` ensures your data survives page refreshes.
* **Responsive Dark Mode:** A sleek, high-contrast Slate & Electric Blue interface optimized for all device sizes.
* **Task Details:** Deep-dive into tasks to add notes, edit priorities, and manage completion status.

## 🧠 Learning Outcomes

* **Module Bundling:** Configured Webpack to manage complex asset dependency trees and environment-specific `publicPath` resolutions.
* **Separation of Concerns:** Achieved a clean break between data logic and DOM rendering.
* **Automated Workflows:** Implemented a CI/CD YAML pipeline to eliminate manual deployment errors.
* **Functional Programming:** Leveraged array methods (`map`, `filter`, `reduce`) and immutability patterns for data processing.

---

## 🛠️ Technical Architecture

This application is built using a **Unidirectional Data Flow** pattern, ensuring the UI stays perfectly in sync with the underlying data.

* **State (`state.js`):** The single source of truth for the entire app.
* **Actions (`actions.js`):** Pure functions that handle all state mutations (Create, Update, Delete).
* **Selectors (`selectors.js`):** Efficiently derive visible data from the state (filtering, sorting, searching).
* **UI Layer (`ui/`):** * `render.js`: Handles all DOM manipulation based on the current state.
    * `app.js`: Coordinates the initialization and the "Commit" loop.
* **Event Delegation (`events.js`):** Uses high-performance event listeners to manage dynamic UI elements.

---

## 🧰 Tech Stack

* **Language:** JavaScript (ES6 Modules)
* **Bundler:** Webpack 5
* **Date Logic:** `date-fns`
* **Styling:** CSS3 (Custom Variables & Grid/Flexbox)
* **CI/CD:** GitHub Actions (Automated Build & Deploy Pipeline)
* **Package Management:** npm

---

## 📦 Installation & Development

1.  **Clone the repo:**
    ```bash
    git clone [https://github.com/llani-rainey/odin-todolist.git](https://github.com/llani-rainey/odin-todolist.git)
    cd odin-todolist
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run development server:**
    ```bash
    npm run dev
    ```

4.  **Build for production:**
    ```bash
    npm run build
    ```

---

## 🤖 Deployment (CI/CD)

This project utilizes **GitHub Actions** for professional-grade deployment. 

Every push to the `main` branch triggers an automated workflow that:
1.  Sets up a Linux environment.
2.  Installs all `npm` dependencies.
3.  Runs the Webpack production build.
4.  Deploys the optimized `dist/` bundle to GitHub Pages.

---

