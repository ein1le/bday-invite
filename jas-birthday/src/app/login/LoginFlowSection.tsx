"use client";

import { useState } from "react";
import { PageSection } from "@/components/PageSection";
import { CircleCardPage } from "@/components/CircleCardPage";
import LoginForm from "./LoginForm";
import LoginRsvpPrompt from "./LoginRsvpPrompt";

type LoginFlowSectionProps = {
  guests: {
    username: string;
    displayName: string;
  }[];
};

export default function LoginFlowSection({ guests }: LoginFlowSectionProps) {
  const [stage, setStage] = useState<"login" | "question">("login");

  if (stage === "login") {
    return (
      <CircleCardPage>
        <PageSection
          title="Log in to RSVP"
          description="Choose your name and enter the password from your invite."
        >
          <LoginForm
            guests={guests}
            onSuccess={() => setStage("question")}
          />
        </PageSection>
      </CircleCardPage>
    );
  }

  return (
    <CircleCardPage>
      <PageSection title="Will you be attending">
        <LoginRsvpPrompt />
      </PageSection>
    </CircleCardPage>
  );
}
