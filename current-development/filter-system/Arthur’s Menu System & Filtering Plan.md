# Arthur’s Menu System & Filtering Plan

Owner: Penny Platt
Categories & Tags: Categories:
- Game Development
- Product Management
- E-commerce Solutions
- User Interface Design

Tags:
- Cactus Pot
- Menu System
- Filtering Plan
- KISS Principle
- Shopify Integration
- User Experience
- Product Attributes
- Game Lines
- Pricing Strategy
- Digital Marketing
- Retail Optimization
Classification: Resource Category: Product Development
Doc Type: Internal Planning Document
Resource Type: Menu System Design
Description: The menu system includes top-level filters for game collections, genres, and themes, with specific product attributes for filtering. Each SKU must match Shopify data precisely, and there are guidelines for displaying product attributes and pricing. Sub-filters are designated for specific game lines, and a document history is maintained for version tracking.
Meta: This guide details the development of Arthur's Menu System and filtering plan for Petersen Games, emphasizing user-friendly navigation and product accessibility while aligning with the principles of inclusivity and user wellbeing.
Organization: Petersen Games
Overview: Arthur’s Menu System outlines a structured filtering plan for product SKUs in Shopify, emphasizing simplicity and user-friendly navigation through various categories and attributes.
Parent item: Shopify Tag-Based Filter Implementation (https://www.notion.so/Shopify-Tag-Based-Filter-Implementation-23fdf587791880eea65ec20f3027f76b?pvs=21)
Research Methods: Data Analysis
Status: In Development
Status 2: Draft
Summary: The menu and filtering system includes top-level filters for game lines, genres, and themes, allowing for multiple selections. Product attributes like language, player count, playtime, age level, hobby weight, and core game status are also included. Specific sub-filters are designated for certain game lines, and pricing adjustments are noted, emphasizing the need for accurate comparison pricing. Visual aids are provided to assist in understanding the organization of the menu and filtering options.
Testing Metrics: Data Structuring, Feature Validation, User Experience Testing

<aside>
<img src="https://www.notion.so/icons/triangle-two-thirds_gray.svg" alt="https://www.notion.so/icons/triangle-two-thirds_gray.svg" width="40px" />

</aside>

[Untitled](Arthur%E2%80%99s%20Menu%20System%20&%20Filtering%20Plan%20234df5877918809faafbf0d1f47b04a6/Untitled%20240df587791880fda231c04d240069fa.csv)

[Untitled](Arthur%E2%80%99s%20Menu%20System%20&%20Filtering%20Plan%20234df5877918809faafbf0d1f47b04a6/Untitled%20240df5877918807ca842c532eced7b56.csv)

### Arthur’s Directive - July 3, 2025

I promise I kept in mind the idea of KISS (keep it simple) - but it may not seem that way initially.

Attached is a spreadsheet with all the relevant fields for every SKU currently in Shopify.  If it turns out I've missed some, please let me know and I can add the properties for any missing products.

It may be useful to first look at the 2 attached jpgs of the final version of what I used to map out and play around with possibilities.  The information on these images should be correct, but only use the spreadsheet, as it has the actual, final data.  The jpgs will help you see how/why I organized the menu/filtering the way I did, which I hope can help you think of how best to display the user interface for customers.

**Here's how it all works:**

In the spreadsheet, the Product Title and SKUs should perfectly match what's already in Shopify. Those are sacrosanct and must always be character precise. If ***any***  do not match something in Shopify, please let me know. Both product title and SKUs should have zero duplicates.

**Top Filters *(columns D through G)***

There are 4 top level filters that should probably be universally visible on the site:

- ***Sandy's Games*** - these are single selection, you may only choose one at a time, showing a "game line collection" static page with core game first. A given SKU can only ever be tied to a single game line.
- ***Larval Games*** operates the same as "Sandy's Games" but is a different set of game lines.
- ***Genre*** This should allow multiple selections, showing the SKUs that match at least ONE of the genres selected (rather than "all" those selected). Note that a given SKU can have more than one genre. I separated the genres with a semi-colon ";" There should not be a default.
- ***Theme*** - similar to Genre in that this allows multiple selections, and a given SKU can be tied to more than one Theme, etc.

***Product Attributes (columns H through N)***

This is sort of a "top level" filter, but it is (or opens up into) a sub-menu of several filters that can be manipulated and which then *apply to the Top Level* filter you've already selected. (I suppose you could select NOTHING from any of the four Top Levels, and still find products using the Attribute filters, but I don't think anyone would ever search for a product that way).

The "Product Attribute" dropdown should likely be visible underneath the four Top Level filters, but all the various sub-menu filters should be hide-able.

There are 6 product attributes that can be manipulated:

- *Language* - defaults to English
- *Player Count *****I broke this into two columns in the spreadsheet (min and max), as that seems better than a discrete dropdown of "2 to 4 players, 2 to 5 players, 2 to 6 players" which doesn't seem user friendly. SKUs of "n/a" should never show up if you are filtering by player count. no default
- *Play Time -* no default
- *Age Level -*  no default
- *Hobby Weight -* no default, this is a rank of 1-4.
- *Core Game -* every SKU is a binary: either a core game, or not. This menu should default to "All Products" and nothing is filtered. But if desired, you can select "Only Core Games" and thus filter out anything that is not a core game.

Icons for the product pages/images themselves (maybe this is a "phase 2" thing?). These product attributes, as we've discussed, could also have little images or icons on the product images, which could be something like this:

- *Language* - little country flags
- *Player Count *****Two little Cthulhus sitting across the table from each other (left/right)
- *Play Time -* little clock with tentacly arms
- *Age Level -* Birthday cake with Cthulhu behind to blow out candles
- *Hobby Weight -* Number of baby Cthulhu heads, 1,2,3 or 4.

***Game Line Specific Sub-Filters (column O)***

There are 3 Game Lines in particular which need sub-filtering specific to them. Sub-filtering the other game lines is not necessary, and overly complicates things.

The "Game Line Specific Filters" jpg shows how I planned these out visually.

On the spreadsheet you will see that column O is highlighted in yellow - this is the column showing you the specific sub-filters for these 3 game lines. These should default to "all" and allow for multiple selections (in the same manner as the Genre and Theme top level filters, allowing you to see all [Game Line] SKUs that match any of the sub-categories selected.

***Price and "Compate at Price" (columns P and Q)***

This is unrelated to all the menu and filtering - BUT it's something that Christy strongly suggested we do, and so this is something I'd like you to do, Rob.  I set almost every product to have a "Compare at Price" and this is a mistake.  I have put in column P the NEW prices I want to sell the SKUs at in the store.  Any SKU with a "Compare at Price" in column Q should have one, but everything that is blank there should not have a compare at price showing on its product page.

![Top Filters.jpg](Arthur%E2%80%99s%20Menu%20System%20&%20Filtering%20Plan%20234df5877918809faafbf0d1f47b04a6/Top_Filters.jpg)

![Game Line Specific Filters.jpg](Arthur%E2%80%99s%20Menu%20System%20&%20Filtering%20Plan%20234df5877918809faafbf0d1f47b04a6/Game_Line_Specific_Filters.jpg)

---

- **Document History**
    
    
    | Version | Date | Author | Changes |
    | --- | --- | --- | --- |
    | 0.1 | July 28, 2025  | @Penny Platt  | Initial Creation |
    |  |  |  |  |
    
    *This document follows 9Bit Studios' quantum-spatial design principles and documentation standards.*
    

*© 2025 9Bit Studios. All rights reserved.*