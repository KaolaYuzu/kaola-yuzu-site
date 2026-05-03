const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzQwBC6ykSOwU40XHYO4xxRs-VLaKmpw8pbR04U9a8FrXcpoucHdb0nXCJrPGQYqQEY/exec";

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: "error", message: "Method not allowed" });
  }

  try {
    const payload = req.body || {};

    if (!isValidEmail(payload.email)) {
      return res.status(400).json({ status: "error", message: "Invalid email" });
    }

    await fetch(GAS_WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: payload.email.trim().toLowerCase(),
        result_type: payload.result_type || "Newsletter lead",
        platform: payload.platform || "",
        source: payload.source || "website-newsletter"
      })
    });

    return res.status(200).json({ status: "success", message: "Submitted successfully" });
  } catch (error) {
    console.error("[subscribe] Submit failed:", error);
    return res.status(500).json({ status: "error", message: "Submit failed" });
  }
}
