import { getAllGuestsForLogin } from "@/lib/guests";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const guests = await getAllGuestsForLogin();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Log in to RSVP
        </h1>
        <p className="text-sm text-slate-600">
          Choose your name and enter the password from your invite.
        </p>
      </div>
      <LoginForm guests={guests} />
    </div>
  );
}

