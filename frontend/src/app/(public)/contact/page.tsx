"use client";

import { useState } from "react";

import api from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function ContactPage() {

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState<
    "idle" |
    "loading" |
    "success" |
    "error"
  >("idle");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    // Prevent double submit
    if (status === "loading") return;

    setStatus("loading");

    try {

      await api.post(
        "/leads",
        formData
      );

      setStatus("success");

      setFormData({
        full_name: "",
        email: "",
        message: "",
      });

    } catch (error) {

      console.error(
        "Submission error:",
        error
      );

      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] selection:bg-neutral-200">

      <main className="mx-auto flex max-w-7xl flex-col gap-20 px-6 pb-24 pt-32 lg:flex-row">

        {/* LEFT SIDE */}
        <div className="space-y-8 lg:w-1/3">

          <header className="space-y-4">

            <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-neutral-400">
              03 // Connection_Point
            </h2>

            <h1 className="font-serif text-6xl font-bold tracking-tighter text-[#050505]">
              Get in Touch.
            </h1>

          </header>

          <div className="space-y-6 font-serif text-lg leading-relaxed text-neutral-600">

            <p>
              Available for collaborations on ML projects,
              system architecture, or research assignments.
            </p>

            <div className="space-y-2 pt-6 font-mono text-[11px] uppercase tracking-widest text-[#050505]">

              <p className="text-neutral-400">
                Location
              </p>

              <p>
                Remote / Global
              </p>

            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:w-2/3">

          {status === "success" ? (

            <div
              className="
                animate-in
                fade-in
                slide-in-from-bottom-2
                flex
                h-100
                flex-col
                items-center
                justify-center
                space-y-4
                border
                border-neutral-300
                bg-white
              "
            >

              <CheckCircle2 className="h-12 w-12 text-green-500" />

              <p className="font-mono text-xs uppercase tracking-widest">
                Message_Received_Successfully
              </p>

              <Button
                variant="outline"
                className="rounded-none font-mono text-[10px] uppercase tracking-widest"
                onClick={() => setStatus("idle")}
              >
                Send Another
              </Button>

            </div>

          ) : (

            <form
              onSubmit={handleSubmit}
              className="space-y-px border border-neutral-300 bg-neutral-300"
            >

              <div className="space-y-8 bg-white p-8">

                {/* NAME */}
                <div className="space-y-2">

                  <label className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                    Full Name
                  </label>

                  <Input
                    required
                    placeholder="John Doe"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        full_name: e.target.value,
                      }))
                    }
                    className="
                      rounded-none
                      border-none
                      px-0
                      font-serif
                      text-xl
                      placeholder:text-neutral-200
                      focus-visible:ring-0
                    "
                  />

                </div>

                {/* EMAIL */}
                <div className="space-y-2 border-t border-neutral-100 pt-8">

                  <label className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                    Email Address
                  </label>

                  <Input
                    required
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="
                      rounded-none
                      border-none
                      px-0
                      font-serif
                      text-xl
                      placeholder:text-neutral-200
                      focus-visible:ring-0
                    "
                  />

                </div>

                {/* MESSAGE */}
                <div className="space-y-2 border-t border-neutral-100 pt-8">

                  <label className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                    Your Message
                  </label>

                  <Textarea
                    required
                    placeholder="Tell me about your project..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    className="
                      min-h-37.5
                      resize-none
                      rounded-none
                      border-none
                      px-0
                      font-serif
                      text-xl
                      placeholder:text-neutral-200
                      focus-visible:ring-0
                    "
                  />

                </div>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-3
                  bg-[#050505]
                  py-6
                  font-mono
                  text-[11px]
                  uppercase
                  tracking-[0.3em]
                  text-white
                  transition-colors
                  hover:bg-neutral-800
                  disabled:bg-neutral-400
                "
              >

                {status === "loading" ? (
                  <>
                    <Send className="h-4 w-4 animate-pulse" />
                    Transmitting...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="h-4 w-4" />
                  </>
                )}

              </button>
            </form>
          )}

          {/* ERROR */}
          {status === "error" && (

            <div className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase text-red-500">

              <AlertCircle className="h-4 w-4" />

              Error_during_transmission.
              Try_again.

            </div>
          )}
        </div>
      </main>
    </div>
  );
}