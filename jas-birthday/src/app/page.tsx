import { getAllGuestsForLogin } from "@/lib/guests";
import LandingExperience from "./LandingExperience";

export const dynamic = "force-dynamic";

export default async function Home() {
  const guests = await getAllGuestsForLogin();

  return <LandingExperience guests={guests} />;
}

