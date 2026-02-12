import React from "react";
import { Users, Building2, Layers } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="card" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 0 }}>
    <div>
      <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-sub)", textTransform: "uppercase", marginBottom: 8 }}>{title}</p>
      <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: "var(--text-main)" }}>{value}</h2>
    </div>
    <div style={{ padding: 12, background: `${color}20`, borderRadius: 12 }}>
      <Icon size={24} color={color} />
    </div>
  </div>
);

const StatsSection = ({ usersCount, clubsCount }) => {
  return (
    <div style={{ display: "flex", gap: 24, marginBottom: 30 }}>
      <StatCard title="Total Users" value={usersCount} icon={Users} color="#3b82f6" />
      <StatCard title="Total Clubs" value={clubsCount} icon={Building2} color="#8b5cf6" />
      <StatCard title="Active Activities" value="12" icon={Layers} color="#10b981" />
    </div>
  );
};

export default StatsSection;