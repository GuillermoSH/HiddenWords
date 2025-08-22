"use client";

import Image from "next/image";
import GoogleButton from "@/components/GoogleButton";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      window.location.href = "/"; // redirigir al home
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[url('/assets/svgs/crystal-light.svg')] bg-center bg-cover px-4">
      <div className="w-full max-w-[400px] py-8 px-10 space-y-6 hover:shadow-xl duration-200 border border-white/30 rounded-lg overflow-hidden bg-white/20 backdrop-blur-sm shadow-lg">
        <div className="relative h-32">
          <Image
            src="/assets/imgs/blue_logo_rectangle_1024x576.webp"
            alt="HiddenWords Logo"
            fill
            className="object-cover object-center"
          />
        </div>

        {/* Formulario email/pass */}
        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full rounded-full px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-royalblue-500"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              className="w-full rounded-full px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-royalblue-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-royalblue-500 focus:outline-none"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          <button
            type="submit"
            className="w-full font-semibold bg-royalblue-500 text-white rounded-full py-2 hover:bg-royalblue-900 focus:bg-royalblue-900 focus:outline-none focus:ring-2 focus:ring-royalblue-300"
          >
            Iniciar sesión
          </button>
        </form>

        {/* Separador */}
        <div className="flex items-center gap-2">
          <hr className="flex-1 border-royalblue-500" />
          <span className="text-royalblue-500 text-xs">O</span>
          <hr className="flex-1 border-royalblue-500" />
        </div>

        {/* Botón Google */}
        <div className="w-full">
          <GoogleButton />
        </div>

        {/* Link de registro */}
        <p className="text-center text-sm text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-royalblue-500 hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
