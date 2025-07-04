"use client";


import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Transaction } from "@/lib/models/transaction";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = ["Food", "Rent", "Transport", "Shopping", "Utilities", "Other"];
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F", "#FF69B4"];

export default function TransactionForm() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryBudgets, setCategoryBudgets] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("/api/transactions");
        const data = await res.json();
        setTransactions(data.data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchTransactions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !date || !description || !category) {
      alert("All fields are required!");
      return;
    }

    const newTransaction = {
      amount: parseFloat(amount),
      date,
      description,
      category,
    };

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransaction),
      });
      const data = await res.json();
      if (res.ok) {
        setTransactions([data.data, ...transactions]);
        setAmount("");
        setDate("");
        setDescription("");
        setCategory("");
      } else {
        alert("Failed to add transaction");
      }
    } catch (err) {
      console.error("API error:", err);
      alert("Something went wrong");
    }
  };

  const handleDelete = (id: string) => {
    const updated = transactions.filter((tx) => tx._id !== id);
    setTransactions(updated);
    if (editingId === id) setEditingId(null);
  };

  const handleEdit = (tx: Transaction) => {
  setEditingId(tx._id);
  setAmount(tx.amount.toString());
  setDate(tx.date);
  setDescription(tx.description);
  setCategory(tx.category);
};


  const monthlyData = useMemo(() => {
    const monthlyTotals: Record<string, number> = {};
    transactions.forEach((tx) => {
      const month = new Date(tx.date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      monthlyTotals[month] = (monthlyTotals[month] || 0) + tx.amount;
    });
    return Object.entries(monthlyTotals).map(([month, total]) => ({ month, total }));
  }, [transactions]);

  const categoryData = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    transactions.forEach((tx) => {
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
    });
    return Object.entries(categoryTotals).map(([category, total]) => ({ category, total }));
  }, [transactions]);

  const totalSpent = useMemo(
    () => transactions.reduce((sum, tx) => sum + tx.amount, 0),
    [transactions]
  );

  const mostRecent = transactions.length > 0 ? transactions[0] : null;

  const budgetComparisonData = categories.map((cat) => {
    const actual = transactions
      .filter((tx) => tx.category === cat)
      .reduce((sum, tx) => sum + tx.amount, 0);
    return {
      category: cat,
      budget: categoryBudgets[cat] ?? 0,
      actual,
    };
  });

  return (
    <div className="max-w-md w-full mx-auto space-y-6">
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Amount</Label>
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div>
          <Label>Date</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <Label>Description</Label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">{editingId ? "Update Transaction" : "Add Transaction"}</Button>
      </form>

      {/* Budgets */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Set Monthly Budgets</h2>
        {categories.map((cat) => (
          <div key={cat} className="flex items-center gap-2 mb-2">
            <Label className="w-24">{cat}</Label>
            <Input
              type="number"
              value={categoryBudgets[cat] ?? ""}
              onChange={(e) =>
                setCategoryBudgets({
                  ...categoryBudgets,
                  [cat]: parseFloat(e.target.value || "0"),
                })
              }
              placeholder="₹ Budget"
            />
          </div>
        ))}
      </div>

      {/* Summary + Charts + Insights */}
      {transactions.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 mt-8">
            <div className="p-4 border rounded shadow">
              <h3 className="text-sm text-muted-foreground">Total Spent</h3>
              <p className="text-lg font-bold">₹{totalSpent.toFixed(2)}</p>
            </div>
            {mostRecent && (
              <div className="p-4 border rounded shadow">
                <h3 className="text-sm text-muted-foreground">Most Recent</h3>
                <p>{mostRecent.description} - ₹{mostRecent.amount} on {mostRecent.date}</p>
              </div>
            )}
          </div>

          <h2 className="text-xl font-semibold mt-6 mb-2">Transactions</h2>
          <ul className="space-y-2">
            {transactions.map((tx) => (
              <li key={tx._id} className="border p-3 rounded flex justify-between items-center">
                <div>
                  <strong>₹{tx.amount}</strong> - {tx.description} on {tx.date} <br />
                  <span className="text-sm text-muted-foreground">Category: {tx.category}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => handleEdit(tx)}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(tx._id)}>Delete</Button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-2">Monthly Expenses</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-2">Category-wise Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-2">Budget vs Actual</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={budgetComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="budget" fill="#8884d8" name="Budget" />
                <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 space-y-2 text-sm">
            <p><strong>Overspent Categories:</strong> {budgetComparisonData.filter((d) => d.actual > d.budget).map((d) => d.category).join(", ") || "None"}</p>
            <p><strong>Under Budget:</strong> {budgetComparisonData.filter((d) => d.actual <= d.budget).map((d) => d.category).join(", ") || "None"}</p>
          </div>
        </>
      )}
    </div>
  );
}
