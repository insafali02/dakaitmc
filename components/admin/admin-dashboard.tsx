"use client";

import { useEffect, useMemo, useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { DashboardPayload } from "@/lib/types";

import {
  EntitySection,
  type EditableRow,
  type FieldConfig,
  type SelectOption
} from "@/components/admin/entity-section";

const tableMap = {
  ranks: "ranks",
  visual_feed_items: "visualFeedItems",
  store_categories: "storeCategories",
  store_items: "storeItems",
  faqs: "faqs",
  announcements: "announcements",
  site_settings: "siteSettings",
  staff_members: "staffMembers"
} as const;

type TableName = keyof typeof tableMap;
type PayloadKey = (typeof tableMap)[TableName];
type AdminTab =
  | "server"
  | "visualFeed"
  | "ranks"
  | "store"
  | "faq"
  | "announcements"
  | "staff";

function asEditableRows(rows: unknown[]): EditableRow[] {
  return rows as EditableRow[];
}

const tabs: Array<{ id: AdminTab; label: string; hint: string }> = [
  { id: "server", label: "Server", hint: "IP + Discord link" },
  { id: "visualFeed", label: "Visual Feed", hint: "Home feed cards" },
  { id: "ranks", label: "Ranks", hint: "Rank cards" },
  { id: "store", label: "Store", hint: "Categories + items + kits" },
  { id: "staff", label: "Staff", hint: "Owner / Helper / Moderator" },
  { id: "faq", label: "FAQ", hint: "Questions and answers" },
  { id: "announcements", label: "Announcements", hint: "Homepage updates" }
];

export function AdminDashboard({
  initialData,
  userEmail
}: {
  initialData: DashboardPayload;
  userEmail: string;
}) {
  const [data, setData] = useState<DashboardPayload>(initialData);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("server");

  const [serverIp, setServerIp] = useState("");
  const [discordUrl, setDiscordUrl] = useState("");
  const [savingServer, setSavingServer] = useState(false);

  const serverIpSetting = useMemo(
    () => data.siteSettings.find((setting) => setting.key === "server_ip"),
    [data.siteSettings]
  );
  const discordSetting = useMemo(
    () => data.siteSettings.find((setting) => setting.key === "discord_url"),
    [data.siteSettings]
  );

  useEffect(() => {
    setServerIp(serverIpSetting?.value_text || "play.dakaitmc.net");
    setDiscordUrl(discordSetting?.value_text || "https://discord.gg/dakaitmc");
  }, [serverIpSetting?.id, serverIpSetting?.value_text, discordSetting?.id, discordSetting?.value_text]);

  function updateTableRows(table: TableName, rows: EditableRow[]) {
    const key = tableMap[table] as PayloadKey;
    setData((current) => ({ ...current, [key]: rows }) as DashboardPayload);
  }

  async function callMutation(
    table: TableName,
    method: "POST" | "PATCH" | "DELETE",
    body: Record<string, unknown>
  ) {
    setBusy(true);
    setNotice(null);
    try {
      const response = await fetch(`/api/admin/${table}`, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Mutation failed");
      }

      updateTableRows(table, asEditableRows(payload.rows || []));
      setNotice("Saved.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Request failed.");
    } finally {
      setBusy(false);
    }
  }

  async function createRecord(table: string, payload: Record<string, unknown>) {
    await callMutation(table as TableName, "POST", { payload });
  }

  async function updateRecord(table: string, id: string, payload: Record<string, unknown>) {
    await callMutation(table as TableName, "PATCH", { id, payload });
  }

  async function deleteRecord(table: string, id: string) {
    const confirmed = window.confirm("Delete this record?");
    if (!confirmed) return;
    await callMutation(table as TableName, "DELETE", { id });
  }

  async function moveRecord(table: string, id: string, direction: "up" | "down") {
    setBusy(true);
    setNotice(null);
    try {
      const response = await fetch("/api/admin/reorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ table, id, direction })
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Could not reorder.");
      }

      updateTableRows(table as TableName, asEditableRows(payload.rows || []));
      setNotice("Order updated.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Reorder failed.");
    } finally {
      setBusy(false);
    }
  }

  async function uploadImage(table: string, file: File) {
    const supabase = createSupabaseBrowserClient();
    const extension = file.name.includes(".") ? file.name.split(".").at(-1) : "png";
    const path = `${table}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const { data: uploaded, error } = await supabase.storage.from("media").upload(path, file, {
      upsert: true
    });
    if (error || !uploaded) {
      throw new Error(error?.message || "Upload failed.");
    }
    return uploaded.path;
  }

  async function saveServerSettings() {
    setSavingServer(true);
    setNotice(null);
    try {
      if (serverIpSetting?.id) {
        await updateRecord("site_settings", serverIpSetting.id, { value_text: serverIp });
      } else {
        await createRecord("site_settings", {
          key: "server_ip",
          value_text: serverIp,
          is_published: true
        });
      }

      if (discordSetting?.id) {
        await updateRecord("site_settings", discordSetting.id, { value_text: discordUrl });
      } else {
        await createRecord("site_settings", {
          key: "discord_url",
          value_text: discordUrl,
          is_published: true
        });
      }

      setNotice("Server settings saved.");
    } finally {
      setSavingServer(false);
    }
  }

  const storeCategoryOptions: SelectOption[] = useMemo(
    () =>
      data.storeCategories.map((category) => ({
        value: category.id,
        label: category.name
      })),
    [data.storeCategories]
  );

  const rankFields: FieldConfig[] = [
    { key: "code", label: "Code", type: "text", required: true },
    { key: "title", label: "Title", type: "text", required: true },
    { key: "subtitle", label: "Subtitle", type: "text" },
    { key: "price_pkr", label: "Price (PKR)", type: "number" },
    { key: "invite_requirement", label: "Invite Requirement", type: "text" },
    { key: "chat_colour", label: "Chat Colour", type: "text" },
    { key: "homes", label: "Homes", type: "text" },
    { key: "vaults", label: "/vaults", type: "text" },
    { key: "auction_slots", label: "Auction Slots", type: "text" },
    { key: "craft", label: "/craft", type: "boolean" },
    { key: "recipe", label: "/recipe", type: "boolean" },
    { key: "disposal", label: "/disposal", type: "boolean" },
    { key: "near", label: "/near", type: "boolean" },
    { key: "hat", label: "/hat", type: "boolean" },
    { key: "feed", label: "/feed", type: "boolean" },
    { key: "invsee", label: "/invsee", type: "boolean" },
    { key: "enderchest", label: "/enderchest", type: "boolean" },
    { key: "ptime", label: "/ptime", type: "boolean" },
    { key: "pweather", label: "/pweather", type: "boolean" },
    { key: "kit_name", label: "Kit Name", type: "text" },
    { key: "cta_label", label: "CTA Label", type: "text", required: true },
    { key: "cta_url", label: "CTA URL", type: "text" }
  ];

  const visualFeedFields: FieldConfig[] = [
    { key: "title", label: "Card Name", type: "text", required: true },
    { key: "subtitle", label: "Description", type: "text" },
    { key: "image_path", label: "Image Path", type: "text" }
  ];

  const storeCategoryFields: FieldConfig[] = [
    { key: "name", label: "Name", type: "text", required: true },
    { key: "slug", label: "Slug", type: "text", required: true },
    { key: "description", label: "Description", type: "textarea" }
  ];

  const storeItemFields: FieldConfig[] = [
    { key: "category_id", label: "Category", type: "select", required: true, options: storeCategoryOptions },
    { key: "title", label: "Title", type: "text", required: true },
    { key: "package_label", label: "Package Label", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "price_pkr", label: "Price (PKR)", type: "number", required: true },
    { key: "cta_label", label: "CTA Label", type: "text", required: true },
    { key: "cta_url", label: "CTA URL", type: "text" }
  ];

  const faqFields: FieldConfig[] = [
    { key: "question", label: "Question", type: "text", required: true },
    { key: "answer", label: "Answer", type: "textarea", required: true }
  ];

  const announcementFields: FieldConfig[] = [
    { key: "title", label: "Title", type: "text", required: true },
    { key: "body", label: "Body", type: "textarea", required: true },
    { key: "published_at", label: "Published At", type: "datetime" },
    { key: "image_path", label: "Image Path", type: "text" }
  ];

  const staffRoleOptions: SelectOption[] = [
    { value: "Owner", label: "Owner" },
    { value: "Helper", label: "Helper" },
    { value: "Moderator", label: "Moderator" },
    { value: "Admin", label: "Admin" },
    { value: "Manager", label: "Manager" }
  ];

  const staffFields: FieldConfig[] = [
    { key: "ign", label: "Display Name", type: "text", required: true },
    { key: "role", label: "Role", type: "select", required: true, options: staffRoleOptions },
    { key: "bio", label: "Bio", type: "textarea" },
    { key: "image_path", label: "Image Path", type: "text" }
  ];

  return (
    <div className="section-shell py-8">
      <div className="mb-6 rounded-md border border-ember/35 bg-black/40 p-4">
        <h1 className="font-heading text-4xl uppercase tracking-[0.12em] text-sand">Dakait Admin Panel</h1>
        <p className="mt-2 text-sm text-sand/75">
          Signed in as <span className="font-mono">{userEmail}</span>.
        </p>
        {notice ? <p className="mt-2 text-sm text-emerald-300">{notice}</p> : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="metal-panel rounded-md p-3">
          <p className="mb-2 px-2 text-[0.62rem] uppercase tracking-[0.16em] text-sand/60">Sections</p>
          <div className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full rounded-sm border px-3 py-2 text-left transition ${
                  activeTab === tab.id
                    ? "border-ember/55 bg-ember/15 text-sand"
                    : "border-white/10 bg-black/20 text-sand/75 hover:border-white/25"
                }`}
              >
                <p className="text-xs uppercase tracking-[0.14em]">{tab.label}</p>
                <p className="mt-1 text-[0.72rem] text-sand/60">{tab.hint}</p>
              </button>
            ))}
          </div>
        </aside>

        <section className="space-y-4">
          {activeTab === "server" ? (
            <article className="metal-panel rounded-md p-5">
              <h2 className="font-heading text-3xl uppercase tracking-[0.1em] text-sand">Server Settings</h2>
              <p className="mt-2 text-sm text-sand/70">
                Update server IP and Discord invite. Store and rank Buy Now buttons will use this Discord link by default.
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label>
                  <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-sand/60">Server IP</span>
                  <input
                    type="text"
                    value={serverIp}
                    onChange={(event) => setServerIp(event.target.value)}
                    className="w-full rounded-sm border border-white/20 bg-black/25 px-3 py-2 text-white outline-none transition focus:border-ember"
                  />
                </label>
                <label>
                  <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-sand/60">Discord URL</span>
                  <input
                    type="text"
                    value={discordUrl}
                    onChange={(event) => setDiscordUrl(event.target.value)}
                    className="w-full rounded-sm border border-white/20 bg-black/25 px-3 py-2 text-white outline-none transition focus:border-ember"
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={saveServerSettings}
                disabled={busy || savingServer}
                className="mt-4 rounded-sm border border-ember bg-ember/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-sand transition hover:bg-ember/35 disabled:opacity-60"
              >
                {savingServer ? "Saving..." : "Save Server Settings"}
              </button>
            </article>
          ) : null}

          {activeTab === "ranks" ? (
            <EntitySection
              title="Ranks"
              table="ranks"
              rows={asEditableRows(data.ranks)}
              fields={rankFields}
              listDetail
              busy={busy}
              onCreate={createRecord}
              onUpdate={updateRecord}
              onDelete={deleteRecord}
              onMove={moveRecord}
              onUpload={uploadImage}
            />
          ) : null}

          {activeTab === "visualFeed" ? (
            <EntitySection
              title="Server Visual Feed"
              table="visual_feed_items"
              rows={asEditableRows(data.visualFeedItems)}
              fields={visualFeedFields}
              busy={busy}
              onCreate={createRecord}
              onUpdate={updateRecord}
              onDelete={deleteRecord}
              onMove={moveRecord}
              onUpload={uploadImage}
            />
          ) : null}

          {activeTab === "store" ? (
            <>
              <EntitySection
                title="Store Categories"
                table="store_categories"
                rows={asEditableRows(data.storeCategories)}
                fields={storeCategoryFields}
                busy={busy}
                onCreate={createRecord}
                onUpdate={updateRecord}
                onDelete={deleteRecord}
                onMove={moveRecord}
                onUpload={uploadImage}
              />
              <EntitySection
                title="Store Items"
                table="store_items"
                rows={asEditableRows(data.storeItems)}
                fields={storeItemFields}
                busy={busy}
                onCreate={createRecord}
                onUpdate={updateRecord}
                onDelete={deleteRecord}
                onMove={moveRecord}
                onUpload={uploadImage}
              />
            </>
          ) : null}

          {activeTab === "faq" ? (
            <EntitySection
              title="FAQs"
              table="faqs"
              rows={asEditableRows(data.faqs)}
              fields={faqFields}
              busy={busy}
              onCreate={createRecord}
              onUpdate={updateRecord}
              onDelete={deleteRecord}
              onMove={moveRecord}
              onUpload={uploadImage}
            />
          ) : null}

          {activeTab === "announcements" ? (
            <EntitySection
              title="Announcements"
              table="announcements"
              rows={asEditableRows(data.announcements)}
              fields={announcementFields}
              busy={busy}
              onCreate={createRecord}
              onUpdate={updateRecord}
              onDelete={deleteRecord}
              onMove={moveRecord}
              onUpload={uploadImage}
            />
          ) : null}

          {activeTab === "staff" ? (
            <EntitySection
              title="Staff Members"
              table="staff_members"
              rows={asEditableRows(data.staffMembers)}
              fields={staffFields}
              listDetail
              busy={busy}
              onCreate={createRecord}
              onUpdate={updateRecord}
              onDelete={deleteRecord}
              onMove={moveRecord}
              onUpload={uploadImage}
            />
          ) : null}
        </section>
      </div>
    </div>
  );
}
