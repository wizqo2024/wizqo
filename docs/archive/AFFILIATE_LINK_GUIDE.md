# How to Change Your Amazon Affiliate Link

## Current Status
✅ Amazon products reduced to 1 per day (instead of 2)  
✅ Dynamic search links now used for better hobby matching  
✅ Updated to `wizqohobby-20` affiliate tag

## Where to Change Your Affiliate Link

Your Amazon affiliate tag is currently set to `wizqo-20`. To use your own affiliate link, replace it in these files:

### 1. Main API Generator (`api/generate-plan.js`)
**Line 290:** 
```javascript
link: `https://amazon.com/s?k=${encodeURIComponent(hobby)}+beginner+equipment&tag=wizqo-20`,
```
**Change to:**
```javascript
link: `https://amazon.com/s?k=${encodeURIComponent(hobby)}+beginner+equipment&tag=YOUR-AFFILIATE-TAG`,
```

### 2. Frontend Fallback (`client/src/App.tsx`)
**Line 358:**
```javascript
link: `https://amazon.com/s?k=${encodeURIComponent(hobby)}+beginner+kit&tag=wizqo-20`,
```
**Change to:**
```javascript
link: `https://amazon.com/s?k=${encodeURIComponent(hobby)}+beginner+kit&tag=YOUR-AFFILIATE-TAG`,
```

### 3. Backend Routes (`server/routes.ts`)
**Line 211:**
```javascript
link: `https://amazon.com/dp/B${index + 1}234?tag=wizqo-20`,
```
**Change to:**
```javascript
link: `https://amazon.com/dp/B${index + 1}234?tag=YOUR-AFFILIATE-TAG`,
```

## How to Get Your Amazon Affiliate Tag

1. Sign up for Amazon Associates program at: https://affiliate-program.amazon.com/
2. Once approved, your affiliate tag will be in format: `yourname-20`
3. Replace `wizqo-20` with your tag in all 3 locations above

## Current Link Format

The system now generates smart Amazon search links like:
- Photography: `https://amazon.com/s?k=photography+beginner+equipment&tag=YOUR-TAG`
- Cooking: `https://amazon.com/s?k=cooking+beginner+equipment&tag=YOUR-TAG`
- Guitar: `https://amazon.com/s?k=guitar+beginner+equipment&tag=YOUR-TAG`

This gives users relevant product results while earning you commissions.