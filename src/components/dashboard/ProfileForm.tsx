"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, MapPin, Phone, User } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { PremiumInput } from "@/components/ui/PremiumInput";
import { profileSchema, type ProfileInput } from "@/lib/validations";

export function ProfileForm({
  initialValues,
}: {
  initialValues: ProfileInput;
}) {
  const [serverState, setServerState] = React.useState<string | null>(null);
  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialValues,
  });

  return (
    <form
      className="space-y-5"
      onSubmit={form.handleSubmit(async (values) => {
        setServerState(null);
        const response = await fetch("/api/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        setServerState(response.ok ? "Profile updated." : "Could not update profile.");
      })}
    >
      <PremiumInput
        label="Full Name"
        icon={User}
        placeholder="Aarav Sharma"
        error={form.formState.errors.fullName?.message}
        {...form.register("fullName")}
      />
      <PremiumInput
        label="College Name"
        icon={Building2}
        placeholder="Delhi University"
        error={form.formState.errors.collegeName?.message}
        {...form.register("collegeName")}
      />
      <PremiumInput
        label="Phone Number"
        icon={Phone}
        placeholder="98765 43210"
        prefix="+91"
        error={form.formState.errors.phoneNumber?.message}
        {...form.register("phoneNumber")}
      />
      <PremiumInput
        label="City"
        icon={MapPin}
        placeholder="Bangalore"
        error={form.formState.errors.city?.message}
        {...form.register("city")}
      />
      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-[0.4em] text-[#8A8478]">Bio</label>
        <textarea
          className="min-h-28 w-full rounded-md border border-[rgba(255,248,235,0.1)] bg-[rgba(255,248,235,0.04)] px-4 py-3 text-sm text-[#F5F0E8] outline-none"
          placeholder="Tell your community what you're into."
          {...form.register("bio")}
        />
        {form.formState.errors.bio ? (
          <p className="text-xs text-[#FF4D4D]">{form.formState.errors.bio.message}</p>
        ) : null}
      </div>

      {serverState ? <p className="text-sm text-[#C9A96E]">{serverState}</p> : null}
      <PremiumButton type="submit" loading={form.formState.isSubmitting} loadingLabel="SAVING CHANGES...">
        SAVE CHANGES
      </PremiumButton>
    </form>
  );
}
