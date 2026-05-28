"use client";

// app/documents/page.tsx — User documents page with save/bookmark

import React, { useState, useRef, useEffect } from "react";
import { AppShell } from "@/app/components/ui/Appshell";
import { Button } from "@/app/components/ui/Button";
import Modal from "@/app/components/ui/Modal";
import { cn } from "@/app/lib/utils";

const API = process.env.NEXT_PUBLIC_API_URL;

type FilterCategory = "Prescription" | "New Article" | "Saved";

interface DocumentItem {
  id: string;
  title: string;
  date: string;
  category: "medical-records" | "prescriptions";
  body?: string;
  images?: string[];
  tags?: FilterCategory[];
}

interface Post {
  _id: string;
  title: string;
  description: string;
  photo?: string;
  createdAt: string;
}

const ALL_FILTERS: FilterCategory[] = ["Prescription", "New Article", "Saved"];

// ── Icons ──────────────────────────────────────────────────────
const DocFileIcon = () => (
  <svg
    className="w-5 h-5 shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const SearchIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const FilterIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="21" y1="6" x2="3" y2="6" />
    <line x1="15" y1="12" x2="9" y2="12" />
    <line x1="11" y1="18" x2="13" y2="18" />
  </svg>
);
const ChevronDownIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// Bookmark icon — filled red when saved
const BookmarkIcon = ({ filled }: { filled: boolean }) => (
  <svg
    className="w-4 h-4 transition-all duration-200"
    viewBox="0 0 24 24"
    fill={filled ? "#D72638" : "none"}
    stroke="#D72638"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
  </svg>
);

// ── Filter dropdown ────────────────────────────────────────────
const FilterDropdown: React.FC<{
  selected: Set<FilterCategory>;
  onChange: (cat: FilterCategory) => void;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
}> = ({ selected, onChange, onClose, anchorRef }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      )
        onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose, anchorRef]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 z-40 w-52 bg-white rounded-xl shadow-lg border border-gray-100 p-3"
    >
      <p className="text-sm font-semibold text-gray-900 mb-3 px-1">Filter</p>
      <div className="space-y-1">
        {ALL_FILTERS.map((cat) => {
          const checked = selected.has(cat);
          return (
            <label
              key={cat}
              className="flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <span
                onClick={() => onChange(cat)}
                className={cn(
                  "w-5 h-5 rounded flex items-center justify-center shrink-0 border-2 transition-colors",
                  checked
                    ? "bg-[#D72638] border-[#D72638]"
                    : "border-gray-300 bg-white",
                )}
              >
                {checked && (
                  <svg
                    className="w-3 h-3 text-white"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                  >
                    <polyline points="2 6 5 9 10 3" />
                  </svg>
                )}
              </span>
              <span className="text-sm text-gray-700">{cat}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

// ── Document card with bookmark ────────────────────────────────
const DocumentCard: React.FC<{
  item: DocumentItem;
  isSaved: boolean;
  onSave: (id: string) => void;
  onClick: (item: DocumentItem) => void;
}> = ({ item, isSaved, onSave, onClick }) => (
  <div
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl",
      "border border-gray-200 bg-white",
      "hover:border-[#D72638]/40 hover:shadow-sm",
      "transition-all duration-150 group",
    )}
  >
    {/* Left: icon + text — clicking opens modal */}
    <button
      type="button"
      onClick={() => onClick(item)}
      className="flex items-center gap-3 flex-1 min-w-0 text-left focus:outline-none"
    >
      <div className="text-[#D72638] shrink-0">
        <DocFileIcon />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-[#D72638] transition-colors duration-150">
          {item.title}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{item.date}</p>
      </div>
    </button>

    {/* Right: bookmark save button */}
    {/* TODO: wire onSave to your real save API */}
    <button
      type="button"
      onClick={() => onSave(item.id)}
      aria-label={isSaved ? "Unsave document" : "Save document"}
      className={cn(
        "shrink-0 w-8 h-8 flex items-center justify-center rounded-full",
        "transition-all duration-150 focus:outline-none",
        "focus-visible:ring-2 focus-visible:ring-[#D72638]/30",
        isSaved ? "bg-[#FEF0F1]" : "hover:bg-[#FEF0F1]",
      )}
    >
      <BookmarkIcon filled={isSaved} />
    </button>
  </div>
);

// ══════════════════════════════════════════════════════════════
// USER DOCUMENTS PAGE
// ══════════════════════════════════════════════════════════════
export default function DocumentsPage() {
  const username = "Urdanetz"; // DATA: auth context
  const notifCount = 3; // DATA: notification API

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Set<FilterCategory>>(
    new Set(),
  );
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Tracks which document IDs are saved — Set for O(1) lookup
  // DATA: initialise from API (e.g. fetch saved doc IDs on mount)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const filterBtnRef = useRef<HTMLButtonElement>(null);

  // ── Fetch posts ──────────────────────────────────────────────
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API}/api/posts`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        const mapped: DocumentItem[] = data.posts.map((post: Post) => ({
          id: post._id,
          title: post.title,
          date: new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          category: "medical-records" as const,
          body: post.description,
          images: post.photo && post.photo.trim() !== "" ? [post.photo] : [],
          tags: [],
        }));
        setDocuments(mapped);
      } catch (err) {
        console.error(err);
        setError("Failed to load documents.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // ── Toggle save ──────────────────────────────────────────────
  // TODO: replace with real API call:
  // await fetch(`${API}/api/documents/${id}/save`, {
  //   method: savedIds.has(id) ? "DELETE" : "POST",
  //   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  // });
  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleFilter = (cat: FilterCategory) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  const handleSearch = () => console.log("Search:", searchQuery);

  const visibleDocs = documents.filter((doc) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilters.size === 0 ||
      (doc.tags ?? []).some((t) => activeFilters.has(t));
    return matchesSearch && matchesFilter;
  });

  return (
    <AppShell
      variant="home"
      pageTitle="Documents"
      username={username}
      notifCount={notifCount}
      showSearch={false}
    >
      <div className="w-full space-y-4">
        {/* ── Search + Filter ───────────────────────────────── */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 flex items-center">
            <span className="absolute left-3 text-gray-400 pointer-events-none">
              <SearchIcon />
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search article, document..."
              className={cn(
                "w-full h-10 pl-9 pr-3 rounded-xl border border-gray-200 bg-white",
                "text-sm text-gray-900 placeholder-gray-400",
                "focus:outline-none focus:ring-2 focus:ring-[#D72638]/20 focus:border-[#D72638]",
                "transition-all duration-200 [&::-webkit-search-cancel-button]:hidden",
              )}
            />
          </div>
          <Button
            label="Search"
            variant="primary"
            size="md"
            leftIcon={<SearchIcon />}
            onClick={handleSearch}
            className="shrink-0"
          />
          <div className="relative shrink-0">
            <button
              ref={filterBtnRef}
              type="button"
              onClick={() => setFilterOpen((v) => !v)}
              className={cn(
                "h-10 px-3 flex items-center gap-1.5 rounded-xl border text-sm font-medium transition-all focus:outline-none",
                filterOpen || activeFilters.size > 0
                  ? "border-[#D72638] text-[#D72638] bg-[#FEF0F1]"
                  : "border-gray-200 text-gray-500 bg-white hover:border-gray-300",
              )}
            >
              <FilterIcon />
              <ChevronDownIcon />
              {activeFilters.size > 0 && (
                <span className="w-4 h-4 flex items-center justify-center rounded-full bg-[#D72638] text-white text-[10px] font-bold">
                  {activeFilters.size}
                </span>
              )}
            </button>
            {filterOpen && (
              <FilterDropdown
                selected={activeFilters}
                onChange={toggleFilter}
                onClose={() => setFilterOpen(false)}
                anchorRef={filterBtnRef}
              />
            )}
          </div>
        </div>

        {/* ── Active filter chips ───────────────────────────── */}
        {activeFilters.size > 0 && (
          <div className="flex flex-wrap gap-2">
            {[...activeFilters].map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF0F1] text-[#D72638] text-xs font-medium"
              >
                {cat}
                <button
                  type="button"
                  onClick={() => toggleFilter(cat)}
                  className="hover:text-[#B01E2C] focus:outline-none"
                >
                  <svg
                    className="w-3 h-3"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                  >
                    <line x1="9" y1="3" x2="3" y2="9" />
                    <line x1="3" y1="3" x2="9" y2="9" />
                  </svg>
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={() => setActiveFilters(new Set())}
              className="text-xs text-gray-400 hover:text-gray-600 underline focus:outline-none"
            >
              Clear all
            </button>
          </div>
        )}

        {/* ── Document list ──────────────────────────────────── */}
        <div className="rounded-2xl border border-[#D72638]/30 bg-white p-4">
          {loading ? (
            <div className="py-16 text-center text-sm text-gray-400">
              Loading documents...
            </div>
          ) : error ? (
            <div className="py-16 text-center text-sm text-red-500">
              {error}
            </div>
          ) : visibleDocs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-full bg-[#FEF0F1] flex items-center justify-center text-[#D72638] mb-4">
                <DocFileIcon />
              </div>
              <p className="text-sm font-semibold text-gray-700">
                No documents found
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {searchQuery
                  ? `No results for "${searchQuery}"`
                  : "No documents have been added yet."}
              </p>
            </div>
          ) : (
            // DATA: replace visibleDocs with real API data
            <div className="space-y-2">
              {visibleDocs.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  item={doc}
                  isSaved={savedIds.has(doc.id)}
                  onSave={toggleSave}
                  onClick={setSelectedDoc}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Document detail modal ──────────────────────────────── */}
      <Modal
        isOpen={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        title={selectedDoc?.title ?? ""}
        body={selectedDoc?.body}
        date={selectedDoc?.date}
        images={selectedDoc?.images ?? []}
        // Pass save state into the modal so bookmark stays in sync
        isSaved={selectedDoc ? savedIds.has(selectedDoc.id) : false}
        onSaveToggle={(saved) => {
          if (selectedDoc) toggleSave(selectedDoc.id);
        }}
      />
    </AppShell>
  );
}
