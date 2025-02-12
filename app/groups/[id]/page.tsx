import { Suspense } from "react"
import { notFound } from "next/navigation"
import GroupHeader from "@/components/group-header"
import GroupTabs from "@/components/group-tabs"
import { getGroupById } from "@/lib/api"

export default async function GroupPage({ params }: { params: { id: string } }) {
  const group = await getGroupById(params.id)

  if (!group) {
    notFound()
  }

  return (
    <div className="container mx-auto p-6">
      <GroupHeader group={group} />
      <Suspense fallback={<div>Loading group content...</div>}>
        <GroupTabs group={group} />
      </Suspense>
    </div>
  )
}

