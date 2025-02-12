import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import formidable from "formidable"
import fs from "fs"
import AWS from "aws-sdk"
import { errorHandler } from "@/middleware/errorHandler"
import { UnauthorizedError } from "@/utils/errors"

export const config = {
  api: {
    bodyParser: false,
  },
}

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req })

    if (!session) {
      throw new UnauthorizedError()
    }

    if (req.method === "POST") {
      const form = new formidable.IncomingForm()

      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error("Error parsing form:", err)
          return res.status(500).json({ error: "Error parsing form" })
        }

        const file = files.file as formidable.File
        if (!file) {
          return res.status(400).json({ error: "No file uploaded" })
        }

        try {
          const fileContent = fs.readFileSync(file.filepath)
          const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: `uploads/${session.user.id}/${file.originalFilename}`,
            Body: fileContent,
            ContentType: file.mimetype!,
          }

          const uploadResult = await s3.upload(params).promise()

          return res.status(200).json({ url: uploadResult.Location })
        } catch (error) {
          console.error("Error uploading file:", error)
          return res.status(500).json({ error: "Error uploading file" })
        }
      })
    } else {
      res.setHeader("Allow", ["POST"])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    errorHandler(error, req, res, () => {})
  }
}

