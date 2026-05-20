"use client";

import { useEffect, useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { Loader2, Pencil } from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import { projectsApi } from "@/lib/api/projects";

import type { Project } from "@/types";

interface Props {
  project: Project;
}

interface FormData {
  title: string;
  description: string;
  image_url: string;
  github_url: string;
  live_url: string;
  tech_stack: string;
  is_published: boolean;
}

export default function EditProjectForm({ project }: Props) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState<FormData>({
    title: project.title || "",
    description: project.description || "",
    image_url: project.image_url || "",
    github_url: project.github_url || "",
    live_url: project.live_url || "",
    tech_stack: Array.isArray(project.tech_stack)
      ? project.tech_stack.join(", ")
      : "",
    is_published: project.is_published ?? true,
  });

  useEffect(() => {
    setFormData({
      title: project.title || "",
      description: project.description || "",
      image_url: project.image_url || "",
      github_url: project.github_url || "",
      live_url: project.live_url || "",
      tech_stack: Array.isArray(project.tech_stack)
        ? project.tech_stack.join(", ")
        : "",
      is_published: project.is_published ?? true,
    });
  }, [project]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        await projectsApi.update(project.id, {
          title: formData.title,

          slug: formData.title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),

          description: formData.description,

          image_url: formData.image_url || undefined,

          github_url: formData.github_url || undefined,

          live_url: formData.live_url || undefined,

          tech_stack: formData.tech_stack
            .split(",")
            .map((tech) => tech.trim())
            .filter(Boolean),

          is_published: formData.is_published,
        });
        toast.success("Project updated successfully.");

        router.push("/admin/dashboard");

        router.refresh();
      } catch (error) {
        console.error(error);

        toast.error("Failed to update project.");
      }
    });
  };

  return (
    <div className="border border-neutral-200 bg-white p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Pencil className="h-5 w-5" />

          <h2 className="font-mono text-xl font-bold uppercase tracking-tight">
            Update_Project
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TITLE */}

        <div className="space-y-2">
          <Label>Title</Label>

          <Input name="title" value={formData.title} onChange={handleChange} />
        </div>

        {/* DESCRIPTION */}

        <div className="space-y-2">
          <Label>Description</Label>

          <Textarea
            name="description"
            rows={6}
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* URLS */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>GitHub URL</Label>

            <Input
              name="github_url"
              value={formData.github_url}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Live URL</Label>

            <Input
              name="live_url"
              value={formData.live_url}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* IMAGE */}

        <div className="space-y-2">
          <Label>Image URL</Label>

          <Input
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
          />
        </div>

        {/* TECH STACK */}

        <div className="space-y-2">
          <Label>Tech Stack</Label>

          <Input
            name="tech_stack"
            value={formData.tech_stack}
            onChange={handleChange}
            placeholder="Next.js, FastAPI, PostgreSQL"
          />
        </div>

        {/* SUBMIT */}

        <Button
          type="submit"
          disabled={isPending}
          className="h-11 w-full rounded-none bg-black font-mono text-[10px] uppercase tracking-[0.2em] text-white hover:bg-neutral-800"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Project"
          )}
        </Button>
      </form>
    </div>
  );
}
