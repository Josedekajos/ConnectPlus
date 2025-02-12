import config from "@/config"
import { cache } from "@/utils/cache"

export const getNewsFeed = cache(async () => {
  const response = await fetch(`${config.apiUrl}/news-feed`)
  if (!response.ok) {
    throw new Error("Failed to fetch news feed")
  }
  return response.json()
})

