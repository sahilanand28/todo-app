# Angular Todo App

A sleek and responsive Todo List web application built using **Angular 19**, **Material UI**, and a mock backend powered by **JSON Server**. Users can create multiple todo lists, add tasks, mark them as complete, and retain data across page reloads with **localStorage**.

## ✅ Features

- 📋 Create and manage multiple todo lists.
- ✍️ Add tasks with title and description.
- ✅ Toggle task completion state.
- 📊 Visual indicators for completed vs. pending tasks.
- 💾 Persist data using **localStorage** and sync with backend.
- 📱 Responsive Material Design UI (mobile + desktop).
- 🧠 State management using `BehaviorSubject` for efficient updates.
- 🧪 Unit tests with >90% code coverage using Angular Testing Utilities.
- 🧹 ESLint and Prettier for clean, consistent code style.

## 🔧 Prerequisites

- Angular CLI  
  ```bash
  npm install -g @angular/cli
  ```
- JSON Server  
  ```bash
  npm install -g json-server
  ```

## 🚀 How to Run the Application

1. **Clone the repository**:

   ```bash
   git clone https://github.com/sahilanand28/todo-app.git
   cd todo-app
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the mock backend** (JSON Server):

   ```bash
   json-server --watch db.json --port 3000
   ```

   > Accessible at `http://localhost:3000/lists`

4. **Start the Angular app**:

   ```bash
   ng serve
   ```

   Visit `http://localhost:4200` in your browser.

## 🧪 Running Unit Tests

To run all tests and check code coverage:

```bash
ng test --code-coverage
```

Open the coverage report:

```bash
start coverage/index.html
```

## 💅 Linting & Formatting

- **Lint your code**:

  ```bash
  ng lint
  ```

- **Format code** with Prettier:

  ```bash
  npx prettier --write .
  ```

## 📁 Folder Structure Highlights

```
src/
├── app/
│   ├── core/
│   │   ├── models/            # TypeScript interfaces (TodoList, Task)
│   │   └── services/          # TodoService with API + localStorage logic
│   ├── pages/
│   │   ├── todo-lists/        # Lists overview component
│   │   └── todo-list-detail/  # Task detail & add component
```

## 🛠 Tech Stack

- **Angular 19**
- **Angular Material**
- **RxJS (BehaviorSubject)**
- **JSON Server (Mock REST API)**
- **Browser LocalStorage**
- **Jasmine + Karma (Unit Testing)**
- **ESLint + Prettier (Code Style)**

## 🧠 Key Concepts Demonstrated

- Clean, modular Angular app architecture
- Real-time UI updates with BehaviorSubject
- REST + localStorage hybrid data persistence
- Mobile-first, responsive Material UI
- Full unit test coverage with mocking
- Developer tooling setup (linting, formatting, Git)

## 👨‍💻 Author

Built by [**Sahil Anand**](https://github.com/sahilanand28)  
🔗 GitHub: [todo-app repo](https://github.com/sahilanand28/todo-app)
