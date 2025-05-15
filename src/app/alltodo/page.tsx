"use client";

import TodoList from "../../components/dashboard/TodoList";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import AuthGuard from "../../components/auth/AuthGuard";

export default function AllTodosPage() {
  return (
    <AuthGuard>
    <main>
       <DashboardHeader />
      <TodoList showOnlyPinned={false}/>
    </main>
    </AuthGuard>
  );
}



