import React from "react";
import { X } from "lucide-react";

const Modal = ({ title, onClose, children, maxWidth = "500px" }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: maxWidth }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "var(--primary)" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-sub)" }}>
            <X size={24} />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;