// src/app/dashboard/page.tsx
"use client";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import TodoList from "../../components/dashboard/TodoList";
import Image from "next/image";
import logoTodo from "../dashboard/todo-logo-pastel.png";

export default function DashboardPage() {
  return (
    <main>
      <DashboardHeader />
      <TodoList showOnlyPinned={true}/>
    </main>
  );
}
