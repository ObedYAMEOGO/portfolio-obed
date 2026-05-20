"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  Loader2,
  Plus,
} from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import { projectApi } from "@/lib/api";

/* =========================================================
   TYPES
========================================================= */

interface ProjectFormData {
  title: string;
  description: string;
  image_url: string;
  github_url: string;
  live_url: string;
  tech_stack: string;
}

/* =========================================================
   INITIAL STATE
========================================================= */

const initialFormData: ProjectFormData =
  {
    title: "",
    description: "",
    image_url: "",
    github_url: "",
    live_url: "",
    tech_stack: "",
  };

/* =========================================================
   COMPONENT
========================================================= */

export default function CreateProjectForm() {
  const router =
    useRouter();

  const [mounted, setMounted] =
    useState(false);

  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState<ProjectFormData>(
      initialFormData,
    );

  /* =========================================================
     FIX HYDRATION
  ========================================================= */

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  /* =========================================================
     INPUT CHANGE
  ========================================================= */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit =
    async (
      e: React.FormEvent<HTMLFormElement>,
    ) => {
      e.preventDefault();

      if (loading) return;

      if (
        !formData.title ||
        !formData.description
      ) {
        toast.error(
          "Title and description are required.",
        );

        return;
      }

      try {
        setLoading(true);

        const payload = {
          title:
            formData.title,

          slug:
            formData.title
              .toLowerCase()
              .trim()
              .replace(
                /[^a-z0-9]+/g,
                "-",
              )
              .replace(
                /(^-|-$)/g,
                "",
              ),

          description:
            formData.description ||
            null,

          content:
            formData.description ||
            null,

          tech_stack:
            formData.tech_stack
              .split(",")
              .map((tech) =>
                tech.trim(),
              )
              .filter(Boolean),

          github_url:
            formData.github_url ||
            null,

          live_url:
            formData.live_url ||
            null,

          image_url:
            formData.image_url ||
            null,

          is_published: true,
        };

        await projectApi.create(
          payload,
        );

        toast.success(
          "Project successfully deployed.",
        );

        setFormData(
          initialFormData,
        );

        setOpen(false);

        router.refresh();
      } catch (
        error: unknown
      ) {
        console.error(
          "CREATE_PROJECT_ERROR:",
          error,
        );

        const message =
          error instanceof Error
            ? error.message
            : "Failed to create project.";

        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >

      {/* =========================================================
          TRIGGER
      ========================================================= */}

      <DialogTrigger asChild>

        <Button className="h-11 rounded-none border border-black bg-black px-6 font-mono text-[10px] uppercase tracking-[0.2em] text-white hover:bg-neutral-800">

          <Plus className="mr-2 h-4 w-4" />

          New Project

        </Button>

      </DialogTrigger>

      {/* =========================================================
          MODAL
      ========================================================= */}

      <DialogContent className="max-w-2xl border-neutral-300 bg-[#f5f5f5]">

        <DialogHeader>

          <DialogTitle className="font-mono text-lg uppercase tracking-widest">

            Create_Project

          </DialogTitle>

        </DialogHeader>

        {/* =========================================================
            FORM
        ========================================================= */}

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-6"
        >

          {/* TITLE */}

          <div className="space-y-2">

            <Label htmlFor="title">
              Project Title
            </Label>

            <Input
              id="title"
              name="title"
              value={
                formData.title
              }
              onChange={
                handleChange
              }
              placeholder="AI Portfolio Platform"
              required
              disabled={loading}
            />

          </div>

          {/* DESCRIPTION */}

          <div className="space-y-2">

            <Label htmlFor="description">

              Description

            </Label>

            <Textarea
              id="description"
              name="description"
              value={
                formData.description
              }
              onChange={
                handleChange
              }
              rows={5}
              placeholder="Describe the project..."
              required
              disabled={loading}
            />

          </div>

          {/* LINKS */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div className="space-y-2">

              <Label htmlFor="github_url">

                GitHub URL

              </Label>

              <Input
                id="github_url"
                name="github_url"
                type="url"
                value={
                  formData.github_url
                }
                onChange={
                  handleChange
                }
                placeholder="https://github.com/..."
                disabled={loading}
              />

            </div>

            <div className="space-y-2">

              <Label htmlFor="live_url">

                Live URL

              </Label>

              <Input
                id="live_url"
                name="live_url"
                type="url"
                value={
                  formData.live_url
                }
                onChange={
                  handleChange
                }
                placeholder="https://..."
                disabled={loading}
              />

            </div>

          </div>

          {/* TECH STACK */}

          <div className="space-y-2">

            <Label htmlFor="tech_stack">

              Tech Stack

            </Label>

            <Input
              id="tech_stack"
              name="tech_stack"
              placeholder="Next.js, FastAPI, PostgreSQL"
              value={
                formData.tech_stack
              }
              onChange={
                handleChange
              }
              disabled={loading}
            />

          </div>

          {/* SUBMIT */}

          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-none bg-black font-mono text-[10px] uppercase tracking-[0.2em] text-white hover:bg-neutral-800"
          >

            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deploying...
              </>
            ) : (
              "Create Project"
            )}

          </Button>

        </form>

      </DialogContent>

    </Dialog>
  );
}