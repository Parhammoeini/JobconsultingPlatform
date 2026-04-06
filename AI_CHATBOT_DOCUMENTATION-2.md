# PathFinder AI — Technical Documentation

> **Hybrid Reasoning Engine** integrated into the Job Consulting Platform.
> Bridges static business rules with dynamic machine learning analysis to deliver context-aware career guidance.

---

## 1. System Overview

PathFinder AI is a specialized career-path assistant embedded in the Job Consulting Platform. It operates as a **Hybrid Reasoning Engine** — combining deterministic heuristics for well-defined queries with machine learning for open-ended biographical analysis.

---

## 2. Technical Architecture

The chatbot operates on a **Dual-Layer Logic Flow**:

```
User Input
    │
    ├──► Layer 1: Intent Recognition (Heuristic)
    │         .toLowerCase() · keyword matching
    │         Handles: Booking, Payments, Status, Services
    │
    └──► Layer 2: Bio Assessment (Machine Learning)
              Local CS keyword check (instant path)
              └──► suggestServices({ bio }) API call
                    └── Fallback: offline Resume Review recommendation
```

---

### Layer 1 — Intent Recognition (Heuristic)

**Mechanism:** Input is normalized with `.toLowerCase()` and evaluated against a priority-ordered chain of `if / else if` conditions. No regex — plain keyword inclusion checks via `.includes()`.

**Function:** Handles high-confidence, well-defined business queries.

| Trigger keywords | Response behavior |
|---|---|
| `"how do i book"`, `"process"` | Returns the 4-step booking workflow |
| `"payment"`, `"pay"`, `"cost"` | Explains the **Strategy Design Pattern** (Credit Card vs. PayPal) |
| `"status"`, `"where is my"` | Directs user to the My Journey tracker |
| `"services"`, `"expert"`, `"help"` | Lists all 6 Core Service Tracks |

---

### Layer 2 — Bio Assessment (Machine Learning)

Activates when no Layer 1 keyword matches and the input is longer than 15 characters, or contains `"i am"` / `"background"`.

**Two-path resolution:**

**Path A — Instant local match (CS keywords):** If the input contains `"cs"` or `"computer science"`, the response is generated locally without an API call, for a fast, "instant smart" feel.

**Path B — Live API call:** All other biographical inputs are sent to `suggestServices({ bio: userQuery })`, which returns a `recommendedService` and `reason` from the backend.

**Fail-safe:** If the API call throws (network error, service down), the `catch` block responds with an offline fallback — defaulting to a **Resume Review** recommendation.

```
Bio input (length > 15 or "i am" / "background")
    │
    ├── contains "cs" / "computer science"?
    │       └──► Local response (Mock Interview + Resume Review)
    │
    └── everything else
            └──► suggestServices() API call
                    ├── Success → recommendedService + reason
                    └── Error  → offline fallback (Resume Review)
```

| Property | Detail |
|---|---|
| Local shortcut | `cs`, `computer science` keyword check |
| API call | `suggestServices({ bio: userQuery })` |
| API response fields | `recommendedService`, `reason` |
| Fail-safe | `catch` block — offline Resume Review response |

---

## 3. Implementation Details — `handleAiConsult` (`App.jsx`)

The core function is `async` with an `await` on the API call, keeping the UI non-blocking throughout.

| Feature | Implementation | Purpose |
|---|---|---|
| State management | `chatHistory` (Array via `setChatHistory`) | Maintains a session-based conversation log |
| Input source | `profile.trim()` → local `userQuery` | Decouples the query from state before async execution |
| Input normalizer | `.toLowerCase()` → `lowerInput` | Ensures case-insensitive keyword matching |
| Loading state | `setLoading(true/false)` | Drives the "Analyzing background…" UI indicator |
| Async handling | `try / catch` block | Prevents crashes if the AI microservice is unreachable |
| Post-response cleanup | `setProfile("")` | Clears the input field after the response is appended |

---

## 4. Interaction Test Cases

Three trigger prompts designed to demonstrate the bot's reasoning across distinct pathways.

---

### Test 1 — Strategy Trigger

**Tests:** Layer 1 · Payment keyword match · Backend architecture awareness

**Prompt:**
```
"How do I pay and is it secure?"
```

**Expected response:** The AI explains that the backend uses the **Strategy Design Pattern** to toggle seamlessly between Credit Card and PayPal processing.

---

### Test 2 — Academic Trigger

**Tests:** Layer 2 · Local CS keyword shortcut (no API call)

**Prompt:**
```
"I am a CS student at York."
```

**Expected response:** Matches `"cs"` locally — AI recommends a **Mock Interview** to prep for technical rounds and a **Resume Review** for projects. No API call is made.

---

### Test 3 — Process Trigger

**Tests:** Layer 1 · Booking workflow keyword match

**Prompt:**
```
"What is the booking process?"
```

**Expected response:** The AI returns the 4-step booking workflow:

> Browse Available Services → Click Request → Wait for Consultant Approval → Once Approved, click **Pay Now** in your Journey Tracker.
