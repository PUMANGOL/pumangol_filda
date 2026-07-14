"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

function normalize(str: string): string {
  return str
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function filterOptions(options: readonly string[], query: string): string[] {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [...options];
  return options.filter((option) => normalize(option).includes(normalizedQuery));
}

type SearchableSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
  error?: string;
  className?: string;
};

export function SearchableSelect({
  value,
  onChange,
  options,
  placeholder,
  error,
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const trimmedQuery = query.trim();
  const filtered = filterOptions(options, query);
  const exactMatch = options.some((option) => normalize(option) === normalize(trimmedQuery));
  const canCreate = trimmedQuery.length > 0 && !exactMatch;

  useEffect(() => {
    if (!open) setQuery(value);
  }, [value, open]);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        const trimmed = query.trim();
        if (trimmed) {
          const match = options.find((option) => normalize(option) === normalize(trimmed));
          onChange(match ?? trimmed);
        }
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, query, options, onChange]);

  function closeAndCommit(nextQuery = query) {
    const trimmed = nextQuery.trim();
    if (trimmed) {
      const match = options.find((option) => normalize(option) === normalize(trimmed));
      onChange(match ?? trimmed);
    }
    setOpen(false);
  }

  function selectOption(option: string) {
    onChange(option);
    setQuery(option);
    setOpen(false);
    inputRef.current?.blur();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (canCreate) selectOption(trimmedQuery);
      else if (filtered.length === 1) selectOption(filtered[0]!);
      else if (filtered[0] && normalize(filtered[0]) === normalize(trimmedQuery)) selectOption(filtered[0]);
      else closeAndCommit();
    }

    if (event.key === "Escape") {
      setQuery(value);
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          value={open ? query : value}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setQuery(value);
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "flex h-11 w-full min-w-0 rounded-xl border bg-white px-4 py-3 pr-10 text-base text-foreground shadow-xs transition-colors outline-none placeholder:text-muted-foreground",
            "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20",
            error
              ? "border-destructive focus-visible:ring-destructive/20"
              : "border-input",
            "md:text-sm",
            className
          )}
        />
        <ChevronDown
          className={cn(
            "pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </div>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute right-0 left-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-border bg-white py-1 shadow-md"
        >
          {canCreate && (
            <li
              role="option"
              aria-selected={false}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectOption(trimmedQuery)}
              className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-muted"
            >
              <Plus className="size-4 shrink-0" />
              <span>
                Adicionar &ldquo;{trimmedQuery}&rdquo;
              </span>
            </li>
          )}

          {filtered.map((option) => (
            <li
              key={option}
              role="option"
              aria-selected={value === option}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectOption(option)}
              className={cn(
                "cursor-pointer px-3 py-2 text-sm hover:bg-muted",
                value === option && "bg-brand-light text-brand font-medium"
              )}
            >
              {option}
            </li>
          ))}

          {filtered.length === 0 && !canCreate && (
            <li className="px-3 py-2 text-sm text-muted-foreground">Nenhum resultado</li>
          )}
        </ul>
      )}

      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
