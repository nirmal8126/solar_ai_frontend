"use client";

import { Home, Bot, Users, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-xl p-6 flex flex-col">
      <h2 className="text-3xl font-bold text-blue-600 mb-10">Solar AI</h2>

      <nav className="flex flex-col gap-6">
        <a href="/dashboard" className="flex items-center gap-3 text-lg hover:text-blue-600">
          <Home size={20} />
          Leads
        </a>

        <a href="/dashboard/ai" className="flex items-center gap-3 text-lg hover:text-blue-600">
          <Bot size={20} />
          AI Assistant
        </a>

        <a href="/dashboard/users" className="flex items-center gap-3 text-lg hover:text-blue-600">
          <Users size={20} />
          Customers
        </a>

        <a href="/dashboard/settings" className="flex items-center gap-3 text-lg hover:text-blue-600">
          <Settings size={20} />
          Settings
        </a>
      </nav>
    </aside>
  );
}
