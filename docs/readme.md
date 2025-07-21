🧠 GitHub Copilot Custom Instruction Guide
📌 Project Overview
This codebase is a modern React 18 migration of a legacy banking app originally built with React 16 class components. The new architecture follows Function Components, Vite for bundling, and strict adherence to TypeScript, TDD, and Clean Architecture. Every module must align with SOC, DRY, and SOLID principles.

🚀 Project Goals
Rewrite React 16 class components into modular, performant React 18 functional components using hooks

Follow Test-Driven Development (TDD) practices

Maintain code quality via ESLint (Airbnb rules) and Prettier

Ensure high test coverage with Jest and React Testing Library

Enforce scalable architecture using folder-by-feature structure

All components and modules should be testable, composable, and reusable

🧱 Tech Stack & Tools
Tool/Library	Purpose
React 18	UI framework
Vite	Fast modern bundler
TypeScript	Static typing
Jest + React Testing Library	Unit & integration testing
MSW (Mock Service Worker)	API mocking in tests
ESLint (Airbnb config)	Code linting
Prettier	Code formatting
Husky + lint-staged	Git pre-commit validation
React Router v6+	Routing
Zustand / Context API	State management (depending on module)
Axios or Fetch	API client
Dotenv	Environment variable management

📁 Project Structure
bash
Copy
Edit
/src
├── modules/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── __tests__/
│   │   └── index.ts
│   ├── transactions/
│   └── dashboard/
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   ├── types/
│   └── constants/
├── app/
│   ├── routes.tsx
│   ├── App.tsx
│   └── main.tsx
🧪 TDD-Driven Workflow
Every module/component follows Red ➝ Green ➝ Refactor:

Write a failing test (*.test.tsx) for each feature or component

Implement only the code required to make the test pass

Refactor for readability, reuse, and performance

Repeat for every small unit of behavior

Use:

describe blocks for grouping tests by behavior

it/test blocks for individual expectations

beforeEach for setup

jest.mock and msw to isolate behavior

💡 Design & Architecture Best Practices
✅ General Rules
Always write tests first

Every component must be under 150 lines (SOC)

Avoid mixing concerns: UI, logic, and side effects must live in different files

Services must never import UI components

Prefer composition over inheritance

🧩 SOC
Each module is isolated to a feature: auth, dashboard, etc.

UI → in components/

Business logic → in hooks/

Side effects / API → in services/

Types → in types/

Tests → in __tests__/

♻️ DRY
No duplicated validation or transformation logic

All utilities go into /shared/utils

Shared styles (e.g., buttons, themes) in /shared/components

🧠 SOLID
Principle	Implementation Example
S: Single Responsibility	LoginButton.tsx only renders, useLogin.ts handles auth logic
O: Open/Closed	New bank products added by composing new ProductCard, not modifying old ones
L: Liskov	Swap FakeAuthService in tests without modifying consumers
I: Interface Segregation	Only pass needed props to each child
D: Dependency Inversion	Inject API clients into hooks instead of importing them directly

✨ Code Style Conventions
🧾 ECMAScript & TypeScript
Follow ES2020+ syntax

Prefer const and let, never var

Always type variables and props explicitly

Avoid any, use unknown or generics when needed

🔍 ESLint Config
Use Airbnb style guide, enforced via:

jsonc
Copy
Edit
{
  "extends": [
    "airbnb",
    "airbnb/hooks",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off"
  }
}
Run with: npm run lint

🎨 Prettier Formatting
Prettier config:

json
Copy
Edit
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "trailingComma": "es5"
}
Format on save in VSCode

Run: npm run format

🧼 Clean Code Practices
✅ Do:

Use React.FC<Props> or typed function components

Extract logic to custom hooks

Modularize components

Use useMemo, useCallback sparingly

Keep JSX clean and readable

❌ Avoid:

Large monolithic components

Inline API calls in components

Magic values (setTimeout(500)) – use constants

Direct DOM access – use refs and effects

Deeply nested ternaries or ifs

🤖 Copilot Guidance
When Copilot is generating code, ensure:

Always writes a test before implementation

Uses modern ES2020+ syntax and TypeScript

Uses function components, not class

Follows Vite module structure

Avoids duplication across hooks/components

Suggests reusable utilities when logic is repeated

Auto-sorts imports and applies Prettier formatting

🧪 Sample Copilot Output Expectation
tsx
Copy
Edit
// Good: Hook first
// hooks/useTransaction.ts
export function useTransaction(id: string) {
  const [data, setData] = useState(null)
  useEffect(() => {
    getTransaction(id).then(setData)
  }, [id])
  return data
}

// __tests__/useTransaction.test.ts
test('fetches transaction data', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useTransaction('123'))
  await waitForNextUpdate()
  expect(result.current).toEqual(mockedTransaction)
})
✅ Commit & PR Checklist
Before every pull request:

 ✅ All tests pass locally (npm run test)

 🧼 ESLint reports 0 errors (npm run lint)

 🎨 Code is formatted (npm run format)

 📦 No new untracked node_modules

 📝 PR includes test plan + screenshots (if applicable)

 🔍 No console.log, debugger, or hardcoded URLs

