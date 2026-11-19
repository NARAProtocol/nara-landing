import test from "node:test";
import assert from "node:assert/strict";
import { detectSanctionedJurisdiction, enforceSanctionsGuard } from "../functions/_shared/geoblockCore.js";
import { onRequest as onMiddlewareRequest } from "../functions/_middleware.js";

test("blocks comprehensively embargoed countries (CU, IR, KP, SY) with HTTP 451", async () => {
  for (const country of ["CU", "IR", "KP", "SY"]) {
    const htmlReq = new Request("https://naraprotocol.io/vault", {
      headers: { Accept: "text/html", "CF-IPCountry": country },
    });
    const htmlRes = await onMiddlewareRequest({
      request: htmlReq,
      next: async () => new Response("ok", { status: 200 }),
    });
    assert.equal(htmlRes.status, 451, `expected 451 for ${country}`);
    assert.match(htmlRes.headers.get("content-type") || "", /text\/html/);
    assert.equal(htmlRes.headers.get("cache-control"), "no-store");
    const text = await htmlRes.text();
    assert.match(text, /Unavailable For Legal Reasons/);

    const apiReq = new Request("https://naraprotocol.io/api/quote?summary=1", {
      headers: { Accept: "application/json", "CF-IPCountry": country },
    });
    const apiRes = await onMiddlewareRequest({
      request: apiReq,
      next: async () => new Response("ok", { status: 200 }),
    });
    assert.equal(apiRes.status, 451);
    const json = await apiRes.json();
    assert.equal(json.ok, false);
    assert.equal(json.code, "SANCTIONED_JURISDICTION");
  }
});

test("blocks covered UA regions (43, 40, 14, 09, 23, 65) while allowing non-embargoed UA regions and ignoring spoofed headers when request.cf is present", () => {
  for (const region of ["43", "40", "14", "09", "23", "65"]) {
    const req = new Request("https://naraprotocol.io/", {
      headers: { "CF-IPCountry": "UA", "X-CF-Region-Code": region },
    });
    assert.equal(detectSanctionedJurisdiction(req).blocked, true, `region ${region} must be blocked`);
    const res = enforceSanctionsGuard(req);
    assert.equal(res?.status, 451);
    assert.match(res.headers.get("Strict-Transport-Security") || "", /max-age=/);
    assert.equal(res.headers.get("X-Frame-Options"), "DENY");
    assert.ok(res.headers.get("Content-Security-Policy"));
  }

  const kyivReq = new Request("https://naraprotocol.io/", {
    headers: { "CF-IPCountry": "UA", "X-CF-Region-Code": "30" },
  });
  assert.equal(detectSanctionedJurisdiction(kyivReq).blocked, false);
  assert.equal(enforceSanctionsGuard(kyivReq), null);

  // When Cloudflare populates request.cf, spoofed client X-CF-Region-Code headers are ignored
  const spoofedKyiv = new Request("https://naraprotocol.io/", {
    headers: { "CF-IPCountry": "UA", "X-CF-Region-Code": "43" },
  });
  Object.defineProperty(spoofedKyiv, "cf", { value: { country: "UA", regionCode: "30" } });
  assert.equal(detectSanctionedJurisdiction(spoofedKyiv).blocked, false);

  const spoofedBypass = new Request("https://naraprotocol.io/", {
    headers: { "CF-IPCountry": "UA", "X-CF-Region-Code": "30" },
  });
  Object.defineProperty(spoofedBypass, "cf", { value: { country: "UA", regionCode: "23" } });
  assert.equal(detectSanctionedJurisdiction(spoofedBypass).blocked, true);
});

test("keeps legal notices, WebAuthn ROR, and read-only supply APIs exempt from 451", async () => {
  for (const exemptPath of [
    "/.well-known/webauthn",
    "/.well-known/security.txt",
    "/privacy",
    "/terms",
    "/accessibility",
    "/api/supply",
    "/api/circulating-supply",
    "/api/total-supply",
  ]) {
    const req = new Request(`https://naraprotocol.io${exemptPath}`, {
      headers: { "CF-IPCountry": "IR" },
    });
    const res = await onMiddlewareRequest({
      request: req,
      next: async () => new Response("passed-through", { status: 200 }),
    });
    assert.equal(res.status, 200, `${exemptPath} must remain reachable`);
  }
});
