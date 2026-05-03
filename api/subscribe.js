const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzQwBC6ykSOwU40XHYO4xxRs-VLaKmpw8pbR04U9a8FrXcpoucHdb0nXCJrPGQYqQEY/exec";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: "error", message: "Method not allowed" });
  }

  try {
    const payload = req.body || {};

    await fetch(GAS_WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    return res.status(200).json({
      status: "success",
      message: "Submitted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Submit failed"
    });
  }
}
