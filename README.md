# 💰 Personal Finance Tracker & Bill Splitter API

A robust backend REST API built with **Spring Boot** for managing personal finances, tracking wallets, and splitting bills among friends (similar to Splitwise).

## 🚀 Features

### 🔐 User Management
- **JWT Authentication:** Secure Signup & Login.
- **Role-Based Access:** Standard users and Admin capabilities.

### 💸 Finance Management
- **Wallet System:** Create multiple wallets (Cash, Bank, Credit Cards).
- **Categories:** Manage expense categories (Food, Travel, etc.).
- **Transactions:** Record Income, Expenses, and Transfers with auto-wallet balance updates.

### 👥 Group & Splitwise Features
- **Groups:** Create groups for trips, dorms, or office outings.
- **Bill Splitting:** Automatically split transaction amounts equally among selected group members.
- **Expense Tracking:** View who owes whom within the group.

## 🛠️ Tech Stack

- **Language:** Java 17+
- **Framework:** Spring Boot 3
- **Database:** MySQL
- **Security:** Spring Security & JWT
- **Build Tool:** Maven

## ⚙️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tracker.git
   cd tracker
   ```

2. **Configure Database**
   - Update `application.properties` with your MySQL credentials

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

## 🔌 API Endpoints

### 🔐 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login & Get Token |

### 💼 Wallets

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wallets` | Get all wallets |
| POST | `/api/wallets` | Create a new wallet |

### 🏷️ Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| POST | `/api/categories` | Create a new category |

### 👥 Groups

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/groups` | Get all groups |
| POST | `/api/groups` | Create a new group |

### 💸 Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Get all transactions |
| POST | `/api/transactions` | Create a transaction (Personal or Group Split) |

## 🔮 Future Plans

- [ ] AI-Powered Spending Predictions
- [ ] Monthly Budget Alerts

---

Made with ❤️ by Pubudu Bandara