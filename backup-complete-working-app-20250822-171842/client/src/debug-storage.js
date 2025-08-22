// Debug storage utility - check localStorage keys
console.log('=== localStorage Debug ===');
console.log('All localStorage keys:');
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  console.log(`${key}:`, value ? JSON.parse(value) : null);
}

console.log('\n=== Specific Keys ===');
console.log('lastViewedPlan:', localStorage.getItem('lastViewedPlan'));
console.log('lastViewedPlanData:', localStorage.getItem('lastViewedPlanData') ? 'EXISTS' : 'MISSING');

// Test storage
console.log('\n=== Testing Storage ===');
const testPlan = { hobby: 'test', title: 'Test Plan' };
localStorage.setItem('test_plan', JSON.stringify(testPlan));
console.log('Stored test plan:', localStorage.getItem('test_plan'));