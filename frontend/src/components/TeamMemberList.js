import React from 'react';

export default function TeamMemberList ({ members, onRemove, isOwner }) {
  if (!members || members.length === 0) {
    return <p className="text-muted">No team members yet.</p>;
  }

  return (
    <ul className="team-member-list">
      {members.map(m => (
        <li key={m.userId?._id || m.userId} className="team-member-item">
          <span className="team-member-name">{m.userId?.name || 'Unknown'}</span>
          <span className="team-member-email">{m.userId?.email}</span>
          <span className={`badge badge--${m.role}`}>{m.role}</span>
          {isOwner && m.role !== 'owner' && (
            <button
              className="btn btn--sm btn--danger"
              onClick={() => onRemove(m.userId?._id || m.userId)}
            >
              Remove
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
