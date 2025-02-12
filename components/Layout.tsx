import type React from "react"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar className="hidden md:block w-64 flex-shrink-0" />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

