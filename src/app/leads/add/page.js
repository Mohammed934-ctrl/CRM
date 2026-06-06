"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  PhoneNumber: z.string().min(10, "Please enter a valid 10 phone number"),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  notes: z.string().optional(),
  source: z.string().optional(),
});

const SOURCES = [
  "Website",
  "Referral",
  "LinkedIn",
  "Cold Outreach",
  "Event",
  "other",
];

export default function AddLeadPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      PhoneNumber: "",
      company: "",
      source: "",
      notes: "",
    },
  });

  async function onSubmit(data) {
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, PhoneNumber: `+91${data.PhoneNumber}`, status: "New" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      toast.success(json.message || `Lead "${data.name}" added successfully!`);
      router.push("/leads");
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="p-4 sm:p-6 w-full">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold">Add New Lead</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Fill in the details below to add a new lead
        </p>
      </div>

      <div className="bg-card border border-border/60 dark:border-border rounded-lg p-4 sm:p-6 w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g. Joan Kumar"
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
                Email Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="rahul@company.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
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
              <Label>Source</Label>
              <Select onValueChange={(val) => setValue("source", val)}>
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

            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any relevant notes about this lead…"
                className="min-h-[100px] resize-none"
                {...register("notes")}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-border pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {isSubmitting ? "Saving..." : "Save Lead"}
            </Button>
            <Button type="button" variant="outline" onClick={() => reset()}>
              Reset
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
