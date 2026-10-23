"use client";

import { useEffect, useMemo, useState } from "react";

type Direction = "up" | "down";

export type FieldType = "text" | "textarea" | "number" | "boolean" | "datetime" | "select";

export type SelectOption = {
  label: string;
  value: string;
};

export type FieldConfig = {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[];
};

export type EditableRow = {
  id: string;
  sort_order: number;
  is_published: boolean;
  [key: string]: unknown;
};

type EntitySectionProps = {
  title: string;
  table: string;
  rows: EditableRow[];
  fields: FieldConfig[];
  listDetail?: boolean;
  busy: boolean;
  onCreate: (table: string, payload: Record<string, unknown>) => Promise<void>;
  onUpdate: (table: string, id: string, payload: Record<string, unknown>) => Promise<void>;
  onDelete: (table: string, id: string) => Promise<void>;
  onMove: (table: string, id: string, direction: Direction) => Promise<void>;
  onUpload: (table: string, file: File) => Promise<string>;
};

function defaultByField(field: FieldConfig) {
  switch (field.type) {
    case "number":
      return "";
    case "boolean":
      return false;
    case "datetime":
      return "";
    default:
      return "";
  }
}

function parseByField(field: FieldConfig, value: unknown) {
  if (field.type === "number") {
    if (value === "" || value === null || value === undefined) return null;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }

  if (field.type === "boolean") {
    return Boolean(value);
  }

  if (field.type === "datetime") {
    if (!value) return null;
    const input = String(value);
    return input ? new Date(input).toISOString() : null;
  }

  if (typeof value === "string") {
    return value.trim() === "" ? null : value.trim();
  }

  return value ?? null;
}

function toLocalDateTimeInput(value: unknown) {
  if (!value) return "";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "";
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
}

function plusMinutesLocal(minutes: number) {
  const date = new Date(Date.now() + minutes * 60_000);
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
}

function rowLabel(row: EditableRow) {
  const candidates = [
    row.title,
    row.name,
    row.question,
    row.feature_name,
    row.ign,
    row.key,
    row.code,
    row.id
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return String(row.id);
}

function fieldInput(
  field: FieldConfig,
  value: unknown,
  onChange: (nextValue: unknown) => void,
  onUpload: (file: File) => void
) {
  const baseClass =
    "w-full rounded-sm border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none transition focus:border-ember";

  if (field.type === "textarea") {
    return (
      <textarea
        value={String(value ?? "")}
        placeholder={field.placeholder}
        required={field.required}
        onChange={(event) => onChange(event.target.value)}
        className={`${baseClass} min-h-[96px]`}
      />
    );
  }

  if (field.type === "boolean") {
    return (
      <label className="inline-flex items-center gap-2 text-sm text-sand/80">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
          className="size-4 accent-amber-600"
        />
        Enabled
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <select
        value={String(value ?? "")}
        required={field.required}
        onChange={(event) => onChange(event.target.value)}
        className={baseClass}
      >
        <option value="">Select</option>
        {(field.options || []).map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  const type = field.type === "number" ? "number" : field.type === "datetime" ? "datetime-local" : "text";
  const dateValue =
    field.type === "datetime" ? toLocalDateTimeInput(value) : String(value ?? "");

  return (
    <div className="space-y-2">
      <input
        type={type}
        value={dateValue}
        placeholder={field.placeholder}
        required={field.required}
        onChange={(event) => onChange(event.target.value)}
        className={baseClass}
      />
      {field.type === "datetime" && field.key === "published_at" ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onChange(plusMinutesLocal(0))}
            className="rounded-sm border border-white/25 px-2 py-1 text-[0.64rem] uppercase tracking-[0.1em] text-sand/75"
          >
            Now
          </button>
          <button
            type="button"
            onClick={() => onChange(plusMinutesLocal(30))}
            className="rounded-sm border border-white/25 px-2 py-1 text-[0.64rem] uppercase tracking-[0.1em] text-sand/75"
          >
            +30 min
          </button>
          <button
            type="button"
            onClick={() => onChange(plusMinutesLocal(40))}
            className="rounded-sm border border-white/25 px-2 py-1 text-[0.64rem] uppercase tracking-[0.1em] text-sand/75"
          >
            +40 min
          </button>
        </div>
      ) : null}
      {field.key === "image_path" ? (
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onUpload(file);
          }}
          className="w-full text-xs text-sand/70 file:mr-3 file:rounded-sm file:border-0 file:bg-ember/20 file:px-3 file:py-2 file:text-xs file:uppercase file:tracking-[0.1em] file:text-sand"
        />
      ) : null}
    </div>
  );
}

function RowEditor({
  table,
  row,
  fields,
  busy,
  onUpdate,
  onDelete,
  onMove,
  onUpload
}: {
  table: string;
  row: EditableRow;
  fields: FieldConfig[];
  busy: boolean;
  onUpdate: (table: string, id: string, payload: Record<string, unknown>) => Promise<void>;
  onDelete: (table: string, id: string) => Promise<void>;
  onMove: (table: string, id: string, direction: Direction) => Promise<void>;
  onUpload: (table: string, file: File) => Promise<string>;
}) {
  const [draft, setDraft] = useState<Record<string, unknown>>(row);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  useEffect(() => {
    setDraft(row);
  }, [row]);

  async function save() {
    setSaving(true);
    setUploadNotice(null);
    try {
      const payload = Object.fromEntries(
        fields.map((field) => [field.key, parseByField(field, draft[field.key])])
      );
      await onUpdate(table, row.id, payload);
    } finally {
      setSaving(false);
    }
  }

  return (
    <article className="rounded-md border border-white/10 bg-black/20 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-sand/55">Order {row.sort_order}</p>
          <p className="text-sm font-semibold text-sand">{rowLabel(row)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onMove(table, row.id, "up")}
            disabled={busy}
            className="rounded-sm border border-white/20 px-2 py-1 text-xs text-sand/80"
          >
            Up
          </button>
          <button
            type="button"
            onClick={() => onMove(table, row.id, "down")}
            disabled={busy}
            className="rounded-sm border border-white/20 px-2 py-1 text-xs text-sand/80"
          >
            Down
          </button>
          <button
            type="button"
            onClick={() => onUpdate(table, row.id, { is_published: !row.is_published })}
            disabled={busy}
            className="rounded-sm border border-ember/50 px-2 py-1 text-xs text-ember"
          >
            {row.is_published ? "Unpublish" : "Publish"}
          </button>
          <button
            type="button"
            onClick={() => onDelete(table, row.id)}
            disabled={busy}
            className="rounded-sm border border-rose-400/40 px-2 py-1 text-xs text-rose-300"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field.key} className={field.type === "textarea" ? "md:col-span-2" : ""}>
            <span className="mb-1 block text-[0.68rem] uppercase tracking-[0.12em] text-sand/60">
              {field.label}
            </span>
            {fieldInput(
              field,
              draft[field.key],
              (next) => setDraft((current) => ({ ...current, [field.key]: next })),
              async (file) => {
                setUploading(true);
                setUploadNotice(null);
                try {
                  const path = await onUpload(table, file);
                  setDraft((current) => ({ ...current, [field.key]: path }));

                  // Image field uploads are applied immediately so users do not lose changes.
                  if (field.key === "image_path") {
                    await onUpdate(table, row.id, { image_path: path });
                    setUploadNotice("Image uploaded and saved.");
                  }
                } catch (error) {
                  setUploadNotice(error instanceof Error ? error.message : "Image upload failed.");
                } finally {
                  setUploading(false);
                }
              }
            )}
          </label>
        ))}
      </div>

      {uploadNotice ? <p className="mt-3 text-xs text-sand/75">{uploadNotice}</p> : null}

      <button
        type="button"
        disabled={busy || saving || uploading}
        onClick={save}
        className="mt-4 rounded-sm border border-ember bg-ember/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-sand transition hover:bg-ember/35 disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </article>
  );
}

export function EntitySection({
  title,
  table,
  rows,
  fields,
  listDetail = false,
  busy,
  onCreate,
  onUpdate,
  onDelete,
  onMove,
  onUpload
}: EntitySectionProps) {
  const [expanded, setExpanded] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const initialDraft = useMemo(
    () =>
      Object.fromEntries(fields.map((field) => [field.key, defaultByField(field)])) as Record<string, unknown>,
    [fields]
  );
  const [createDraft, setCreateDraft] = useState<Record<string, unknown>>(initialDraft);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    setCreateDraft(initialDraft);
  }, [initialDraft]);

  async function createRecord() {
    setCreating(true);
    try {
      const payload = Object.fromEntries(
        fields.map((field) => [field.key, parseByField(field, createDraft[field.key])])
      );
      await onCreate(table, payload);
      setCreateDraft(initialDraft);
    } finally {
      setCreating(false);
    }
  }

  const selectedRow = selectedId ? rows.find((row) => row.id === selectedId) || null : null;

  return (
    <section className="admin-shell p-5">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between text-left"
      >
        <h2 className="font-heading text-3xl uppercase tracking-[0.11em] text-sand">{title}</h2>
        <span className="text-xs uppercase tracking-[0.12em] text-sand/60">
          {rows.length} records | {expanded ? "Collapse" : "Expand"}
        </span>
      </button>

      {expanded ? (
        <div className="mt-5 space-y-4">
          <div className="rounded-md border border-ember/35 bg-ember/10 p-4">
            <p className="mb-3 text-xs uppercase tracking-[0.13em] text-sand/70">Create New</p>
            <div className="grid gap-3 md:grid-cols-2">
              {fields.map((field) => (
                <label key={field.key} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                  <span className="mb-1 block text-[0.68rem] uppercase tracking-[0.12em] text-sand/60">
                    {field.label}
                  </span>
                  {fieldInput(
                    field,
                    createDraft[field.key],
                    (next) => setCreateDraft((current) => ({ ...current, [field.key]: next })),
                    async (file) => {
                      const path = await onUpload(table, file);
                      setCreateDraft((current) => ({ ...current, [field.key]: path }));
                    }
                  )}
                </label>
              ))}
            </div>
            <button
              type="button"
              disabled={busy || creating}
              onClick={createRecord}
              className="mt-4 rounded-sm border border-ember bg-ember/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-sand transition hover:bg-ember/35 disabled:opacity-60"
            >
              {creating ? "Creating..." : "Create Record"}
            </button>
          </div>

          {listDetail ? (
            <div className="space-y-3">
              {selectedRow ? (
                <>
                  <button
                    type="button"
                    onClick={() => setSelectedId(null)}
                    className="rounded-sm border border-white/25 px-3 py-2 text-xs uppercase tracking-[0.12em] text-sand/80"
                  >
                    Back To List
                  </button>
                  <RowEditor
                    key={selectedRow.id}
                    table={table}
                    row={selectedRow}
                    fields={fields}
                    busy={busy}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    onMove={onMove}
                    onUpload={onUpload}
                  />
                </>
              ) : (
                <div className="space-y-2">
                  {rows.map((row) => (
                    <button
                      key={row.id}
                      type="button"
                      onClick={() => setSelectedId(row.id)}
                      className="grid w-full grid-cols-[1fr_auto_auto] items-center gap-3 rounded-sm border border-white/15 bg-black/30 px-3 py-3 text-left transition hover:border-ember/45"
                    >
                      <span className="text-sm font-semibold text-sand">{rowLabel(row)}</span>
                      <span className="text-[0.64rem] uppercase tracking-[0.12em] text-sand/55">
                        #{row.sort_order} | {row.is_published ? "Published" : "Draft"}
                      </span>
                      <span className="text-xs uppercase tracking-[0.12em] text-sand/60">Open</span>
                    </button>
                  ))}
                </div>
              )}
              {rows.length === 0 ? (
                <p className="text-sm text-sand/65">No records yet. Create your first entry above.</p>
              ) : null}
            </div>
          ) : (
            <div className="space-y-3">
              {rows.map((row) => (
                <RowEditor
                  key={row.id}
                  table={table}
                  row={row}
                  fields={fields}
                  busy={busy}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onMove={onMove}
                  onUpload={onUpload}
                />
              ))}
              {rows.length === 0 ? (
                <p className="text-sm text-sand/65">No records yet. Create your first entry above.</p>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
