# Refactoring Plan: SplitPlanInterface.tsx

## Current State
- **File:** `client/src/components/SplitPlanInterface.tsx`
- **Size:** 2,564 lines
- **Complexity:** Very High - Multiple responsibilities mixed together

## Analysis

### Main Responsibilities Identified:

1. **Chat Interface** (~400 lines)
   - Message state management
   - User input handling
   - AI message generation
   - Option selection

2. **Plan Generation** (~300 lines)
   - Hobby validation
   - Plan API calls
   - Quiz flow management
   - Error handling

3. **Progress Tracking** (~400 lines)
   - Day completion tracking
   - Progress loading/saving
   - Session storage management
   - Database sync

4. **Plan Display** (~600 lines)
   - Day selection UI
   - Content rendering
   - Video embedding
   - Day navigation

5. **Day Content Generation** (~300 lines)
   - Lazy loading days
   - API calls for missing days
   - Content merging logic

6. **Storage/Hydration** (~300 lines)
   - Plan data hydration
   - Session/localStorage management
   - Database fetching

7. **Validation Logic** (~200 lines)
   - Hobby validation
   - AI validation
   - Suggestion generation

## Refactoring Strategy

### Phase 1: Extract Types & Utilities (Safe - No Logic Change)
**Files to Create:**
- `client/src/types/plan.ts` - Plan-related types
- `client/src/utils/planValidation.ts` - Validation utilities
- `client/src/utils/planDataFix.ts` - Data fixing utilities

### Phase 2: Extract Custom Hooks (Low Risk - Test Each Hook)
**Files to Create:**
- `client/src/hooks/usePlanChat.ts` - Chat state and logic
- `client/src/hooks/usePlanProgress.ts` - Progress tracking
- `client/src/hooks/usePlanHydration.ts` - Plan hydration logic
- `client/src/hooks/useDayGeneration.ts` - Day content generation

### Phase 3: Extract Components (Medium Risk - Test Each Component)
**Files to Create:**
- `client/src/components/plan/PlanChatInterface.tsx` - Chat UI
- `client/src/components/plan/PlanDisplayPanel.tsx` - Plan display UI
- `client/src/components/plan/DaySelector.tsx` - Day selection UI
- `client/src/components/plan/DayContent.tsx` - Individual day content

### Phase 4: Refactor Main Component (Final Step)
**File to Update:**
- `client/src/components/SplitPlanInterface.tsx` - Now just orchestrates everything

## Detailed Breakdown

### 1. Types & Interfaces (`types/plan.ts`)

```typescript
export interface QuizAnswers {
  experience: string;
  timeAvailable: string;
  goal: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  content: string;
  options?: { value: string; label: string; description?: string }[];
  isTyping?: boolean;
  timestamp: Date;
  step?: 'hobby' | 'experience' | 'time' | 'goal';
}

export interface Day {
  day: number;
  title: string;
  mainTask: string;
  explanation: string;
  howTo: string[];
  checklist: string[];
  tips: string[];
  mistakesToAvoid: string[];
  freeResources: { title: string; link: string }[];
  affiliateProducts: { title: string; link: string; price: string }[];
  youtubeVideoId?: string;
  youtubeSearchUrl?: string;
  videoTitle?: string;
  estimatedTime: string;
  skillLevel: string;
}

export interface PlanData {
  hobby: string;
  title: string;
  overview: string;
  difficulty: string;
  totalDays: number;
  days: Day[];
}
```

### 2. Validation Utilities (`utils/planValidation.ts`)

Extract:
- `validateAndProcessHobby()`
- `validateHobbyWithAI()`
- All validation constants (SAFE_HOBBIES, etc.)

### 3. Custom Hook: `usePlanChat.ts`

**Responsibilities:**
- Message state (`messages`, `currentInput`)
- Chat step management (`currentStep`, `selectedHobby`, `quizAnswers`)
- Message handlers (`addUserMessage`, `addAIMessage`, `handleSendMessage`, `handleOptionSelect`)
- Typing state (`isTyping`)

**Returns:**
```typescript
{
  messages,
  currentInput,
  setCurrentInput,
  currentStep,
  selectedHobby,
  quizAnswers,
  isTyping,
  handleSendMessage,
  handleOptionSelect,
  handleSurpriseMe
}
```

### 4. Custom Hook: `usePlanProgress.ts`

**Responsibilities:**
- Progress state (`completedDays`, `selectedDay`)
- Progress loading/saving
- Session storage sync
- Database sync

**Returns:**
```typescript
{
  completedDays,
  selectedDay,
  setSelectedDay,
  toggleDayCompletion,
  isDayCompleted,
  isDayUnlocked,
  loadProgress,
  saveProgress
}
```

### 5. Custom Hook: `usePlanHydration.ts`

**Responsibilities:**
- Plan data hydration from various sources
- Initial plan loading
- Plan data fixing

**Returns:**
```typescript
{
  planData,
  setPlanData,
  isLoading,
  hydratePlan
}
```

### 6. Component: `PlanChatInterface.tsx`

**Props:**
```typescript
{
  messages: ChatMessage[];
  currentInput: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onOptionSelect: (value: string, label: string) => void;
  isTyping: boolean;
  currentStep: string;
}
```

**Renders:**
- Chat messages list
- Input field
- Quick reply options
- Typing indicator

### 7. Component: `PlanDisplayPanel.tsx`

**Props:**
```typescript
{
  planData: PlanData;
  selectedDay: number;
  onDaySelect: (day: number) => void;
  completedDays: number[];
  onToggleCompletion: (day: number) => void;
  isDayUnlocked: (day: number) => boolean;
}
```

**Renders:**
- Day selector
- Selected day content
- Progress indicators

### 8. Component: `DaySelector.tsx`

**Props:**
```typescript
{
  totalDays: number;
  selectedDay: number;
  completedDays: number[];
  onDaySelect: (day: number) => void;
  isDayUnlocked: (day: number) => boolean;
}
```

**Renders:**
- Day buttons (1-7)
- Completion indicators
- Lock/unlock states

### 9. Component: `DayContent.tsx`

**Props:**
```typescript
{
  day: Day;
  isCompleted: boolean;
  onToggleCompletion: () => void;
}
```

**Renders:**
- Day title and description
- Main task
- How-to steps
- Checklist
- Tips
- Resources
- Video embed

## Implementation Order

### Step 1: Extract Types (30 min)
- ✅ Create `types/plan.ts`
- ✅ Move all interfaces
- ✅ Update imports in main file
- ✅ Test - should work exactly the same

### Step 2: Extract Validation (1 hour)
- ✅ Create `utils/planValidation.ts`
- ✅ Move validation functions
- ✅ Update imports
- ✅ Test - should work exactly the same

### Step 3: Extract usePlanChat Hook (2 hours)
- ✅ Create `hooks/usePlanChat.ts`
- ✅ Move chat-related state and logic
- ✅ Update main component to use hook
- ✅ Test thoroughly - chat should work

### Step 4: Extract usePlanProgress Hook (2 hours)
- ✅ Create `hooks/usePlanProgress.ts`
- ✅ Move progress-related state and logic
- ✅ Update main component
- ✅ Test thoroughly - progress should work

### Step 5: Extract PlanChatInterface Component (1.5 hours)
- ✅ Create `components/plan/PlanChatInterface.tsx`
- ✅ Move chat UI JSX
- ✅ Update main component
- ✅ Test - chat UI should render correctly

### Step 6: Extract PlanDisplayPanel Component (2 hours)
- ✅ Create `components/plan/PlanDisplayPanel.tsx`
- ✅ Move plan display UI JSX
- ✅ Update main component
- ✅ Test - plan display should work

### Step 7: Final Cleanup (1 hour)
- ✅ Simplify main component
- ✅ Remove unused code
- ✅ Add comments
- ✅ Final testing

## Testing Strategy

### After Each Step:
1. ✅ Run `npm run dev` - Check for errors
2. ✅ Test the feature manually
3. ✅ Check browser console for errors
4. ✅ Verify functionality works as before

### Final Testing:
1. ✅ Test plan generation flow
2. ✅ Test chat interface
3. ✅ Test progress tracking
4. ✅ Test day selection
5. ✅ Test day completion
6. ✅ Test plan hydration
7. ✅ Test all edge cases

## Risk Mitigation

1. **Keep Old Code** - Don't delete until new code works perfectly
2. **Incremental** - One piece at a time
3. **Test Frequently** - After each extraction
4. **Git Commits** - Commit after each successful step
5. **Rollback Plan** - Can revert if something breaks

## Expected Results

### Before:
- 1 file: 2,564 lines
- Hard to navigate
- Hard to test
- Hard to maintain

### After:
- ~10 files: 200-400 lines each
- Easy to navigate
- Easy to test
- Easy to maintain
- Better code organization
- Reusable hooks/components

## Timeline

- **Total Time:** 10-12 hours
- **Can be done in parts:** Yes
- **Can pause anytime:** Yes
- **Risk Level:** Low (with proper testing)

## Next Steps

Ready to start? We'll begin with Step 1: Extract Types (safest, fastest win).
