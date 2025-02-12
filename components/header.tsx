"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          ConnectPlus
        </Link>
        <nav>
          {session ? (
            <>
              <span className="mr-4">Welcome, {session.user?.name}</span>
              <Button onClick={() => signOut()}>Logout</Button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="mr-4">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

