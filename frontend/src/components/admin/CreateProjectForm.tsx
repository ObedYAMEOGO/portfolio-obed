"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import api from "../../lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Plus } from "lucide-react";
import { toast } from "sonner";

type ProjectFormValues = {
  title: string;
  slug: string;
  description: string;
  content: string;
  tech_stack: string;
  github_url: string;
  live_url: string;
};

export default function CreateProjectForm({
  onRefresh,
}: {
  onRefresh: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset } = useForm<ProjectFormValues>();

  const onSubmit = async (data: ProjectFormValues) => {
    setIsSubmitting(true);

    try {
      const payload = {
        ...data,
        tech_stack: data.tech_stack
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        is_published: true,
      };

      await api.post("/projects", payload);

      toast.success("Project Published", {
        description: "Entry successfully registered.",
      });

      setOpen(false);
      reset();
      onRefresh();
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.detail
        : "Submission failed";

      toast.error("Error", {
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* TRIGGER */}
      <DialogTrigger asChild>
        <Button
          className="
            h-11
                rounded-none
                border
                border-[#050505]
                bg-[#050505]
                px-6
                font-mono
                text-[10px]
                uppercase
                tracking-[0.18em]
                text-[#f5f5f5]
                transition-all
                duration-300
                hover:border-neutral-800
                hover:bg-neutral-800
                active:scale-[0.98]
          "
        >
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </DialogTrigger>

      {/* DIALOG */}
      <DialogContent
        className="
          border
          border-neutral-300
          bg-[#f5f5f5]
          shadow-2xl
          sm:max-w-140
        "
      >
        <DialogHeader className="space-y-2 border-b border-neutral-200 pb-5">
          <DialogTitle
            className="
              font-serif
              text-3xl
              font-semibold
              tracking-[-0.03em]
              text-[#050505]
            "
          >
            Create Project
          </DialogTitle>

          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-500">
            Publish a new portfolio entry.
          </p>
        </DialogHeader>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-5">
          <div className="space-y-4">
            {/* TITLE + SLUG */}
            <div className="grid grid-cols-1 gap-4">
              <Input
                {...register("title")}
                placeholder="Project Title"
                className="
                  h-11
                  border-neutral-300
                  bg-white
                  font-mono
                  text-sm
                  text-[#050505]
                  placeholder:text-neutral-400
                  focus-visible:ring-0
                  focus-visible:border-[#050505]
                "
              />

              <Input
                {...register("slug")}
                placeholder="project-slug"
                className="
                  h-11
                  border-neutral-300
                  bg-white
                  font-mono
                  text-xs
                  text-[#050505]
                  placeholder:text-neutral-400
                  focus-visible:ring-0
                  focus-visible:border-[#050505]
                "
              />
            </div>

            {/* DESCRIPTION */}
            <Textarea
              {...register("description")}
              placeholder="Short project description..."
              className="
                min-h-27.5
                resize-none
                border-neutral-300
                bg-white
                text-sm
                text-[#050505]
                placeholder:text-neutral-400
                focus-visible:ring-0
                focus-visible:border-[#050505]
              "
            />

            {/* CONTENT */}
            <Textarea
              {...register("content")}
              placeholder="Detailed markdown content..."
              className="
                min-h-45
                border-neutral-300
                bg-white
                text-sm
                text-[#050505]
                placeholder:text-neutral-400
                focus-visible:ring-0
                focus-visible:border-[#050505]
              "
            />

            {/* TECH STACK */}
            <Input
              {...register("tech_stack")}
              placeholder="React, Python, Docker, AWS..."
              className="
                h-11
                border-neutral-300
                bg-white
                text-sm
                text-[#050505]
                placeholder:text-neutral-400
                focus-visible:ring-0
                focus-visible:border-[#050505]
              "
            />

            {/* URLS */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                {...register("github_url")}
                placeholder="GitHub URL"
                className="
                  h-11
                  border-neutral-300
                  bg-white
                  text-sm
                  text-[#050505]
                  placeholder:text-neutral-400
                  focus-visible:ring-0
                  focus-visible:border-[#050505]
                "
              />

              <Input
                {...register("live_url")}
                placeholder="Live Demo URL"
                className="
                  h-11
                  border-neutral-300
                  bg-white
                  text-sm
                  text-[#050505]
                  placeholder:text-neutral-400
                  focus-visible:ring-0
                  focus-visible:border-[#050505]
                "
              />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 border-t border-neutral-200 pt-5">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="
                flex-1
                rounded-none
                border
                border-neutral-300
                bg-white
                font-mono
                text-[11px]
                uppercase
                tracking-[0.18em]
                text-neutral-500
                transition-colors
                hover:bg-neutral-100
                hover:text-[#050505]
              "
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="
                flex-1
                rounded-none
                bg-[#050505]
                font-mono
                text-[11px]
                uppercase
                tracking-[0.18em]
                text-[#f5f5f5]
                transition-all
                hover:bg-neutral-800
              "
            >
              {isSubmitting ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
