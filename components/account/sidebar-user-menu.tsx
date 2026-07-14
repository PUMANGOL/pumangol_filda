"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronUp, KeyRound, LogOut } from "lucide-react";
import type { User } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/primitives/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/primitives/alert-dialog";
import { ChangeCredentialsModal } from "@/components/account/change-credentials-modal";

type SidebarUserMenuProps = {
  user: User;
  onLogout: () => Promise<void>;
};

export function SidebarUserMenu({ user, onLogout }: SidebarUserMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [credentialsOpen, setCredentialsOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  function openCredentialsModal() {
    setMenuOpen(false);
    setCredentialsOpen(true);
  }

  function openLogoutDialog() {
    setMenuOpen(false);
    setLogoutOpen(true);
  }

  return (
    <>
      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className={cn(
            "w-full cursor-pointer flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
            "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20",
            menuOpen && "bg-muted"
          )}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
        >
          <div className="min-w-0 flex-1">
            <p className="text-foreground text-sm font-medium truncate">{user.fullName}</p>
            <p className="text-muted-foreground text-xs truncate">@{user.username}</p>
          </div>
          <ChevronUp
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
              !menuOpen && "rotate-180"
            )}
          />
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute bottom-full left-0 right-0 mb-2 overflow-hidden rounded-lg border border-border bg-white shadow-lg"
          >
            <button
              type="button"
              role="menuitem"
              onClick={openCredentialsModal}
              className="flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <KeyRound className="h-4 w-4 text-muted-foreground" />
              Alterar credenciais
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={openLogoutDialog}
              className="flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Terminar sessão
            </button>
          </div>
        )}
      </div>

      <ChangeCredentialsModal
        open={credentialsOpen}
        currentUsername={user.username}
        onClose={() => setCredentialsOpen(false)}
      />

      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Terminar sessão?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem a certeza que deseja terminar a sessão? Terá de voltar a
              autenticar-se para aceder ao sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={onLogout}
            >
              Terminar sessão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
