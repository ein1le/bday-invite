import { getAllGuestsForLogin } from "@/lib/guests";
import LoginFlowSection from "./LoginFlowSection";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const guests = await getAllGuestsForLogin();

  return <LoginFlowSection guests={guests} />;
}
