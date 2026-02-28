import React, { useEffect, useState } from 'react';
import api from '../services/api';
import TeamMemberList from '../components/TeamMemberList';
import { useAuth } from '../context/AuthContext';

export default function TeamPage () {
  const { user } = useAuth();
  const [team,    setTeam]  = useState(null);
  const [email,   setEmail] = useState('');
  const [error,   setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/team')
      .then(r => setTeam(r.data.team))
      .catch(() => setTeam(null))
      .finally(() => setLoading(false));
  }, []);

  const createTeam = async () => {
    const name = prompt('Team name:');
    if (!name) return;
    try {
      const r = await api.post('/team', { name });
      setTeam(r.data.team);
    } catch (e) {
      setError(e.response?.data?.error || 'Error creating team');
    }
  };

  const addMember = async (e) => {
    e.preventDefault();
    try {
      const r = await api.post('/team/members', { email });
      setTeam(r.data.team);
      setEmail('');
    } catch (e) {
      setError(e.response?.data?.error || 'Error adding member');
    }
  };

  const removeMember = async (memberId) => {
    try {
      const r = await api.delete(`/team/members/${memberId}`);
      setTeam(r.data.team);
    } catch (e) {
      setError(e.response?.data?.error || 'Error removing member');
    }
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div className="page-team">
      <h1>Team Management</h1>
      {error && <p className="error">{error}</p>}

      {!team ? (
        <button className="btn btn--primary" onClick={createTeam}>Create a Team</button>
      ) : (
        <>
          <h2>{team.name}</h2>
          <p>Seats: {team.members.length} / {team.seats}</p>
          <TeamMemberList
            members={team.members}
            onRemove={removeMember}
            isOwner={String(team.ownerId) === String(user?.id)}
          />
          <form onSubmit={addMember} className="add-member-form">
            <input
              type="email"
              placeholder="Member email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button className="btn btn--primary" type="submit">Add Member</button>
          </form>
        </>
      )}
    </div>
  );
}
