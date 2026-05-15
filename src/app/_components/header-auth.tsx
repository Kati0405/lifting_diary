"use client";

import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";

export function HeaderAuth() {
  return (
    <>
      <Show when="signed-out">
        <div className="flex gap-3">
          <SignInButton mode="modal">
            <button className="px-4 py-1.5 text-sm rounded-md border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
              Sign in
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-4 py-1.5 text-sm rounded-md border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
              Sign up
            </button>
          </SignUpButton>
        </div>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </>
  );
}
