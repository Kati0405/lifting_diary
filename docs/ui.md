# UI Coding Standards

## Component Library

**All UI components must use [shadcn/ui](https://ui.shadcn.com/) exclusively.**

- Do **not** create custom components. If a UI element is needed, find the appropriate shadcn/ui component.
- Do **not** use any other component libraries (e.g. MUI, Chakra, Radix directly, etc.).
- shadcn/ui components live in `src/components/ui/` and are added via the CLI: `npx shadcn@latest add <component>`.
- Compose complex UI by combining shadcn/ui primitives — not by writing new ones.

## Date Formatting

Use [date-fns](https://date-fns.org/) for all date formatting. Do **not** use `new Date().toLocaleDateString()`, `Intl.DateTimeFormat`, or manual string manipulation.

### Format

Dates must be displayed in the following format:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Jun 2024
```

### Implementation

```ts
import { format } from "date-fns";

format(date, "do MMM yyyy");
// 1st Sep 2025, 2nd Aug 2025, 3rd Jan 2026, 4th Jun 2024
```

The format token `do` produces the ordinal day (`1st`, `2nd`, `3rd`, `4th`, …). `MMM` produces the abbreviated month name. `yyyy` produces the 4-digit year.
