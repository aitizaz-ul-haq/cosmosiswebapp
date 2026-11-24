"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useUser } from "@/app/context/UserContext";
import { logUIAction } from "@/lib/logUIAction";
import GenericTable from "./GenericTable";
import DeleteConfirmModal from "./DeleteConfirmModal";
import {
  DetailList,
  DetailRow,
  Icon,
  ModalButton,
  ModalGrid,
  ModalInput,
  ModalSection,
  ModalSelect,
  ModalShell,
} from "./modalkit/ModalKit";
import "./styles/teams.css";

const emptyForm = () => ({ name: "", leaderUserId: "", memberUserIds: [""] });
const managerName = (manager) => manager?.fullName || manager?.username || "Unavailable investment manager";
const emailAddress = (manager) => {
  const address = String(manager?.email || "").trim();
  return /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(address) ? address : "";
};
const encodedEmail = (address) => encodeURIComponent(address).replace(/%40/gi, "@");

function teamPerson(team, id) {
  if (!id) return null;
  if (String(team.leader?._id) === String(id)) return team.leader;
  return team.members?.find((member) => String(member?._id) === String(id)) || null;
}

function teamRecipients(team) {
  const people = [team.leaderUserId, ...(team.memberUserIds || [])].map((id) => teamPerson(team, id));
  if (!people.length || people.some((person) => !emailAddress(person))) return null;
  return [...new Map(people.map((person) => [emailAddress(person).toLowerCase(), emailAddress(person)])).values()];
}

function teamEmailHref(team, wholeTeam = false) {
  const recipients = wholeTeam ? teamRecipients(team) : [emailAddress(team.leader)];
  if (!recipients?.length || recipients.some((address) => !address)) return undefined;
  return `mailto:${recipients.map(encodedEmail).join(",")}?subject=${encodeURIComponent(`Team: ${team.name}`)}`;
}

function restoreTeamTriggerFocus(trigger) {
  const replacement = trigger?.dataset.teamId && trigger?.dataset.teamAction
    ? [...document.querySelectorAll('.teams-page [data-team-id][data-team-action]')].find((element) => element.dataset.teamId === trigger.dataset.teamId && element.dataset.teamAction === trigger.dataset.teamAction)
    : null;
  const target = trigger?.isConnected ? trigger : replacement || document.querySelector('.teams-page .management-table-add');
  target?.focus();
}

function TeamFormModal({ mode, form, managers, error, submitting, onChange, onLeaderChange, onMemberChange, onAddMember, onRemoveMember, onSubmit, onClose }) {
  const isEdit = mode === "edit";
  const managerIds = new Set(managers.map((manager) => String(manager._id)));
  const availableCount = managers.filter((manager) => String(manager._id) !== form.leaderUserId && !form.memberUserIds.includes(String(manager._id))).length;
  const canAddMember = availableCount > 0 && form.memberUserIds.every(Boolean);
  const selectedUnavailable = [form.leaderUserId, ...form.memberUserIds].some((id) => id && !managerIds.has(id));

  return createPortal(
    <ModalShell
      icon="users"
      title={isEdit ? "Edit Team" : "Add Team"}
      subtitle="Choose one investment manager to lead the team, then add its members."
      size="md"
      overlayClassName="teams-modal-overlay"
      as="form"
      wrapperProps={{ onSubmit, "aria-busy": submitting }}
      onClose={onClose}
      closeLogTitle={isEdit ? "Closed Edit Team form" : "Closed Add Team form"}
      dismissOnOverlay={!submitting}
      footer={
        <>
          <ModalButton variant="neutral" onClick={onClose} disabled={submitting}>Cancel</ModalButton>
          <ModalButton type="submit" variant="primary" icon="save" disabled={submitting || managers.length < 2} data-log-title={isEdit ? "Save team changes" : "Create team"}>
            {submitting ? "Saving…" : isEdit ? "Save Changes" : "Add Team"}
          </ModalButton>
        </>
      }
    >
      {error && <p className="teams-error" role="alert">{error}</p>}
      {managers.length < 2 && <p className="teams-notice">At least two active investment managers are needed: one team leader and one team member.</p>}
      {selectedUnavailable && <p className="teams-notice">An assigned investment manager is no longer available. Choose a replacement or remove the member before saving.</p>}
      <ModalGrid cols={1}>
        <ModalInput label="Team Name" name="name" icon="users" required autoFocus maxLength={120} value={form.name} onChange={(event) => onChange(event.target.value)} disabled={submitting} placeholder="Enter team name" />
        <ModalSelect label="Team Leader" name="leaderUserId" icon="user" required value={form.leaderUserId} onChange={(event) => onLeaderChange(event.target.value)} disabled={submitting} hint="The team has one leader, selected from your investment managers.">
          <option value="">Select Investment Manager</option>
          {form.leaderUserId && !managerIds.has(form.leaderUserId) && <option value={form.leaderUserId} disabled>Unavailable investment manager — choose a replacement</option>}
          {managers.map((manager) => <option key={manager._id} value={String(manager._id)}>{managerName(manager)}</option>)}
        </ModalSelect>
      </ModalGrid>
      <ModalSection icon="users" tone="violet" title="Team Members" description="Add investment managers to the team. The leader is included separately." className="teams-members-section">
        <div className="teams-member-fields">
          {form.memberUserIds.map((memberId, index) => (
            <div className="teams-member-field" key={index}>
              <ModalSelect label={`Team Member ${index + 1}`} name={`memberUserIds.${index}`} icon="user" required value={memberId} onChange={(event) => onMemberChange(index, event.target.value)} disabled={submitting}>
                <option value="">Select Investment Manager</option>
                {memberId && !managerIds.has(memberId) && <option value={memberId} disabled>Unavailable investment manager — choose a replacement</option>}
                {managers.filter((manager) => {
                  const id = String(manager._id);
                  return id !== form.leaderUserId && (id === memberId || !form.memberUserIds.includes(id));
                }).map((manager) => <option key={manager._id} value={String(manager._id)}>{managerName(manager)}</option>)}
              </ModalSelect>
              <ModalButton variant="danger" icon="trash" onClick={() => onRemoveMember(index)} disabled={submitting || form.memberUserIds.length === 1} aria-label={`Remove team member ${index + 1}`} title="Remove team member" data-log-title={`Remove team member ${index + 1}`} />
            </div>
          ))}
        </div>
        <ModalButton variant="violet" icon="userPlus" className="teams-add-member" onClick={onAddMember} disabled={submitting || !canAddMember} data-log-title="Add another team member">Add Team Member</ModalButton>
        {!canAddMember && <p className="mk-hint">{form.memberUserIds.some((id) => !id) ? "Choose an investment manager in each member field before adding another." : "All available investment managers have been selected."}</p>}
      </ModalSection>
    </ModalShell>,
    document.body
  );
}

function TeamDetailsModal({ team, onClose }) {
  const emailHref = teamEmailHref(team, true);
  return createPortal(
    <ModalShell
      icon="users"
      title="Team Details"
      subtitle={team.name}
      size="md"
      overlayClassName="teams-modal-overlay"
      onClose={onClose}
      closeLogTitle={`Closed team details: ${team.name}`}
      footer={
        <>
          <ModalButton variant="neutral" onClick={onClose} autoFocus>Close</ModalButton>
          {emailHref ? <a className="mk-btn mk-btn-primary" href={emailHref} title="Open a group email to the team leader and every member" data-log-title={`Send message to team: ${team.name}`}><Icon name="mail" size={17} />Send message to team</a> : <ModalButton variant="primary" icon="mail" disabled title="Every team member and the leader need an email address">Send message to team</ModalButton>}
        </>
      }
    >
      <ModalSection icon="users" title="Team" tone="green">
        <DetailList>
          <DetailRow label="Team Name" value={team.name} />
          <DetailRow label="Team Members" value={`${team.memberUserIds?.length || 0} member${team.memberUserIds?.length === 1 ? "" : "s"} and 1 leader`} />
        </DetailList>
      </ModalSection>
      <ModalSection icon="user" title="Team Leader" tone="blue">
        <DetailList>
          <DetailRow label="Name" value={managerName(team.leader)} />
          <DetailRow label="Email" value={emailAddress(team.leader) || "Email unavailable"} />
        </DetailList>
      </ModalSection>
      <ModalSection icon="users" title="Team Members" tone="violet">
        <ul className="teams-member-list">
          {(team.memberUserIds || []).map((id) => {
            const member = teamPerson(team, id);
            return <li key={id}><strong>{managerName(member)}</strong><span>{emailAddress(member) || "Email unavailable"}</span></li>;
          })}
        </ul>
      </ModalSection>
      <p className="mk-hint">Send message to team opens your email application with the team leader and all members included.</p>
      {!emailHref && <p className="teams-notice" role="status">Group messaging is unavailable until every team member and the leader have an email address. Update their investment manager accounts first.</p>}
    </ModalShell>,
    document.body
  );
}

export default function TeamsPage() {
  const { user } = useUser();
  const [teams, setTeams] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [loadVersion, setLoadVersion] = useState(0);
  const [formMode, setFormMode] = useState(null);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const saving = useRef(false);
  const [viewId, setViewId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const returnFocus = useRef(null);

  useEffect(() => {
    if (!formMode && !viewId && !deleteTarget?._id) return;
    const dialog = document.querySelector(formMode || viewId ? '.teams-modal-overlay [role="dialog"]' : '.mk-overlay-top [role="dialog"]');
    if (!dialog) return;
    const main = document.querySelector("main.site-main");
    const previousInert = main?.inert;
    const previousTabIndex = dialog.getAttribute("tabindex");
    dialog.tabIndex = -1;
    if (main) main.inert = true;
    const focusableElements = () => [...dialog.querySelectorAll('a[href], button, input, select, textarea, [tabindex], [contenteditable="true"]')]
      .filter((element) => !element.disabled && element.tabIndex >= 0 && element.getAttribute("aria-disabled") !== "true" && element.getClientRects().length > 0 && getComputedStyle(element).visibility !== "hidden");
    const focusFirst = () => (focusableElements()[0] || dialog).focus();
    const keepFocusInside = (event) => {
      if (!dialog.contains(event.target)) focusFirst();
    };
    const handleTab = (event) => {
      if (event.key !== "Tab") return;
      const elements = focusableElements();
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (!first) {
        event.preventDefault();
        dialog.focus();
      } else if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleTab, true);
    document.addEventListener("focusin", keepFocusInside, true);
    if (!dialog.contains(document.activeElement)) focusFirst();
    return () => {
      document.removeEventListener("keydown", handleTab, true);
      document.removeEventListener("focusin", keepFocusInside, true);
      if (main) main.inert = previousInert;
      if (previousTabIndex === null) dialog.removeAttribute("tabindex");
      else dialog.setAttribute("tabindex", previousTabIndex);
      requestAnimationFrame(() => {
        restoreTeamTriggerFocus(returnFocus.current);
      });
    };
  }, [formMode, viewId, deleteTarget?._id]);

  useEffect(() => {
    let mounted = true;
    if (user?.role !== "supervisor" || !user?.companyId) {
      setLoading(false);
      return () => { mounted = false; };
    }
    setLoading(true);
    setLoadError("");
    const read = async (url, fallback) => {
      const response = await fetch(url, { credentials: "include", cache: "no-store" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || fallback);
      return data;
    };
    Promise.allSettled([
      read("/api/teams", "Failed to load teams"),
      read(`/api/users?role=rm&companyId=${encodeURIComponent(user.companyId)}`, "Failed to load investment managers"),
    ]).then(([teamResult, managerResult]) => {
      if (!mounted) return;
      const errors = [];
      if (teamResult.status === "fulfilled") setTeams(Array.isArray(teamResult.value.teams) ? teamResult.value.teams : []);
      else { setTeams([]); errors.push(teamResult.reason?.message || "Failed to load teams"); }
      if (managerResult.status === "fulfilled") {
        const rows = Array.isArray(managerResult.value.users) ? managerResult.value.users : [];
        setManagers(rows.filter((manager) => manager.role === "rm" && String(manager.companyId) === String(user.companyId) && manager.isActive !== false).sort((a, b) => managerName(a).localeCompare(managerName(b))));
      } else { setManagers([]); errors.push(managerResult.reason?.message || "Failed to load investment managers"); }
      setLoadError(errors.join(". "));
      setLoading(false);
    });
    return () => { mounted = false; };
  }, [user?.role, user?.companyId, loadVersion]);

  const restoreFocus = () => {
    requestAnimationFrame(() => {
      restoreTeamTriggerFocus(returnFocus.current);
    });
  };
  const closeForm = () => {
    if (!saving.current) { setFormMode(null); setFormError(""); restoreFocus(); }
  };
  const openAdd = (event) => {
    returnFocus.current = event?.currentTarget || document.activeElement;
    setEditId(null);
    setForm(emptyForm());
    setFormError("");
    setFormMode("add");
  };
  const openEdit = (team, event) => {
    returnFocus.current = event?.currentTarget || document.activeElement;
    setEditId(team._id);
    setForm({ name: team.name || "", leaderUserId: String(team.leaderUserId || ""), memberUserIds: team.memberUserIds?.length ? team.memberUserIds.map(String) : [""] });
    setFormError("");
    setFormMode("edit");
  };
  const handleLeaderChange = (leaderUserId) => {
    setForm((previous) => {
      const members = previous.memberUserIds.filter((id) => !id || id !== leaderUserId);
      return { ...previous, leaderUserId, memberUserIds: members.length ? members : [""] };
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving.current) return;
    const payload = { name: form.name.trim(), leaderUserId: form.leaderUserId, memberUserIds: form.memberUserIds };
    const eligibleIds = new Set(managers.map((manager) => String(manager._id)));
    if (!payload.name || payload.name.length > 120) { setFormError("Enter a team name of up to 120 characters."); return; }
    if (!eligibleIds.has(payload.leaderUserId)) { setFormError("Choose an available investment manager as team leader."); return; }
    if (!payload.memberUserIds.length || payload.memberUserIds.some((id) => !eligibleIds.has(id))) { setFormError("Choose an available investment manager in each team member field."); return; }
    if (new Set(payload.memberUserIds).size !== payload.memberUserIds.length || payload.memberUserIds.includes(payload.leaderUserId)) { setFormError("Choose each investment manager once. The leader is included separately."); return; }
    saving.current = true;
    setSubmitting(true);
    setFormError("");
    try {
      const response = await fetch(formMode === "edit" ? `/api/teams?id=${encodeURIComponent(editId)}` : "/api/teams", {
        method: formMode === "edit" ? "PATCH" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.team?._id) throw new Error(result.error || "Failed to save team. Please try again.");
      setTeams((previous) => formMode === "edit" ? previous.map((team) => team._id === result.team._id ? result.team : team) : [result.team, ...previous]);
      logUIAction(formMode === "edit" ? "record_updated" : "record_created", { title: `${formMode === "edit" ? "Edited" : "Created"} team: ${result.team.name}`, entityType: "team", entity: { id: result.team._id, name: result.team.name, leaderUserId: result.team.leaderUserId, memberUserIds: result.team.memberUserIds } });
      setFormMode(null);
      restoreFocus();
    } catch (error) {
      setFormError(error?.message || "Failed to save team. Please try again.");
    } finally {
      saving.current = false;
      setSubmitting(false);
    }
  };
  const performDelete = async () => {
    setDeleteError("");
    try {
      const response = await fetch(`/api/teams?id=${encodeURIComponent(deleteTarget._id)}`, { method: "DELETE", credentials: "include" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) throw new Error(data.error || "Failed to delete team. Please try again.");
      setTeams((previous) => previous.filter((team) => team._id !== deleteTarget._id));
      logUIAction("record_deleted", { title: `Deleted team: ${deleteTarget.name}`, entityType: "team", entity: { id: deleteTarget._id, name: deleteTarget.name, leaderUserId: deleteTarget.leaderUserId, memberUserIds: deleteTarget.memberUserIds } });
      if (viewId === deleteTarget._id) setViewId(null);
      setDeleteTarget(null);
      restoreFocus();
    } catch (error) {
      setDeleteError(error?.message || "Failed to delete team. Please try again.");
      throw error;
    }
  };

  const columns = [
    { accessorKey: "name", header: "Team Name", meta: { showTitle: true }, cell: ({ getValue }) => <span className="teams-cell-text">{getValue()}</span> },
    { id: "leaderName", header: "Team Leader", accessorFn: (team) => managerName(team.leader), meta: { showTitle: true }, cell: ({ getValue }) => <span className="teams-cell-text">{getValue()}</span> },
    { id: "memberNames", header: "Team Members", accessorFn: (team) => (team.memberUserIds || []).map((id) => managerName(teamPerson(team, id))).join(", "), meta: { showTitle: true }, cell: ({ getValue }) => <span className="teams-cell-text">{getValue() || "No members"}</span> },
    {
      id: "actions", header: "Actions", cell: ({ row }) => {
        const team = row.original;
        const leaderHref = teamEmailHref(team);
        return <div className="management-row-actions teams-row-actions">
          {leaderHref ? <a className="management-row-action is-neutral" href={leaderHref} title={`Email ${managerName(team.leader)}`} data-log-title={`Email Team Leader: ${team.name}`}><Icon name="mail" size={16} />Email Team Leader</a> : <button type="button" className="management-row-action is-neutral" disabled title="The team leader's email is unavailable"><Icon name="mail" size={16} />Email Team Leader</button>}
          <button type="button" className="management-row-action is-edit" onClick={(event) => openEdit(team, event)} data-team-id={team._id} data-team-action="edit" data-log-title={`Edit team: ${team.name}`}><Icon name="pencil" size={16} />Edit</button>
          <button type="button" className="management-row-action is-info" onClick={(event) => { returnFocus.current = event.currentTarget; setViewId(team._id); }} data-team-id={team._id} data-team-action="view" data-log-title={`View team: ${team.name}`}><Icon name="eye" size={16} />View</button>
          <button type="button" className="management-row-action is-danger" onClick={(event) => { returnFocus.current = event.currentTarget; setDeleteError(""); setDeleteTarget(team); }} data-team-id={team._id} data-team-action="delete" data-log-title={`Delete team: ${team.name}`}><Icon name="trash" size={16} />Delete</button>
        </div>;
      },
    },
  ];
  const viewedTeam = teams.find((team) => team._id === viewId);

  if (user?.role !== "supervisor") return <p className="teams-notice">Teams are managed by your Compliance Officer.</p>;

  return <>
    {loadError && <div className="teams-page-notice"><p className="teams-error" role="alert">{loadError}</p><ModalButton icon="clock" onClick={() => setLoadVersion((value) => value + 1)} data-log-title="Retry loading teams">Retry</ModalButton></div>}
    {deleteError && <p className="teams-error teams-page-notice" role="alert">{deleteError}</p>}
    <GenericTable title="Teams" description="Organize your investment managers into teams and manage their leaders and members." className="teams-page" data={teams} columns={columns} filterableFields={["name", "leaderName", "memberNames"]} loading={loading} onAddTeam={openAdd} disableRowModal />
    {formMode && <TeamFormModal mode={formMode} form={form} managers={managers} error={formError} submitting={submitting} onChange={(name) => setForm((previous) => ({ ...previous, name }))} onLeaderChange={handleLeaderChange} onMemberChange={(index, id) => setForm((previous) => ({ ...previous, memberUserIds: previous.memberUserIds.map((value, position) => position === index ? id : value) }))} onAddMember={() => setForm((previous) => ({ ...previous, memberUserIds: [...previous.memberUserIds, ""] }))} onRemoveMember={(index) => setForm((previous) => ({ ...previous, memberUserIds: previous.memberUserIds.filter((_, position) => position !== index) }))} onSubmit={handleSubmit} onClose={closeForm} />}
    {viewedTeam && <TeamDetailsModal team={viewedTeam} onClose={() => { setViewId(null); restoreFocus(); }} />}
    {deleteTarget && createPortal(<DeleteConfirmModal key={deleteTarget._id} open itemLabel={`team "${deleteTarget.name}"`} onCancel={() => { setDeleteTarget(null); setDeleteError(""); restoreFocus(); }} onConfirm={performDelete} />, document.body)}
  </>;
}
