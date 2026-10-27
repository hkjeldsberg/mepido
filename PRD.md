Product Requirements Document (PRD)
Project Name: Me Pido (mepido) - Norwegian Ønskeliste Web App
Document Status: Draft
Target Audience: Users who want a frictionless, aesthetically pleasing way to create, manage, and share personal or family wishlists.

1. Objective
To build "Me Pido," a visually refined, highly responsive web application for managing and sharing wishlists. The application leverages a wide-screen, desktop-optimized layout (scaling gracefully to mobile) to display wishlist items in an elegant grid. It focuses on a premium user experience with smooth interactions, offering a seamless way to view item details, prices, and links without losing the context of the main list.

2. User Flow
Landing / Dashboard View: The user lands on a clean, minimal dashboard featuring a beautifully styled hero section. They see a grid of their active wishlists (e.g., "Min Ønskeliste", "Jul 2026", "Barnas Bursdag").

Wishlist Grid Phase: Clicking a wishlist transitions the view to a 2D grid or horizontal array of wish items. Each card acts as a thumbnail showcasing the item image, a brief descriptive title, and a price/price range.

Multi-Pane / Modal Detail Phase: Instead of redirecting to a new page or forcing deep scrolling, clicking an item triggers a glassmorphic modal or a split-pane expansion. The item's context remains visible in the background, while the active pane displays detailed information (exact price, direct purchase link, detailed description, and notes).

Editing / Management Phase: For the list owner, subtle, hover-revealed action buttons allow for quick inline editing or deletion of items.

Sharing Phase: A prominent but elegant "Del liste" (Share list) button copies a unique, read-only URL to the clipboard.

3. Core Features & Functional Requirements
3.1. Main Web Dashboard & Grid

Hero Section: A simple, elegantly styled headline (e.g., "Mine Ønskelister") optimized for wide displays, possibly utilizing a soft background blur.

Item Grid (Desktop Layout): A responsive CSS Grid array of item cards.

Card Anatomy: High-quality image thumbnail (top), descriptive title (middle), and price/price range (bottom).

Owner Controls: "Add New Item" card persistently available at the end or beginning of the grid, launching an input modal.

3.2. Item Detail View (Modal or Split-Pane)
Taking advantage of wider desktop screens, the detail view opens dynamically:

Visuals: A larger, uncropped view of the item image.

Data Fields:

Title and Description.

Price (accepts string ranges like "500 - 800 kr" or exact integers).

Outbound "Kjøp her" (Buy here) button linking to the webshop.

Interactions: List owners can edit these fields directly within this view, hitting "Save" to instantly update the grid via optimistic UI updates.

4. Technical & Data Requirements
Tech Stack: Built as a modern web application utilizing Next.js (App Router), React, and TypeScript.

Styling & UI: Tailwind CSS for layout handling, utilizing component ecosystems like Shadcn UI and 21st.dev for rapid, accessible, and polished interface elements.

Database & Storage Backend: Supabase will be used for all data persistence and authentication.

Schema (mepido): Relational tables structure for users, wishlists, and items (containing fields for title, description, price_string, url, image_url, and wishlist_id). Supabase Storage buckets will handle any custom uploaded item images.

State Management: Server components where possible for initial load, coupled with client-side state for the interactive modals and optimistic UI updates upon editing/deleting items.

5. Design & UX Requirements (The "Apple Design" Skill)
Layout: Leverage wide viewports with CSS Grid/Flexbox for balanced, centered compositions, avoiding constrained vertical stacking.

Typography: Large, highly legible, sans-serif typography (e.g., San Francisco/Inter) with a strict typographic hierarchy.

Materials & Styling: Extensive use of subtle translucency (glassmorphism/background blur) for the item modals and floating action bars. Soft, diffused drop shadows on the item cards to create a premium sense of depth.

Interactions: Utilize Framer Motion for smooth, physics-based micro-animations. Hovering over a wishlist card should trigger a slight, spring-based scale effect. Modals should animate in smoothly from the clicked card's origin rather than a harsh linear pop-up.


6. Other
- No spesific login for now
- No option to claim or reserve item
- Images should be uploaded or an image link/url should be provided when creating a wish