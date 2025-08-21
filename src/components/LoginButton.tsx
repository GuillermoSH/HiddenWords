"use client";

import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function LoginButton() {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) console.error("Error logging in:", error.message);
  };

  return (
    <button onClick={handleLogin}>
      <Image
        src="/google-button.svg"
        alt="Iniciar sesión con Google"
        height={50}
        width={200}
      />
    </button>
  );
}
