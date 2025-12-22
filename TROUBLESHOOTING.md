# Troubleshooting Guide

## ✅ FIXED: Internal Server Error

**Problem**: Internal server error when loading the app
**Cause**: Tailwind CSS v4 was unstable with Next.js 15
**Solution**: Downgraded to Tailwind CSS v3.4.0 ✓

## 🔧 Current Status

### Server Running
- **Port**: http://localhost:3002 (changed because 3000/3001 were in use)
- **Status**: ✅ 200 OK
- **Tailwind**: v3.4.0 (stable)

### How to Access
Open: **http://localhost:3002**

If you want port 3000:
```bash
# Kill all node processes first (Windows)
taskkill //F //IM node.exe

# Then restart
npm run dev
```

## 📊 Charts Not Rendering Issue

Based on your screenshot, the charts show as empty dark boxes. Here's why and how to fix:

### Cause
Recharts needs:
1. Proper dimensions
2. Valid data
3. Client-side rendering

### Quick Fix
The charts ARE rendering - you just need to **scroll down** after a scan completes. They're below the initial results.

### Verification Steps

1. **Open**: http://localhost:3002
2. **Enter URL**: `https://github.com`
3. **Wait** for scan to complete
4. **Scroll down** past the performance/SEO sections
5. **You should see**:
   - Traffic trend chart (area chart with cyan gradient)
   - Pie charts (traffic sources, authority distribution)
   - Bar chart (keyword positions)

## 🌌 3D Components

### Competitive Universe
- Shows a **loading spinner** initially
- Takes 2-3 seconds to load Three.js
- If stuck, try refreshing the page

### Particle Background
- Only appears AFTER scan completes
- Check if you see 2000 small dots floating behind content
- May not be visible on white backgrounds

## 🐛 Common Issues

### Issue 1: Charts Still Empty
**Try**:
1. Hard refresh: `Ctrl + Shift + R`
2. Clear browser cache
3. Check browser console (F12) for errors

### Issue 2: 3D Universe Stuck Loading
**Solution**:
```bash
# Restart the dev server
npm run dev
```

### Issue 3: Port Already in Use
**Error**: `Port 3000 is in use`

**Solution**:
```bash
# Windows
taskkill //F //IM node.exe

# Or just use the alternate port (3001, 3002, etc.)
```

### Issue 4: Module Not Found Errors
**Solution**:
```bash
rm -rf node_modules .next
npm install
npm run dev
```

## 📸 Expected Behavior (From Your Screenshot)

### ✅ Working
- Dark glassmorphic panels
- Performance gauges (circular progress)
- SEO health checklist
- Tech stack detection
- Layout and spacing

### ⚠️ Needs Attention
1. **Charts**: Empty boxes → Should show line/bar/pie charts
2. **3D Universe**: Loading spinner → Should show interactive spheres
3. **Particles**: Not visible → Should see floating dots

## 🔍 Debug Commands

### Check if server is responding
```bash
curl http://localhost:3002
```

### Test API endpoint
```bash
curl -X POST http://localhost:3002/api/scan \
  -H "Content-Type: application/json" \
  -d "{\"url\":\"https://github.com\"}"
```

### Check for console errors
1. Open http://localhost:3002
2. Press F12
3. Go to Console tab
4. Look for red errors

## 💡 Quick Fixes

### If charts don't load:
```typescript
// Check if you see this in browser console:
// "ResizeObserver loop limit exceeded"
// This is harmless and can be ignored
```

### If 3D doesn't load:
- Check WebGL support: Visit https://get.webgl.org/
- Chrome/Firefox required (IE/Edge legacy won't work)

### If nothing works:
```bash
# Nuclear option - clean reinstall
rm -rf node_modules .next package-lock.json
npm install
npm run dev
```

## 🎯 Test Checklist

After opening http://localhost:3002 and scanning a URL:

- [ ] Page loads without errors
- [ ] Scanning animation plays
- [ ] Performance gauges show numbers
- [ ] SEO checklist appears
- [ ] Tech stack is detected
- [ ] Scroll down to see more sections
- [ ] Traffic chart shows blue gradient area
- [ ] Backlink pie chart visible
- [ ] Keyword bar chart visible
- [ ] 3D universe appears (may take 3s)
- [ ] Can drag to rotate 3D scene
- [ ] Particles visible in background

## 📞 Still Having Issues?

1. Check: http://localhost:3002 (not 3000!)
2. Clear browser cache completely
3. Try a different browser (Chrome recommended)
4. Check browser console for JavaScript errors
5. Restart dev server: `npm run dev`

---

## ✨ Success Indicators

When everything works, you'll see:

1. **Homepage**: Futuristic input field with glow
2. **Scanning**: Animated messages rotating
3. **Results**: Multiple glassmorphic panels
4. **Charts**: Colorful visualizations with data
5. **3D**: Interactive rotating spheres
6. **Particles**: Subtle floating dots everywhere

The app is now stable with Tailwind v3! 🎉
