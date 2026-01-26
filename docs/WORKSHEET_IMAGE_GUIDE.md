# Complete Guide: Creating Image-Based Worksheets with AI

## 📋 Step 1: What to Ask Your AI Tool (Nana Banana/Gemini Pro)

### **Prompt Template for Each Worksheet:**

```
Create a kindergarten math worksheet image with the following specifications:

**Worksheet Type:** [e.g., "Counting 1-10", "Number Recognition", "Shapes", "Patterns", "Addition with Pictures"]

**Requirements:**
- Size: 2550 x 3300 pixels (8.5" x 11" at 300 DPI - perfect for printing)
- Format: PNG with transparent background OR white background
- Style: Colorful, kid-friendly, large fonts, clear illustrations
- Content: 
  * Title at top: "[Worksheet Name]"
  * 6-8 problems/activities
  * Space for students to write answers
  * Age-appropriate visuals (animals, shapes, objects)
  * Large, clear numbers and text
  * Fun, engaging design

**Layout:**
- Portrait orientation (vertical)
- White background
- Clear borders around each problem
- Generous spacing between problems
- Child-friendly fonts (comic sans or similar)

**Visual Elements:**
- Use bright, appealing colors
- Include cute illustrations (animals, objects, shapes)
- Make numbers and text large and easy to read
- Add visual aids (pictures, diagrams) to help understanding
```

### **Example Prompts for 5 Kindergarten Worksheets:**

1. **Counting 1-10:**
   ```
   Create a kindergarten counting worksheet: "Count the Objects - Numbers 1-10"
   Show 6 groups of objects (apples, stars, circles, etc.) with different quantities (1-10).
   Each group should have a blank line: "Count: ___"
   Make it colorful with cute illustrations.
   Size: 2550 x 3300 pixels, PNG, white background.
   ```

2. **Number Recognition:**
   ```
   Create a kindergarten number recognition worksheet: "Match Numbers to Pictures"
   Show 8 large numbers (1-10) on one side and matching groups of objects on the other.
   Students draw lines to match numbers to pictures.
   Include cute animals or objects.
   Size: 2550 x 3300 pixels, PNG, white background.
   ```

3. **Shapes:**
   ```
   Create a kindergarten shapes worksheet: "Color the Shapes"
   Show 8 different shapes (circle, square, triangle, rectangle, etc.) with labels.
   Each shape should be large and have a color instruction (e.g., "Color the circle blue").
   Make shapes fun and colorful.
   Size: 2550 x 3300 pixels, PNG, white background.
   ```

4. **Patterns:**
   ```
   Create a kindergarten pattern worksheet: "Complete the Pattern"
   Show 6 different patterns using shapes, colors, or objects (AB, ABC, AAB patterns).
   Each pattern should have missing elements for students to complete.
   Use bright colors and fun shapes.
   Size: 2550 x 3300 pixels, PNG, white background.
   ```

5. **Addition with Pictures:**
   ```
   Create a kindergarten addition worksheet: "Add the Pictures"
   Show 6 simple addition problems (1+1, 2+1, 2+2, etc.) using visual objects.
   Each problem should have two groups of objects to count and add.
   Include a blank for the answer: "___ + ___ = ___"
   Make it visually appealing with cute illustrations.
   Size: 2550 x 3300 pixels, PNG, white background.
   ```

---

## 🖼️ Step 2: Image Specifications

### **Main Worksheet Image:**
- **Size:** 2550 x 3300 pixels (8.5" x 11" at 300 DPI)
- **Format:** PNG (preferred) or JPG
- **Background:** White
- **Orientation:** Portrait (vertical)
- **Resolution:** 300 DPI (for high-quality printing)

### **Answer Key Image (Separate):**
- **Same specifications as main worksheet**
- **But with answers filled in**
- **Add "Answer Key" title at top**
- **Use different color for answers (e.g., green or red)**

---

## 📝 Step 3: What to Generate

### **For Each Worksheet, Generate 2 Images:**

1. **Worksheet Image** (without answers)
   - File name: `kindergarten-[topic]-worksheet.png`
   - Example: `kindergarten-counting-worksheet.png`

2. **Answer Key Image** (with answers)
   - File name: `kindergarten-[topic]-answer-key.png`
   - Example: `kindergarten-counting-answer-key.png`

### **Recommended File Naming:**
```
kindergarten-counting-1-10-worksheet.png
kindergarten-counting-1-10-answer-key.png

kindergarten-number-recognition-worksheet.png
kindergarten-number-recognition-answer-key.png

kindergarten-shapes-worksheet.png
kindergarten-shapes-answer-key.png

kindergarten-patterns-worksheet.png
kindergarten-patterns-answer-key.png

kindergarten-addition-pictures-worksheet.png
kindergarten-addition-pictures-answer-key.png
```

---

## 📁 Step 4: After Images Are Generated

### **1. Save Images to Project:**
```
client/public/worksheets/kindergarten/
  ├── counting-1-10-worksheet.png
  ├── counting-1-10-answer-key.png
  ├── number-recognition-worksheet.png
  ├── number-recognition-answer-key.png
  ├── shapes-worksheet.png
  ├── shapes-answer-key.png
  ├── patterns-worksheet.png
  ├── patterns-answer-key.png
  ├── addition-pictures-worksheet.png
  └── addition-pictures-answer-key.png
```

### **2. I Will Help You:**
- Add the worksheet code to `PrintablesPage.tsx`
- Add SEO metadata to prerender script
- Add to sitemap
- Create the worksheet component with image display
- Add answer key toggle functionality

---

## 🎯 Step 5: Integration Checklist

After you generate the images, I'll help you:

- [ ] Create worksheet folder structure
- [ ] Add worksheet rendering code
- [ ] Add answer key toggle
- [ ] Add SEO metadata
- [ ] Add to sitemap
- [ ] Test print functionality
- [ ] Verify image quality

---

## 💡 Tips for Best Results

1. **Consistent Style:** Ask AI to use the same color scheme and style for all 5 worksheets
2. **Large Text:** Ensure numbers and text are large enough for kindergarteners
3. **Clear Instructions:** Include simple, clear instructions on each worksheet
4. **Visual Appeal:** Use bright colors and fun illustrations
5. **Print-Friendly:** Ensure good contrast and clear borders

---

## 🚀 Ready to Start?

1. Generate your 5 worksheets + 5 answer keys (10 images total)
2. Save them with the naming convention above
3. Share them with me or upload to the project
4. I'll integrate them into your system!
