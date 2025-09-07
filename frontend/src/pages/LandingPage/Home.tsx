import { LogIn } from "lucide-react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative bg-white p-4 md:p-6 h-dvh">
      <div className="mx-auto md:pt-2 max-w-4xl md:max-w-4xl lg:max-w-5xl">
        <div className="flex justify-between items-center mx-auto p-4">
          <div className="text-2xl">Snipster</div>
          <div className="flex gap-3">
            <Button variant="ghost" asChild>
              <Link to={`${import.meta.env.VITE_API_BASE}/auth/login`}>
                <LogIn /> Login
              </Link>
            </Button>
          </div>
        </div>
        <section className="mt-10 md:mt-12">
          <h1 className="text-3xl md:text-4xl text-center">
            Stay organized with an easy-to-use snippet manager.
          </h1>
          <p className="mt-9 md:text-xl text-center">
            Snipster helps you capture, organize, and retrieve your code
            snippets with ease. Smart categories and lightning-fast search
            ensure your favorite snippets are always just a click away.
          </p>
        </section>
        <section className="group mt-30">
          {/* <div className="shadow-gray-600 shadow-xl group-hover:shadow-2xl mx-auto border border-gray-200 rounded-2xl group-hover:scale-102 transition-all duration-300 ease-in-out transform">
            <img
              alt="snipster image"
              className="rounded-2xl group-hover:scale-102 transition-transform duration-300 ease-in-out"
              src="https://github.com/amitpatil321/Snipster/raw/main/snipster-home.png"
            />
          </div> */}
          {/* <div className="group relative flex justify-center items-center mx-auto"> */}
          <div className="group relative flex justify-center items-center w-full h-[300px] sm:h-[350px] md:h-[400px]">
            <img
              alt="Snipster app screenshot left"
              className="absolute shadow-lg rounded-xl w-50 sm:w-60 md:w-80 lg:w-xl xl:w-5xl object-cover -rotate-3 group-hover:-rotate-6 transition-all -translate-x-12 sm:-translate-x-16 sm:group-hover:-translate-x-24 md:-translate-x-20 md:group-hover:-translate-x-32 lg:-translate-x-24 lg:group-hover:-translate-x-40 group-hover:-translate-x-20 duration-500 ease-in-out"
              src="https://github.com/amitpatil321/Snipster/raw/main/snipster-home.png"
            />
            <img
              alt="Snipster app screenshot center"
              className="z-10 relative shadow-lg rounded-xl w-50 sm:w-60 md:w-80 lg:w-xl xl:w-5xl object-cover group-hover:scale-105 transition-all duration-500 ease-in-out"
              src="https://github.com/amitpatil321/Snipster/raw/main/snipster-home.png"
            />
            <img
              alt="Snipster app screenshot right"
              className="absolute shadow-lg rounded-xl w-50 sm:w-60 md:w-80 lg:w-xl xl:w-5xl object-cover rotate-3 group-hover:rotate-6 transition-all translate-x-12 sm:group-hover:translate-x-24 sm:translate-x-16 md:group-hover:translate-x-32 md:translate-x-20 lg:group-hover:translate-x-40 lg:translate-x-24 group-hover:translate-x-20 duration-500 ease-in-out"
              src="https://github.com/amitpatil321/Snipster/raw/main/snipster-home.png"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
