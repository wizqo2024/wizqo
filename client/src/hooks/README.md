# Custom Hooks Documentation

## usePlanChat

**Location:** `client/src/hooks/usePlanChat.ts`

**Purpose:** Manages all chat-related state and logic for the plan generation interface.

### ⚠️ Important Usage Notes

**CRITICAL:** When using this hook, you MUST declare dependencies BEFORE calling the hook:

```tsx
// ✅ CORRECT ORDER:
const { user } = useAuth();
const [planData, setPlanData] = useState<PlanData | null>(null);
const planProgressTimerRef = useRef<number | null>(null);

const chat = usePlanChat({
  onGeneratePlan,
  initialPlanData,
  planData,  // ← Must be defined above
  onPlanGenerated: (plan) => setPlanData(plan),
  onPlanIdSet,
  onShowAuthModal,
  planProgressTimerRef,  // ← Must be defined above
});

// ❌ WRONG - Will cause runtime error:
const chat = usePlanChat({ planData, ... });  // planData not defined yet!
const [planData, setPlanData] = useState(null);
```

### What This Hook Manages

- **Chat State:**
  - `messages` - Array of chat messages
  - `currentInput` - Current user input
  - `selectedHobby` - Selected hobby name
  - `quizAnswers` - User's quiz answers
  - `currentStep` - Current step in the flow ('hobby' | 'experience' | 'time' | 'goal' | 'generating')
  - `isTyping` - Whether AI is typing
  - `isGenerating` - Whether plan is being generated
  - `planProgressPercent` - Progress percentage for plan generation
  - `answeredSteps` - Set of completed steps

- **Handlers:**
  - `handleSendMessage()` - Send a user message
  - `handleOptionSelect()` - Handle option button clicks
  - `handleSurpriseMe()` - Handle "Surprise Me" selection
  - `addUserMessage()` - Add a user message programmatically
  - `addAIMessage()` - Add an AI message programmatically

### Example Usage

See `client/src/components/SplitPlanInterface.tsx` for a complete example.

### Related Files

- **Types:** `client/src/types/plan.ts`
- **Validation:** `client/src/utils/planValidation.ts`
- **Data Fixing:** `client/src/utils/planDataFix.ts`
