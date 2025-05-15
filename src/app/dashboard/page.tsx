// src/app/dashboard/page.tsx
"use client";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import TodoList from "../../components/dashboard/TodoList";
import AuthGuard from "../../components/auth/AuthGuard";

export default function DashboardPage() {
  return (
    <AuthGuard>
    <main>
      <DashboardHeader />
      <TodoList showOnlyPinned={true}/>
    </main>
    </AuthGuard>
  );
}
