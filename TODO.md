# TODO: Fix Floating Menu Button Visibility

## Steps from Approved Plan

1. [ ] Edit `frontend/src/pages/HomePage.js`:
   - Update the zIndex of the floating menu IconButton from 1000 to 1400 to ensure it appears above the Header's zIndex of 1300.

2. [ ] Verify the file edit was successful.

3. [ ] Start the frontend development server if not already running:
   - Run `cd frontend && npm start` to serve the app at http://localhost:3000.

4. [ ] Test visibility:
   - Use browser to navigate to http://localhost:3000 and confirm the floating menu button is visible in the top-left corner without being obscured by the header.
   - Check on mobile view (via browser dev tools) to ensure no issues with sidebar toggling or MobileBottomBar.

5. [ ] Update this TODO.md to mark steps as completed and close the task.
