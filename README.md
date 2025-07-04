# 💰 Personal Finance Visualizer

A full-stack web application that helps users track daily expenses, organize transactions by category, and visualize monthly budgets using interactive charts.

---

## 🚀 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS  
- **UI Library**: Shadcn/UI  
- **Charts**: Recharts  
- **Backend**: Next.js API routes  
- **Database**: MongoDB Atlas  
- **ORM**: Mongoose  

---

## 🧩 Features

- ✅ Add, edit, and delete transactions  
- 📅 Filter by month  
- 📊 Monthly expenses bar chart  
- 💸 Set monthly budgets for each category  
- 🧠 Insights on spending vs budget  
- 🔐 Secure access using environment variables  

---

## 🛠️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/SAINIKITHARAVURI/personal-finance-visualizer.git
cd personal-finance-visualizer



2. Install dependencies
Using npm: npm install

3. Set up environment variables
Create a .env.local file in the root directory and add the following:

MONGODB_URI=your_mongodb_connection_string
🔒 Replace your_mongodb_connection_string with your actual MongoDB Atlas URI.
💡 Ensure your IP address is whitelisted in MongoDB Atlas.

4. Run the development server
npm run dev

Now visit http://localhost:3000 in your browser to view the app.

🌐 Deployment
This app is deployed on Vercel.

🔗 Live Site: https://personal-finance-visualizer-six-mu.vercel.app

