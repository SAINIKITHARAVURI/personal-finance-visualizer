"use client";

import TransactionForm from "@/components/ui/TransactionForm";


export default function Home() {
  return (
    <main className="min-h-screen p-6 bg-white">
      <h1 className="text-3xl font-bold text-center mb-6">Personal Finance Tracker</h1>
      <TransactionForm />
    </main>
  );
}
