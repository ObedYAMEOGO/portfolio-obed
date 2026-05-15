"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import api from "@/lib/api";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      // Appel à ton endpoint POST /api/v1/leads
      await api.post("/leads", formData);
      setStatus("success");
      setFormData({ full_name: "", email: "", message: "" });
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] selection:bg-neutral-200">

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24 flex flex-col lg:flex-row gap-20">
        {/* LEFT SIDE - Info */}
        <div className="lg:w-1/3 space-y-8">
          <header className="space-y-4">
            <h2 className="text-[10px] font-mono text-neutral-400 uppercase tracking-[0.4em]">
              03 // Connection_Point
            </h2>
            <h1 className="text-6xl font-bold tracking-tighter text-[#050505] font-serif">
              Get in Touch.
            </h1>
          </header>
          
          <div className="space-y-6 font-serif text-lg text-neutral-600 leading-relaxed">
            <p>
              Available for collaborations on ML projects, system architecture, or research assignments.
            </p>
            <div className="pt-6 space-y-2 font-mono text-[11px] uppercase tracking-widest text-[#050505]">
              <p className="text-neutral-400">Location</p>
              <p>Remote / Global</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Form */}
        <div className="lg:w-2/3">
          {status === "success" ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="h-100 flex flex-col items-center justify-center border border-neutral-300 bg-white space-y-4"
            >
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <p className="font-mono text-xs uppercase tracking-widest">Message_Received_Successfully</p>
              <Button 
                variant="outline" 
                className="rounded-none font-mono text-[10px] uppercase tracking-widest"
                onClick={() => setStatus("idle")}
              >
                Send Another
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-px bg-neutral-300 border border-neutral-300">
              <div className="bg-white p-8 space-y-8">
                {/* NAME */}
                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">Full Name</label>
                  <Input
                    required
                    className="rounded-none border-none px-0 text-xl font-serif focus-visible:ring-0 placeholder:text-neutral-200"
                    placeholder="John Doe"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  />
                </div>

                {/* EMAIL */}
                <div className="space-y-2 border-t border-neutral-100 pt-8">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">Email Address</label>
                  <Input
                    required
                    type="email"
                    className="rounded-none border-none px-0 text-xl font-serif focus-visible:ring-0 placeholder:text-neutral-200"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                {/* MESSAGE */}
                <div className="space-y-2 border-t border-neutral-100 pt-8">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">Your Message</label>
                  <Textarea
                    required
                    className="rounded-none border-none px-0 text-xl font-serif focus-visible:ring-0 min-h-37.5 placeholder:text-neutral-200 resize-none"
                    placeholder="Tell me about your project..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-[#050505] text-white py-6 font-mono text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-neutral-800 transition-colors disabled:bg-neutral-400"
              >
                {status === "loading" ? "Transmitting..." : (
                  <>
                    Send Message <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {status === "error" && (
            <div className="mt-4 flex items-center gap-2 text-red-500 font-mono text-[10px] uppercase">
              <AlertCircle className="h-4 w-4" /> Error_during_transmission. Try_again.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}