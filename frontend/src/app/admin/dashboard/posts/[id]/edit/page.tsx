import { notFound } from "next/navigation";

import EditPostForm from "@/components/admin/posts/EditPostForm";

import { getAdminPost } from "@/lib/server/posts";

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPostPage({
  params,
}: EditPostPageProps) {
  const { id } =
    await params;

  const post =
    await getAdminPost(
      Number(id),
    );

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] pt-24">
      <div className="mx-auto max-w-6xl px-6 py-12">

        <EditPostForm
          post={post}
        />

      </div>
    </div>
  );
}