"use client";

import { useTransition } from "react";
import { logoutAction } from "@/app/login/actions";
import { Button } from "@/components/ui/Button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/primitives/alert-dialog";

type DashboardUserMenuProps = {
  nome: string;
};

function initials(nome: string): string {
  return nome
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function DashboardUserMenu({ nome }: DashboardUserMenuProps) {
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(() => {
      void logoutAction();
    });
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-muted-foreground sm:block">
        {nome}
      </span>
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        {initials(nome)}
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            Terminar Sessão
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Terminar sessão?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem a certeza que deseja sair do dashboard? Terá de iniciar
              sessão novamente para aceder à área comercial.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={isPending}
              onClick={handleLogout}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? "A sair..." : "Sair"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
