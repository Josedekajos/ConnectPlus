import type { NextApiRequest, NextApiResponse } from "next"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      await execAsync("npm run backup-db")
      res.status(200).json({ message: "Database backup completed successfully" })
    } catch (error) {
      console.error("Error during database backup:", error)
      res.status(500).json({ error: "Failed to backup database" })
    }
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

