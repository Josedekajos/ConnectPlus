import type { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import { PrismaClient } from "@prisma/client"
import { NewsFeed } from "@/components/NewsFeed"

const prisma = new PrismaClient()

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    }
  }

  const posts = await prisma.post.findMany({
    where: {
      OR: [{ authorId: session.user.id }, { author: { friends: { some: { friendId: session.user.id } } } }],
    },
    include: {
      author: {
        select: { id: true, name: true, image: true },
      },
      likes: true,
      comments: {
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  return {
    props: {
      initialPosts: JSON.parse(JSON.stringify(posts)),
    },
  }
}

export default function Home({ initialPosts }) {
  return (
    <div>
      <h1>Welcome to ConnectPlus</h1>
      <NewsFeed initialPosts={initialPosts} />
    </div>
  )
}

