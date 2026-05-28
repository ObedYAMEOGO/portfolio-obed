"use client";

import Image from "next/image";

import {
  ArrowUpRight,
  FileText,
} from "lucide-react";

import { Material } from "@/types";

interface Props {
  material: Material;
}

export default function CourseCard({
  material,
}: Props) {
  return (
    <article
      className="
        group
        overflow-hidden
        rounded-2xl
        border
        border-white/20
        bg-white
        backdrop-blur-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:bg-white/30
        dark:border-white/10
        dark:bg-white/5
      "
    >

      <div
        className="
          relative
          aspect-video
          overflow-hidden
          bg-neutral-100
        "
      >

        {material.thumbnail_url ? (

          <Image
            src={
              material.thumbnail_url
            }
            alt={
              material.title
            }
            fill
            className="
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />

        ) : (

          <div
            className="
              flex
              h-full
              items-center
              justify-center
            "
          >

            <FileText
              className="
                h-8
                w-8
                text-neutral-300
              "
            />

          </div>

        )}

      </div>

      <div className="space-y-4 p-5">

        {material.category && (

          <span
            className="
              inline-flex
              rounded-full
              bg-neutral-900
              px-3
              py-1
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.12em]
              text-white
              dark:bg-white
              dark:text-black
            "
          >
            {material.category}
          </span>

        )}

        <div className="space-y-2">

          <h3
            className="
              line-clamp-2
              text-[16px]
              font-semibold
              leading-snug
              text-neutral-900
              dark:text-white
            "
          >
            {material.title}
          </h3>

          {material.description && (

            <p
              className="
                line-clamp-3
                text-sm
                leading-relaxed
                text-neutral-600
                dark:text-neutral-300
              "
            >
              {
                material.description
              }
            </p>

          )}

        </div>

        <a
          href={
            material.resource_url
          }
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            font-semibold
            text-neutral-900
            transition-opacity
            hover:opacity-70
            dark:text-white
          "
        >

          Open Course

          <ArrowUpRight
            className="
              h-4
              w-4
            "
          />

        </a>

      </div>

    </article>
  );
}