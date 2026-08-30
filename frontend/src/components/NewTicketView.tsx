import { useState } from "react";
import type { SyntheticEvent } from "react";
import { api } from "../api.js";
import { strings } from "../constants/strings.js";
import { FEEDBACK_ACTIONS } from "../types/types.js";
import type { DraftResponse, FeedbackAction, NewTicketViewProps } from "../types/types.js";
import EvidenceCard from "./EvidenceCard.js";
import "../styles/new-ticket.css";

const FEEDBACK_STATUS = {
  DRAFTED: "drafted",
  FLAGGED_FOR_HUMAN: "flagged_for_human"
} as const;

const STAGE = {
  IDLE: "idle",
  LOADING: "loading",
  RESULT: "result",
  DONE: "done"
} as const;

type TicketState = {
  message: string;
  stage: (typeof STAGE)[keyof typeof STAGE];
  result: DraftResponse | null;
  editedText: string;
  isEditing: boolean;
  doneNote: string;
  error: string;
};

const initialState: TicketState = {
  message: "",
  stage: STAGE.IDLE,
  result: null,
  editedText: "",
  isEditing: false,
  doneNote: "",
  error: ""
};

export default function NewTicketView({ onArchiveChanged }: NewTicketViewProps) {
  const [state, setState] = useState<TicketState>(initialState);

  const updateState = <K extends keyof TicketState>(key: K, value: TicketState[K]) => {
    setState((current) => ({ ...current, [key]: value }));
  };

  const reset = () => setState(initialState);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!state.message.trim()) return;

    setState((current) => ({ ...current, error: "", stage: STAGE.LOADING }));

    try {
      const data = await api.getDraft(state.message);
      setState((current) => ({
        ...current,
        result: data,
        editedText: data.status === FEEDBACK_STATUS.DRAFTED ? data.draft : "",
        isEditing: false,
        stage: STAGE.RESULT
      }));
    } catch (err) {
      setState((current) => ({
        ...current,
        error: err instanceof Error ? err.message : String(err),
        stage: STAGE.IDLE
      }));
    }
  }

  async function handleDecision(action: FeedbackAction) {
    if (!state.result || state.result.status !== FEEDBACK_STATUS.DRAFTED) return;

    try {
      const response = await api.sendFeedback({
        action,
        message: state.message,
        draft: state.result.draft,
        finalReply: action === FEEDBACK_ACTIONS.EDIT ? state.editedText : undefined,
        topScore: state.result.topScore,
        category: state.result.matches[0]?.category
      });

      const note = action === FEEDBACK_ACTIONS.REJECT
        ? strings.ticket.rejected
        : response.savedToArchive
        ? strings.ticket.saved
        : strings.ticket.recorded;

      setState((current) => ({ ...current, doneNote: note, stage: STAGE.DONE }));
      onArchiveChanged();
    } catch (err) {
      setState((current) => ({
        ...current,
        error: err instanceof Error ? err.message : String(err)
      }));
    }
  }

  return (
    <div className="ticket-view">
      <form className="message-form" onSubmit={handleSubmit}>
        <label htmlFor="customer-message">{strings.ticket.messageLabel}</label>
        <textarea
          id="customer-message"
          rows={4}
          placeholder={strings.ticket.messagePlaceholder}
          value={state.message}
          onChange={(event) => updateState("message", event.target.value)}
          disabled={state.stage === STAGE.LOADING || state.stage === STAGE.RESULT}
        />
        {state.stage === STAGE.IDLE && (
          <button type="submit" className="btn btn-primary" disabled={!state.message.trim()}>
            {strings.ticket.findDraft}
          </button>
        )}
      </form>

      {state.error && <p className="form-error">{state.error}</p>}
      {state.stage === STAGE.LOADING && <p className="status-line">{strings.ticket.searching}</p>}

      {state.stage === STAGE.RESULT && state.result?.status === FEEDBACK_STATUS.FLAGGED_FOR_HUMAN && (
        <div className="panel panel-flag">
          <div className="panel-heading">
            <span className="badge badge-flag">{strings.ticket.flaggedBadge(state.result.topScore)}</span>
          </div>
          <p>{strings.ticket.flaggedMessage}</p>
          {state.result.matches.length > 0 && (
            <details className="closest-context">
              <summary>{strings.ticket.closestCases}</summary>
              <ul className="evidence-list">
                {state.result.matches.map((match) => <EvidenceCard key={match.id} match={match} />)}
              </ul>
            </details>
          )}
          <button className="btn btn-ghost" onClick={reset}>{strings.ticket.startAnother}</button>
        </div>
      )}

      {state.stage === STAGE.RESULT && state.result?.status === FEEDBACK_STATUS.DRAFTED && (
        <div className="panel panel-drafted">
          <div className="panel-heading">
            <span className="badge badge-evidence">{strings.ticket.groundedBadge(state.result.topScore)}</span>
          </div>

          {!state.isEditing ? (
            <p className="draft-text">{state.result.draft}</p>
          ) : (
            <textarea
              className="draft-editor"
              rows={6}
              value={state.editedText}
              onChange={(event) => updateState("editedText", event.target.value)}
            />
          )}

          <div className="decision-row">
            {!state.isEditing ? (
              <>
                <button className="btn btn-approve" onClick={() => handleDecision(FEEDBACK_ACTIONS.APPROVE)}>{strings.ticket.approve}</button>
                <button className="btn btn-ghost" onClick={() => updateState("isEditing", true)}>{strings.ticket.edit}</button>
                <button className="btn btn-reject" onClick={() => handleDecision(FEEDBACK_ACTIONS.REJECT)}>{strings.ticket.reject}</button>
              </>
            ) : (
              <>
                <button className="btn btn-approve" onClick={() => handleDecision(FEEDBACK_ACTIONS.EDIT)}>{strings.ticket.saveEditedReply}</button>
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    if (state.result?.status === FEEDBACK_STATUS.DRAFTED) {
                      updateState("isEditing", false);
                      updateState("editedText", state.result.draft);
                    }
                  }}
                >
                  {strings.ticket.cancelEdit}
                </button>
              </>
            )}
          </div>

          <div className="grounding-section">
            <p className="grounding-label">{strings.ticket.groundedIn(state.result.matches.length)}</p>
            <ul className="evidence-list">
              {state.result.matches.map((match) => <EvidenceCard key={match.id} match={match} />)}
            </ul>
          </div>
        </div>
      )}

      {state.stage === STAGE.DONE && (
        <div className="panel panel-done">
          <p>{state.doneNote}</p>
          <button className="btn btn-primary" onClick={reset}>{strings.ticket.draftAnother}</button>
        </div>
      )}
    </div>
  );
}
