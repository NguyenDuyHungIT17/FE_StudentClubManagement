import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Building2, CheckCircle2 } from "lucide-react";
import PublicHeader from "../components/public/PublicHeader";
import PublicFooter from "../components/public/PublicFooter";
import { API_BASE_URL } from "../services/api";
import { campaignService } from "../services/campaignService";
import { interviewService } from "../services/interviewService";
import { photoService } from "../services/photoService";
import "../styles/PublicPortal.css";

const DOMAIN_URL = API_BASE_URL.replace("/api", "");

const PublicApplyCampaign = () => {
  const { campaignId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(location.state?.campaign || null);
  const [clubName, setClubName] = useState(location.state?.clubName || "Câu lạc bộ");
  const [loading, setLoading] = useState(!location.state?.campaign);
  const [campaignPhotos, setCampaignPhotos] = useState([]);

  const [form, setForm] = useState({ applicantName: "", applicantEmail: "", applicantPhone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const getImageUrl = (rawUrl) => {
    if (!rawUrl) return "";
    if (String(rawUrl).startsWith("http")) return rawUrl;
    return `${DOMAIN_URL}${rawUrl}`;
  };

  useEffect(() => {
    if (campaign) return;

    const fetchCampaign = async () => {
      setLoading(true);
      try {
        const found = await campaignService.getById(campaignId);
        setCampaign(found || null);
        if (found?.clubName) setClubName(found.clubName);
      } catch {
        try {
          const res = await fetch(`${API_BASE_URL}/Campaign?isActive=true&pageSize=100`);
          const json = await res.json().catch(() => []);
          const list = Array.isArray(json) ? json : (json?.data || json?.items || []);
          const found = list.find((c) => String(c.campaignId) === String(campaignId));
          setCampaign(found || null);
          if (found?.clubName) setClubName(found.clubName);
        } catch {
          setCampaign(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [campaignId, campaign]);

  useEffect(() => {
    if (!campaign?.campaignId) return;

    const fetchCampaignPhotos = async () => {
      try {
        const response = await photoService.getByCampaign(campaign.campaignId);
        const items = photoService.normalizePhotos(response);
        setCampaignPhotos(items);
      } catch {
        setCampaignPhotos([]);
      }
    };

    fetchCampaignPhotos();
  }, [campaign?.campaignId]);

  const deadline = useMemo(() => {
    if (!campaign?.endDate) return "Không giới hạn";
    return new Date(campaign.endDate).toLocaleDateString("vi-VN");
  }, [campaign]);

  const onSubmitApply = async (e) => {
    e.preventDefault();
    if (!campaign) return;

    setSubmitting(true);
    setError("");
    try {
      await interviewService.createWeb({
        clubId: campaign.clubId,
        campaignId: campaign.campaignId,
        applicantName: form.applicantName.trim(),
        applicantEmail: form.applicantEmail.trim(),
        applicantPhone: form.applicantPhone.trim()
      });

      setSuccess(true);
      setForm({ applicantName: "", applicantEmail: "", applicantPhone: "" });
    } catch (err) {
      setError(err?.message || "Không thể gửi hồ sơ lúc này.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="public-portal-escape">
      <PublicHeader />

      <main style={{ padding: "44px 0 60px" }}>
        <div className="portal-container">
          <button className="portal-btn portal-btn-outline" onClick={() => navigate("/public")} style={{ marginBottom: 20 }}>
            <ArrowLeft size={16} /> Quay lại trang Public
          </button>

          {loading ? (
            <div style={{ background: "#fff", borderRadius: 20, padding: 24, border: "1px solid #e2e8f0" }}>Đang tải đợt tuyển...</div>
          ) : !campaign ? (
            <div style={{ background: "#fff", borderRadius: 20, padding: 24, border: "1px solid #fee2e2", color: "#b91c1c" }}>
              Không tìm thấy đợt tuyển. Có thể endpoint chưa trả campaign này.
            </div>
          ) : (
            <div className="portal-row">
              <div className="portal-col-6">
                <div style={{ background: "#fff", borderRadius: 24, border: "1px solid #e2e8f0", padding: 28, boxShadow: "0 10px 30px rgba(2,6,23,0.05)" }}>
                  <div className="portal-badge" style={{ marginBottom: 10 }}>APPLY NOW</div>
                  <h1 style={{ margin: "0 0 10px", fontSize: 34, lineHeight: 1.2, color: "#0f172a", fontWeight: 900 }}>{campaign.title}</h1>

                  {campaign.photoUrl && (
                    <div style={{ marginBottom: 14, borderRadius: 14, overflow: "hidden", border: "1px solid #e2e8f0" }}>
                      <img src={getImageUrl(campaign.photoUrl)} alt={campaign.title} style={{ width: "100%", maxHeight: 260, objectFit: "cover", display: "block" }} />
                    </div>
                  )}

                  <div style={{ display: "grid", gap: 10 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", color: "#334155" }}>
                      <Building2 size={16} /> {clubName}
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", color: "#334155" }}>
                      <Calendar size={16} /> Hạn nộp: {deadline}
                    </div>
                  </div>

                  <div style={{ borderTop: "1px solid #e2e8f0", marginTop: 16, paddingTop: 16, color: "#475569", lineHeight: 1.7 }}>
                    Hồ sơ của bạn sẽ được gửi vào hệ thống phỏng vấn walk-in. Hãy nhập thông tin chính xác để CLB liên hệ.
                  </div>

                  {campaignPhotos.length > 1 && (
                    <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
                      {campaignPhotos.slice(0, 6).map((p) => (
                        <img key={p.photoId || p.id} src={getImageUrl(p.url)} alt={p.title || campaign.title} style={{ width: "100%", height: 72, objectFit: "cover", borderRadius: 8, border: "1px solid #e2e8f0" }} />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="portal-col-6">
                <div style={{ background: "linear-gradient(145deg,#fff,#f8fafc)", borderRadius: 24, border: "1px solid #e2e8f0", padding: 24, boxShadow: "0 10px 30px rgba(2,6,23,0.05)" }}>
                  <h2 style={{ margin: 0, fontSize: 22, color: "#0f172a", fontWeight: 900 }}>Nộp hồ sơ ứng tuyển</h2>
                  <p style={{ color: "#64748b", marginTop: 8, marginBottom: 16 }}>Điền thông tin để gửi hồ sơ ngay.</p>

                  {success && (
                    <div style={{ background: "#ecfdf5", border: "1px solid #bbf7d0", color: "#047857", borderRadius: 12, padding: 12, marginBottom: 12, display: "flex", gap: 8, alignItems: "center" }}>
                      <CheckCircle2 size={18} /> Nộp hồ sơ thành công. CLB sẽ liên hệ sớm.
                    </div>
                  )}

                  {error && (
                    <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: 12, padding: 12, marginBottom: 12 }}>
                      {error}
                    </div>
                  )}

                  {!success && (
                    <form onSubmit={onSubmitApply} style={{ display: "grid", gap: 12 }}>
                      <div>
                        <label style={{ display: "block", marginBottom: 6, fontWeight: 700, color: "#334155" }}>Họ tên</label>
                        <input required className="portal-input" value={form.applicantName} onChange={(e) => setForm((p) => ({ ...p, applicantName: e.target.value }))} />
                      </div>
                      <div>
                        <label style={{ display: "block", marginBottom: 6, fontWeight: 700, color: "#334155" }}>Email</label>
                        <input required type="email" className="portal-input" value={form.applicantEmail} onChange={(e) => setForm((p) => ({ ...p, applicantEmail: e.target.value }))} />
                      </div>
                      <div>
                        <label style={{ display: "block", marginBottom: 6, fontWeight: 700, color: "#334155" }}>Số điện thoại</label>
                        <input required className="portal-input" value={form.applicantPhone} onChange={(e) => setForm((p) => ({ ...p, applicantPhone: e.target.value }))} />
                      </div>

                      <button className="portal-btn" type="submit" disabled={submitting}>
                        {submitting ? "Đang gửi..." : "Nộp hồ sơ"}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default PublicApplyCampaign;
