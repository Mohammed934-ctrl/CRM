"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  PhoneNumber: z.string().min(10, "Please enter a valid 10 digit phone number"),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  status: z.enum(["New", "Contacted", "Qualified", "Converted", "Lost"]),
  source: z.string().optional(),
  notes: z.string().optional(),
});

const STATUSES = ["New", "Contacted", "Qualified", "Converted", "Lost"];
const SOURCES = [
  "Website",
  "Referral",
  "LinkedIn",
  "Cold Outreach",
  "Event",
  "other",
];

export default function EditLeadPage() {
  const { id } = useParams();
  const router = useRouter();
  const [lead, setLead] = useState(null);
  const [fetching, setFetching] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const statusValue = watch("status");
  const sourceValue = watch("source");

  useEffect(() => {
    async function fetchLead() {
      try {
        const res = await fetch(`/api/leads/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch lead");

        const lead = data.lead; 

        setLead(lead);
        reset({
          name: lead.name,
          PhoneNumber:
            lead.PhoneNumber?.replace("+91", "")?.replace(/\s/g, "") || "",
          company: lead.company,
          status: lead.status,
          source: lead.source || "",
          notes: lead.notes || "",
        });
      } catch (err) {
        toast.error(err.message);
        router.push("/leads");
      } finally {
        setFetching(false);
      }
    }
    fetchLead();
  }, [id, reset, router]);

  async function onSubmit(data) {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          email: lead.email,
          PhoneNumber: `+91${data.PhoneNumber}`,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update lead");
      toast.success(json.message || `"${data.name}" updated successfully!`);
      router.push(`/leads/${id}`);
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    }
  }

  if (fetching) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 w-full">
      <Link
        href={`/leads/${id}`}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Lead
      </Link>

      <div className="mb-6">
        <h1 className="text-xl font-semibold">Edit Lead</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Update details for {lead?.name}
        </p>
      </div>

      <div className="bg-card border border-zinc-300 dark:border-zinc-700 rounded-lg p-4 sm:p-6 w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g. Rahul Kumar"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">
                Email Address
                <span className="text-xs text-muted-foreground ml-2">
                  (cannot be changed)
                </span>
              </Label>
              <Input
                id="email"
                type="email"
                disabled
                value={lead?.email || ""}
                className="opacity-60 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="PhoneNumber">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm border border-r-0 border-input rounded-l-md bg-muted text-muted-foreground">
                  +91
                </span>
                <Input
                  id="PhoneNumber"
                  placeholder="98765 43210"
                  className="rounded-l-none"
                  {...register("PhoneNumber")}
                />
              </div>
              {errors.PhoneNumber && (
                <p className="text-xs text-destructive">
                  {errors.PhoneNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="company">
                Company Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="company"
                placeholder="e.g. TechCorp India"
                {...register("company")}
              />
              {errors.company && (
                <p className="text-xs text-destructive">
                  {errors.company.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>
                Lead Status <span className="text-destructive">*</span>
              </Label>
              <Select
                value={statusValue || ""}
                onValueChange={(v) =>
                  setValue("status", v, { shouldValidate: true })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-xs text-destructive">
                  {errors.status.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Source</Label>
              <Select
                value={sourceValue || ""}
                onValueChange={(v) => setValue("source", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {SOURCES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any relevant notes about this lead…"
              className="min-h-[100px] resize-none"
              {...register("notes")}
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {isSubmitting ? "Updating…" : "Update Lead"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
