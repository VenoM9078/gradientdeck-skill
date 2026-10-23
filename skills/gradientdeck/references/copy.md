# Copy

Words are part of the interface. They decide whether a page says something only this product could say, and whether people know what will happen when they act. Write the copy before you style it; layout built around placeholder text breaks when real words arrive.

## Decide

1. **Who reads this, and what do they already know?** A tax adviser, a teenager and an on-call engineer need different vocabulary, sentence length and warmth. Write down the reader in one line.
2. **What voice fits that reader and this product?** Pick it from the audience and the subject, not from the habit of sounding like a friendly startup. A clinical product may be precise and calm; a hobby tool may be loose. Inherit an existing voice guide or the tone of existing screens if there is one.
3. **What is the one thing this text must get across?** One message per headline, one action per button.
4. **What words do users actually use?** Take nouns from the product's domain and the codebase (the real feature names, the real objects), not from marketing synonyms.

## Rules

### Headlines and subcopy (mostly Persuade)

- SHOULD state the specific value: what the product does, for whom, with what result. **Test:** could a competitor's site use this headline unchanged? If yes, rewrite it.
- SHOULD put the concrete noun in the headline ("Payroll for restaurants with tipped staff"), not an abstract promise ("Work smarter").
- Subcopy SHOULD add information the headline doesn't have: how it works, who it's for, what it replaces. If it restates the headline in more words, cut it.
- AVOID headlines that need the image beside them to make sense.

### Calls to action

- SHOULD name the action and its object: "Create invoice", "Book a demo", "Download the report (PDF, 2 MB)". The label says what happens on click.
- SHOULD keep the same verb through a flow: a button labelled "Send invite" leads to a dialog titled "Send invite" and a confirmation "Invite sent".
- AVOID two buttons with equal weight and vague labels ("Get started" / "Learn more"). If there are two, the second names a different action.

### States and tense

- Action labels are imperative; results are past tense: "Publish" → "Publishing…" → "Published". "Save" → "Saved 2 min ago".
- Toggles and status labels describe the current state, not the action, unless they are buttons. A switch reads "Notifications", not "Turn on notifications".
- Use the ellipsis on a label only when the action opens a step that asks for more input ("Rename…").

### Errors

- MUST say what happened, why if known, and what to do next, in that order: "Card declined. Your bank refused the charge. Try another card or contact your bank."
- SHOULD NOT apologise by reflex or blame the user ("You entered an invalid date"). State the fact: "Use a date after 1 Jan 2026."
- NEVER show an error code alone. A code may follow the message for support ("Reference: 4F2A").
- Field errors sit next to the field and name the field. Form-level errors summarise and link to each field (see `accessibility.md`).
- Keep the user's input. An error never clears what they typed.

### Empty states

- SHOULD tell people why it's empty and what to do next, with the action right there: "No invoices yet. Create one, or import from a spreadsheet."
- Distinguish first-use empty, filtered-to-nothing ("No results for 'acme'. Clear filters") and cleared-out ("All caught up"). Each needs different words.

### Microcopy

- Button labels: one to three words, verb first, sentence case.
- Field labels: a noun, visible, above or beside the field. Placeholder text is not a label (`interaction.md`).
- Helper text says the constraint before the error does ("At least 12 characters").
- Tooltips add information; they never hold the only copy of something essential, and never repeat the visible label.
- Pick one case style for UI labels (sentence case is easiest to read) and keep it everywhere.

### Numbers, units and dates

- SHOULD format with the user's locale (thousands separators, decimal mark, currency position). Use the platform's number and date formatters, not string concatenation.
- Keep a number and its unit together with a non-breaking space ("12 GB"), and use the same unit throughout a view.
- Round to the precision people act on. "4.2k" in a summary; the exact figure in the detail or on hover.
- Use unambiguous dates ("3 Apr 2026", not "03/04/26"). Relative time ("5 min ago") for recent events, with the absolute timestamp available on hover or focus.
- Ranges use an en dash ("10–20"); negative numbers use a real minus sign or a clear "−" in data.

### Honesty

- NEVER invent claims, metrics, customer names, quotes or ratings (SKILL.md rule).
- NEVER write urgency or scarcity that isn't true ("Only 2 left", countdown timers on evergreen offers).
- Facts and demo content differ. Demo content (a sample entry, a name in a product demo, example data) is authored at full quality and labelled as an example. Facts (dates, prices, contacts) are written around instead of printed as gaps. No date yet: "New dates go out to the list first". No price: "Ask for a quote". No email: the contact form or the channel the user did give. If a sentence can't stand without the fact, cut the sentence. Mark the spot with an HTML comment and list it in your report. No bracketed placeholders, "TBD" or lorem ipsum in visible text.

### Length and readability

- Cut every word that doesn't change the meaning. "In order to" → "to"; "Click here to download" → "Download".
- Front-load: the key word goes first in headings, list items and labels, because people scan the first two words.
- SHOULD aim for sentences under about 20 words in UI text, and one idea per sentence.
- Use plain words over jargon unless the audience shares the jargon. Developer tools can say "webhook"; a consumer app shouldn't.

### Inclusive language

- Address people directly ("you"); avoid gendered defaults, idioms and culture-bound jokes that won't translate.
- Describe what to do, not how to do it physically: "Select", not "Click" or "Tap", when it could be either.
- Leave room for translation: allow labels to grow 30–40% without breaking the layout.

## Generic defaults to catch

The general cadence tells (hype words, "not just X but Y", triplets, em-dash rhythm, rhetorical headlines) are listed in `tells.md`. Specific to copy:

- **Headline that fits any product** ("Build faster", "The platform for modern teams") → no information → name the user, the job and the outcome.
- **"Oops! Something went wrong"** → cute and useless → what happened, why, what to do.
- **"No data"** as an empty state → a dead end → why it's empty plus the next action.
- **"Submit", "OK", "Yes"** as button labels → the user has to read the question again → name the action ("Delete 3 files").
- **Exclamation marks on routine success** ("Saved!") → shouting → plain past tense.
- **Feature lists of abstract nouns** ("Speed. Security. Scale.") → says nothing → one concrete sentence per feature, or show it.
- **Every heading the same length and shape** → reads generated → let headings vary with what they need to say.

## Check

- [ ] The headline would not fit a competitor unchanged.
- [ ] Subcopy adds a fact the headline doesn't contain.
- [ ] Every button names its action; no "Submit", "OK" or lone "Learn more".
- [ ] States move imperative → progressive → past ("Save" → "Saving…" → "Saved").
- [ ] Every error says what happened and what to do, without a bare code or blame.
- [ ] Every empty state offers a next action; filtered-empty offers "Clear filters".
- [ ] Numbers and dates are locale-formatted, units consistent, dates unambiguous.
- [ ] No invented claims; missing facts are written around or cut, never shown as placeholders, and listed in the report.
- [ ] One case style for labels; no placeholder used as a label.
- [ ] No sentence survives that loses nothing when deleted.
