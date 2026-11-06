# world — integration session log

Running log written while we build. Each entry: time (IST), what we tried, what we expected, what happened, repro steps, how we fixed or worked around it. This is the raw source for the sponsor feedback files and the submission form.

| Time (IST) | Step | Expected | Actual | Repro / notes |
|---|---|---|---|---|
| 06 Nov 07:14 | Sign in to World IdP portal (auth.world.org/portal) for Agent Pass client | Google sign-in opens the portal | `{"error":"account_not_eligible"}` on the Google callback. Login page says "Sign in with your enterprise Google account": personal Gmail is rejected, and the track page doesn't mention this | Open auth.world.org/portal → Continue with Google → personal @gmail.com account |
| 06 Nov 07:15 | developer.world.org (IDKit) sign-in | Team + app creation | Worked: team "Paradigm" created; portal also offers "Set up MCP via API key" | — |
