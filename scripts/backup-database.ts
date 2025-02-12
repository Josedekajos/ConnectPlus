import { exec } from "child_process"
import { promisify } from "util"
import fs from "fs"
import path from "path"
import logger from "@/lib/logger"

const execAsync = promisify(exec)

async function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
  const backupDir = path.join(__dirname, "../backups")
  const backupFile = path.join(backupDir, `backup-${timestamp}.sql`)

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir)
  }

  try {
    await execAsync(`pg_dump ${process.env.DATABASE_URL} > ${backupFile}`)
    logger.info({ backupFile }, "Database backup created successfully")
  } catch (error) {
    logger.error({ error }, "Error creating database backup")
  }
}

backupDatabase()

