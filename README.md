# 🚀 User Management System

A simple **User Management System** built with **Angular 14**, **Bootstrap**, and **Material UI**.
This project allows users to **add, edit, delete, and manage roles** efficiently.

### 🌍 **Live Demo**
🔗 [User Management System](https://user-management-system-ecru.vercel.app/)

---

## 📌 Features  
✅ User List with Pagination  
✅ Add / Edit / Delete Users  
✅ Role Management (Admin, User)  
✅ Search and Filter Users  
✅ Responsive UI with Bootstrap & Angular Material  
✅ Fake API using JSON Server  

---

## 🛠 Installation & Setup  

### **1️⃣ Clone the Repository**  
```sh
git clone https://github.com/Rinkal222/User-Management-System.git
cd User-Management-System
```

### **2️⃣ Install Dependencies**  
```sh
npm install
```

### **3️⃣ Start the JSON Server (Fake API)**  
This project uses `json-server` to provide a **mock API**.  
If you haven’t installed `json-server`, install it globally first:
```sh
npm install -g json-server
```
Now, start the JSON server:
```sh
json-server --watch db.json --port 3000
```
The server will run at: **http://localhost:3000**

### **4️⃣ Start the Angular Development Server**  
```sh
ng serve
```
Now, open **http://localhost:4200/** in your browser.  

---

## 🏗 Deployment (Live Hosting)  

### **Deploy on Vercel**  
This project is **deployed on Vercel**.  
If you want to deploy your version, follow these steps:  

1️⃣ **Create an account on [Vercel](https://vercel.com/)**.  
2️⃣ **Connect your GitHub repository** to Vercel.  
3️⃣ Use these **build settings** while deploying:  
   - **Build Command:** `ng build --configuration=production`  
   - **Output Directory:** `dist/user-management-system`  
4️⃣ Click **Deploy** and get your **Live URL**!  

---


## 📂 Folder Structure  

```
/user-management-system
 ├── src
 │   ├── app
 │   │   ├── components/
 │   │   ├── services/
 │   │   ├── models/
 │   │   ├── app.module.ts
 │   │   ├── app.component.ts
 │   │   ├── app-routing.module.ts
 │   ├── assets/
 │   ├── environments/
 │   ├── index.html
 │   ├── main.ts
 ├── angular.json
 ├── package.json
 ├── db.json  <-- JSON Server Fake API Data
 ├── README.md
```

---

## 📚 Further Help  

To get more help on Angular CLI, use:  
```sh
ng help
```
Or visit the official [Angular CLI Documentation](https://angular.io/cli).

---

## 📜 License  

This project is **free to use** under the **MIT License**.

---

### ✨ **Contributions & Support**  
If you have any suggestions or issues, feel free to open an **issue** or a **pull request**.  
Happy coding! 🚀

