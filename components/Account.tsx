// @component/Account.tsx
import { Session } from "@supabase/supabase-js";
import ProfileSettings from "./ProfileSettings";

export default function Account({ session }: { session: Session }) {
  return <ProfileSettings session={session} />;
}