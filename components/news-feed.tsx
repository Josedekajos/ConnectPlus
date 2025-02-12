import { getNewsFeed } from "@/lib/api"

export default async function NewsFeed() {
  const posts = await getNewsFeed()

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {posts.map((post) => (
        <div key={post.id} className="mb-6 bg-card rounded-lg shadow p-4">
          <div className="flex items-center mb-4">
            <img
              src={post.author.avatar || "/placeholder.svg"}
              alt={post.author.name}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <h3 className="font-semibold">{post.author.name}</h3>
              <p className="text-sm text-muted-foreground">{post.timestamp}</p>
            </div>
          </div>
          <p className="mb-4">{post.content}</p>
          {post.image && (
            <img src={post.image || "/placeholder.svg"} alt="Post content" className="rounded-lg mb-4 w-full" />
          )}
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{post.likes} likes</span>
            <span>{post.comments} comments</span>
            <span>{post.shares} shares</span>
          </div>
        </div>
      ))}
    </div>
  )
}

