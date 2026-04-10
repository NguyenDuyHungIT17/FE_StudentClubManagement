import React, { useState } from 'react';
import { Search, Filter, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

const EventList = ({ events, registeredIds, onRegister }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = events.filter(ev => 
    String(ev?.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: '16px',
      border: '1px solid var(--border)',
      padding: '24px'
    }}>
      {/* Header của Table */}
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Event Directory</h3>
        <div style={{ display: 'flex', gap: 12 }}>
          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-sub)" style={{ position: 'absolute', left: 12, top: 10 }} />
            <input 
              placeholder="Search events..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                background: '#0f172a', border: '1px solid var(--border)',
                color: 'white', padding: '8px 12px 8px 36px',
                borderRadius: '8px', outline: 'none', width: 240
              }}
            />
          </div>
          {/* Filter Button */}
          <button style={{
            background: '#0f172a', border: '1px solid var(--border)',
            color: 'var(--text-sub)', padding: '8px 16px',
            borderRadius: '8px', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer'
          }}>
            Status: All <Filter size={14} />
          </button>
        </div>
      </div>

      {/* Table-like List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Table Head */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr', padding: '0 16px', color: 'var(--text-sub)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>
          <div>Event Name</div>
          <div>Location</div>
          <div>Date</div>
          <div>Status</div>
          <div style={{ textAlign: 'right' }}>Actions</div>
        </div>

        {/* Rows */}
        {filtered.map(ev => {
          const isRegistered = registeredIds.includes(ev.eventId);
          return (
            <div key={ev.eventId} style={{
              display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr',
              alignItems: 'center',
              padding: '16px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '12px',
              border: '1px solid transparent',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
            >
              {/* Event Name + Desc */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                   {String(ev?.title || "?").charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{ev.title || "(No title)"}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-sub)' }}>Est. 2024</div>
                </div>
              </div>

              {/* Location */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-sub)' }}>
                <MapPin size={14} /> {ev.location || "Hall A"}
              </div>

              {/* Date */}
              <div style={{ fontSize: 14, color: 'var(--text-main)' }}>
                 {new Date(ev.eventDate).toLocaleDateString()}
              </div>

              {/* Status Badge */}
              <div>
                <span className="badge" style={{ 
                  background: ev.isPrivate ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
                  color: ev.isPrivate ? '#f59e0b' : '#10b981',
                  display: 'inline-flex', alignItems: 'center', gap: 6
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }}></span>
                  {ev.isPrivate ? "Private" : "Active"}
                </span>
              </div>

              {/* Actions */}
              <div style={{ textAlign: 'right' }}>
                <button 
                  onClick={() => onRegister(ev.eventId)}
                  disabled={isRegistered}
                  style={{
                    background: isRegistered ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                    border: isRegistered ? 'none' : '1px solid var(--border)',
                    color: isRegistered ? '#10b981' : 'var(--text-main)',
                    padding: '6px 12px', borderRadius: '6px', cursor: isRegistered ? 'default' : 'pointer', fontSize: 13
                  }}
                >
                  {isRegistered ? "Joined" : "Join"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Pagination Footer (Mock) */}
      <div className="flex-between" style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)', color: 'var(--text-sub)', fontSize: 13 }}>
        <div>Showing 1 to {filtered.length} of {events.length} results</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ background: '#0f172a', border: '1px solid var(--border)', color: 'var(--text-sub)', width: 32, height: 32, borderRadius: 6 }}>&lt;</button>
          <button style={{ background: 'var(--primary)', border: 'none', color: 'white', width: 32, height: 32, borderRadius: 6 }}>1</button>
          <button style={{ background: '#0f172a', border: '1px solid var(--border)', color: 'var(--text-sub)', width: 32, height: 32, borderRadius: 6 }}>&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default EventList;