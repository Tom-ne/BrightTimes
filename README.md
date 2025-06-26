# 🌞 BrightTimes

**BrightTimes** is a web platform that helps parents easily discover and book free or low-cost online activities for children, organized by a wide range of educational and community organizations. Originally inspired by the chaos of trying to manage kids’ online schedules during times of crisis, BrightTimes brings structure, simplicity, and accessibility to children's remote enrichment.

---

## ✨ Features

* **For Parents**

  * Browse and filter upcoming activities by topic and age group
  * See detailed activity info and organizer profiles
  * Register interest or join activities directly from the platform

* **For Organizers**

  * Create and manage activities with rich descriptions, age tags, and time slots
  * Add and update organizer profiles
  * View a dashboard of past and upcoming sessions

* **Smart Filtering**

  * Topic-based categorization
  * Age-appropriate tagging
  * Custom topic creation with duplicate prevention

---

## 🛠️ Tech Stack

### Frontend

* **Next.js 14 (App Router)**
* **React** with **TypeScript**
* **Tailwind CSS** & **ShadCN UI**
* Fully modular component structure

### Backend

* **Python Flask** API
* REST endpoints for activities, topics, organizers, and registration
* Hosted locally or deployable to cloud platforms

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18+)
* Python 3.10+
* A virtual environment tool (e.g., `venv` or `pipenv`)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/BrightTimes.git
cd BrightTimes
```

### 2. Create the .env file for the backend
This file should have 2 variables
```ENV
SECRET_KEY=<your secret key>
ALGORITHM=<algorithm for encryption>
```

### 3. Start the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py
```

The backend will run at `http://localhost:5000`.

### 4. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at `http://localhost:3000`.

---

## 📁 Project Structure

```
BrightTimes/
├── backend/
│   └── app.py (Flask app)
├── frontend/
│   └── app/ (Next.js App Router)
│       ├── add-activity/
│       ├── edit-activity/
│       └── profile/
└── README.md
```

---

## 👥 Contributing

This is a personal project, but PRs are welcome! If you’re interested in contributing to BrightTimes, feel free to open an issue or reach out.

---

## 👤 Author

Built by [Tom Neumann](https://www.linkedin.com/in/tom-neumann-18876827a/) — inspired by real-world needs during challenging times.
