# 📂 Document Management System (DMS)

A modern and responsive **Document Management System** built with **React + TypeScript**.
The application provides **secure OTP-based authentication**, **document uploads**, **advanced search**, and a clean **dashboard** UI integrated with provided API endpoints.

---

## 🚀 Features

### 🔐 Authentication

* OTP-based login with **mobile number verification**
* **/generateOTP** and **/validateOTP** API integration

### 📤 Document Upload

* **Drag & Drop** file upload
* Add **metadata**: major/minor heads, tags, remarks, and date
* API: **/saveDocumentEntry**

### 🔍 Advanced Search

* Search documents by:

  * Tags
  * Dates
  * User
  * Text keywords
* API: **/searchDocumentEntry**

### 📊 Dashboard

* Overview of document statistics
* List of recent documents

### 🏷️ Tag Management

* Add / remove tags for better categorization
* API: **/documentTags**

---

## 🎨 UI/UX Highlights

* **Clean & Modern Interface** (blue-gray theme with subtle shadows)
* **Responsive Layout** (mobile, tablet, and desktop)
* **Interactive Components** (hover effects, smooth transitions)
* **User Feedback** (success/error messages, loaders)
* **Accessible Design** (proper contrast, keyboard navigation support)

---

## 📂 Project Structure

```
src/
 ├── App.tsx
 ├── components/
 │    ├── AuthScreen.tsx
 │    ├── Dashboard.tsx
 │    ├── UploadDocument.tsx
 │    ├── SearchDocuments.tsx
```

---

## ⚙️ Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd document-management-system
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. The app will run at: [http://localhost:5173](http://localhost:5173) (default for Vite).

---

## 🔌 API Endpoints Used

* `POST /generateOTP` – Generate OTP for login
* `POST /validateOTP` – Validate OTP for authentication
* `POST /saveDocumentEntry` – Upload document with metadata
* `POST /searchDocumentEntry` – Search documents
* `GET /documentTags` – Manage document tags

---

## 🛠️ Tech Stack

* **Frontend**: React, TypeScript, Vite
* **Styling**: Tailwind CSS (or CSS-in-JS depending on your setup)
* **State Management**: React Hooks
* **Backend APIs**: Integrated via provided endpoints

---

## 📜 License

This project is licensed under the **MIT License**.
