"use client";

import TodoList from "../../components/dashboard/TodoList";
import DashboardHeader from "../../components/dashboard/DashboardHeader";

export default function AllTodosPage() {
  return (
    <main>
       <DashboardHeader />
      <TodoList showOnlyPinned={false}/>
    </main>
  );
}



