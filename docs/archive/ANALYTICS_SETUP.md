# 📈 Analytics Setup Guide

## Google Analytics 4 Setup

You already have Google Analytics installed! ✅

**Your GA4 ID:** `G-MLYT7Y9EVY`

### Verify It's Working:
1. Go to https://analytics.google.com
2. Check Real-Time reports
3. Visit your site - you should see yourself in real-time

### Set Up Goals (Conversions):

1. **Plan Generation Goal:**
   - Go to Admin → Events
   - Create custom event: `plan_generated`
   - Track when users generate a plan

2. **Email Signup Goal:**
   - Track form submissions
   - Event name: `email_signup`

3. **Blog Read Goal:**
   - Track time on page > 2 minutes
   - Engagement: `blog_read`

### Custom Reports to Create:

1. **Traffic Sources Report**
   - See where visitors come from
   - Organic, Social, Direct, Paid

2. **Content Performance**
   - Which blog posts get most traffic
   - Which pages convert best

3. **User Journey**
   - How users navigate your site
   - Where they drop off

---

## Google Search Console Setup

### Steps:
1. Go to https://search.google.com/search-console
2. Add property: `https://wizqo.com`
3. Verify ownership (DNS or HTML tag)
4. Submit sitemap: `https://wizqo.com/sitemap.xml`

### Monitor:
- Search queries people use to find you
- Click-through rates
- Average position in search results
- Pages indexed by Google

### Fix Issues:
- Submit pages for indexing
- Fix crawl errors
- Improve mobile usability

---

## Facebook Pixel Setup

### Why:
- Track conversions from Facebook ads
- Retarget website visitors
- Build custom audiences

### How to Add:

Add this code to your `index.html` before `</head>`:

```html
<!-- Facebook Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"
/></noscript>
<!-- End Facebook Pixel Code -->
```

Replace `YOUR_PIXEL_ID` with your actual pixel ID from Facebook Events Manager.

---

## Tracking Events

### Track Plan Generation:

Add to your plan generation code:

```javascript
// After successful plan generation
if (typeof gtag !== 'undefined') {
  gtag('event', 'plan_generated', {
    'hobby': hobbyName,
    'user_id': userId
  });
}

// For Facebook Pixel
if (typeof fbq !== 'undefined') {
  fbq('track', 'PlanGenerated', {
    content_name: hobbyName
  });
}
```

### Track Email Signups:

```javascript
// After successful email signup
gtag('event', 'email_signup', {
  'method': 'popup' // or 'form', 'footer', etc.
});
```

---

## Weekly Analytics Review

### Questions to Answer:
1. Which content gets most traffic?
2. Where do visitors come from?
3. What's the conversion rate?
4. Which pages have highest bounce rate?
5. What keywords bring traffic?

### Action Items:
- Double down on what works
- Fix pages with high bounce rate
- Create more content like top performers
- Optimize conversion pages

---

## Monthly Analytics Report Template

**Month:** [Month]

**Traffic:**
- Total Visitors: [number]
- New Visitors: [number]
- Returning Visitors: [number]
- Pages per Session: [number]
- Avg Session Duration: [time]

**Traffic Sources:**
- Organic Search: [number] ([%])
- Social Media: [number] ([%])
- Direct: [number] ([%])
- Referral: [number] ([%])
- Paid: [number] ([%])

**Top Pages:**
1. [Page] - [views]
2. [Page] - [views]
3. [Page] - [views]

**Conversions:**
- Plans Generated: [number]
- Email Signups: [number]
- Conversion Rate: [%]

**Goals for Next Month:**
- [Goal 1]
- [Goal 2]
- [Goal 3]

---

## 🎯 Quick Checklist

- [ ] Google Analytics verified working
- [ ] Google Search Console connected
- [ ] Sitemap submitted
- [ ] Facebook Pixel installed (if using FB ads)
- [ ] Conversion goals set up
- [ ] Weekly analytics review scheduled
- [ ] Monthly report template created

---

**Need help setting up tracking?** I can help you implement event tracking for specific actions!
