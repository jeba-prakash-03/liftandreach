# CHECKLIST & KNOWN INCONSISTENCIES
**Lift and Reach Equipments Modernization Project**

This document tracks all verified catalog items, crawl outputs, known data inconsistencies preserved verbatim from the original site, and items requiring client confirmation.

---

### 1. Known Inconsistencies Preserved Verbatim

As instructed, these items were preserved verbatim without silent modification. TODO comments and explicit notes were attached to their respective database records and views:

- [x] **a. Alternate Phone Number on Contact Page:**
  - *Detail:* Contact page on original site displays `(+91) 80729 30749` instead of `(+91) 97893 97504`.
  - *Resolution:* Preserved both numbers; added `phone_contact_page_alt` in `settings` table and displayed both in the contact section with a TODO comment awaiting client confirmation.
- [x] **b. Location Spelling ("Sriperumpudur" vs "Sriperumpudhur"):**
  - *Detail:* The spelling varies across the old site ("Sriperumpudhur" on the home page and meta tags; "Sriperumpudur" on the about page).
  - *Resolution:* Used each spelling exactly where it originally appeared (e.g., "Sriperumpudhur" in Welcome section, "Sriperumpudur" in About page paragraph 1).
- [x] **c. Pit-Mounted Scissor Lift Max Height:**
  - *Detail:* Pit-mounted scissor custom built note states *"height from 150 MM to 10000 MM height"*, while the About page states *"Hydraulic Scissor lifting tables with different height and capacity (Height up to 12 Meters capacity up to 25 Tons)"*.
  - *Resolution:* Preserved verbatim where each originally appears.
- [x] **d. Self Propelled Scissor Lift Battery Spec:**
  - *Detail:* Second model (`LRSSP-0.4T-8.0M`) lists battery as `25 V/ 225 Ah` (likely a 24 V typo on the old site).
  - *Resolution:* Preserved verbatim as `25 V/ 225 Ah (Note: listed as 25V on original site)` and flagged in product notes.
- [x] **e. Aerial Towable Platform Dimensions:**
  - *Detail:* Spec table is identical to Truck Mounted except platform sizes `1101 X 750 X 1100` and `1102 X 750 X 1100` (likely copy-paste typos).
  - *Resolution:* Preserved verbatim and flagged in product notes.
- [x] **f. Manual Stacker Type Code & Capacity:**
  - *Detail:* 3rd column type code is `LRHS-2T-1.6M` but capacity is listed as `1000 Kgs`; 2nd column repeats code `LRHS-1T-1.5M` with `3000 MM` lifting height.
  - *Resolution:* Preserved verbatim and flagged in table notes.
- [x] **g. Pallet Truck Capacity vs Type Code:**
  - *Detail:* Type `LRPT-3.5T` lists capacity as `2500 Kgs`.
  - *Resolution:* Preserved verbatim as `2500 Kgs (Note: Listed as 2500 Kgs on original site despite 3.5T code)` and flagged.
- [x] **h. Aerial Truck-Mounted Units:**
  - *Detail:* Original table has no units (capacity `200`, heights `10000`, `13000`, `16000`).
  - *Resolution:* Stored raw numbers, added unit hint `(assumed kg / mm)`, and flagged in table notes.
- [x] **i. Goods Lift Wall-Mounted First Column Capacity:**
  - *Detail:* First column capacity listed as `500` with no unit.
  - *Resolution:* Preserved verbatim as `500 (Note: Unit not specified in old site, assumed Kg)`.
- [x] **j. Placeholder & Missing Pages:**
  - *Detail:* "Tripod Jacks" heading on original home page had no body text; "SPM" under Goods Lift had no page.
  - *Resolution:* Axle & Tripod jacks crawled and consolidated with available specs; SPM created with `is_active=false` placeholder in database.
- [x] **k. Domain Name:**
  - *Detail:* Footer on old site listed `www.liftandreach.com`, but the live functioning domain is `https://liftandreach.in`.
  - *Resolution:* Used `liftandreach.in` with a TODO flag for the client to confirm domain consolidation.
- [x] **l. ISO Certification Claims Removed:**
  - *Detail:* The old site displayed an unverified "ISO CERTIFIED MFG" badge without certificate numbers or accredited body info.
  - *Resolution:* ISO claim removed - re-add only if client provides certificate.

---

### 2. Crawl Extraction Summary (5 Target Pages)

- [x] `/scissor lift TOWABLE (Multi Scissor)-Electric.php`: Extracted specs (`LRSLT-0.3T-6M/9M/11M`, `LRSLT-0.5T-6M/9M/11M`, 300/500 Kg, 1335/1360 mm, 5 HP 415V AC).
- [x] `/HYDRAULIC FLOOR CRANE - LIGHT DUTY.php`: Extracted specs (`LRFC-1T`, `LRFC-2T`, 1000/2000 Kgs, 55-2270 mm, 380-2400 mm).
- [x] `/DOCK LEVELER.php`: Extracted specs (`LRDL - 9T-18*20`, `LRDL-12T- 20 * 25`, 9000/12000 Kgs, travel, pit dimensions).
- [x] `/aircraft jacks.php`: Extracted specs (`LRARJ - 9.5T-0.95M`, `LRARJ -10T-0.85M`, 9.5/10 Ton, test load 13.5 Ton).
- [x] `/hollow.php`: Extracted specs (`LRHJ - 20T - 250 - HO`, `LRHJ - 20T - 250 - SO`, 10-50 Ton / 10-100 Ton).

---

### 3. Missing Remote Images on Old Server (HTTP 404)

The old server returned 404 Not Found for the following non-critical decorative icon assets:
- `/images/Client_Satisfied-512.png`
- `/images/wcuico_1.png`
- `/images/wcuico_2.png`
- `/images/wcuico_3.png`
- `/images/wcuico_4.png`
- `/images/wh_certify.png`

*Handled by:* Redrawn and rendered using crisp, accessible Lucide SVG industrial icons (`ShieldCheck`, `Award`, `Users`, `CheckCircle`) styled to match the brand's industrial aesthetic.

---

### 4. Low-Resolution Source Images (From Original 2000s Web Server)

The original site hosted low-resolution equipment photos (250x250px master JPEGs). They are displayed at native scale centered on `#F4F7FB` technical tiles using `object-contain` without artificial stretching or upscaling:
- `client/public/images/product/scissor lift.jpg` (250x250px)
- `client/public/images/product/GOODS LIFT.JPG` (250x250px)
- `client/public/images/product/aerial.jpg` (250x250px)
- `client/public/images/product/stacker.jpg` (250x250px)
- `client/public/images/product/PALLET TRUCK.jpg` (250x250px)
- `client/public/images/product/ZERO LIFT.jpg` (250x250px)
- `client/public/images/product/hydraulic barrel lifter tilter.jpg` (250x250px)
- `client/public/images/product/HYDRAULIC FLOOR CRANE - LIGHT DUTY.jpg` (250x250px)
- `client/public/images/product/DOCK LEVELLER.jpg` (250x250px)
- `client/public/images/product/AIR CRAFT JACKS.jpg` (250x250px)
- `client/public/images/product/hollow.jpg` (250x250px)

*Action for Client:* Supply higher-resolution camera originals (1200px+ width) to automatically take advantage of the Sharp responsive WebP pipeline.

---

### 6. Photography Needed From Client (Architectural Redesign)

The architectural design language is built to elevate genuine high-resolution industrial photography. As verified by the image audit (`scripts/image-dimensions.json`), all 41 original product cutout assets are 250x250px JPEGs. The renderer maintains calm whitespace without stretching them beyond 1.15x native size.

**Client Action:** Provide original high-resolution photos (min 1920x1080px or 1200px+ width) for:
- All 41 product catalog images under 800px wide (including `scissor lift.jpg`, `aerial.jpg`, `GOODS LIFT.JPG`, `stacker.jpg`, `PALLET TRUCK.jpg`, `ZERO LIFT.jpg`, `DOCK LEVELLER.jpg`, `AIR CRAFT JACKS.jpg`, `hydraulic barrel lifter tilter.jpg`, and `HYDRAULIC FLOOR CRANE - LIGHT DUTY.jpg`).
- Factory floor photos of the Kuthambakkam fabrication shop, structural welding, cylinder boring, and test loads.

1. **Scissor Lift Platforms:**
   - In-situ shot of a pit-mounted scissor table flush with factory flooring, holding machinery/dies.
   - Outdoor towable multi-scissor lift fully elevated against a building facade.
   - Close-up detail of hydraulic cylinder pivot linkages and machined steel scissors.
2. **Goods Lift / Freight Elevators:**
   - Full vertical perspective of an installed self-standing structural mast across a 2-story mezzanine.
   - Industrial floor loading area with warehouse staff staging freight.
3. **Aerial Access Platforms:**
   - Truck-mounted boom or towable boom extended at outdoor utility work or maintenance height (up to 25m).
   - Operator in harness working from platform safety cage.
4. **Stacker & Pallet Trucks:**
   - Warehouse aisle perspective with electric or manual stacker lifting pallet into racking.
   - Heavy-duty floor pallet truck moving loaded pallets.
5. **Zero Lift & Floor Cranes:**
   - Low-profile zero-lift table at true floor-level roll-on position.
   - Light-duty hydraulic floor crane lifting an engine block or motor assembly.
6. **Hydraulic Barrel Lifter & Tilter:**
   - Drum handling mechanism tilted at 45° dispensing liquid in chemical or food processing bay.
7. **Dock Levelers:**
   - Articulated hydraulic dock plate bridging warehouse floor and 40ft container truck bed.
8. **Aircraft Jacks:**
   - Precision tripod jacks and axle jacks positioned under aircraft fuselage / landing gear in hangar.
9. **Hollow & Solid Ram Cylinders:**
   - Engineering bench photo of machined chrome rams, manifold blocks, and hydraulic hand pumps.
10. **Factory & Engineering Workshop:**
    - Broad architectural perspective of the Kuthambakkam fabrication shop: welding, machining, and final testing.
    - Engineering drawings or CAD workstation on site.

### 7. Unit Normalizations
- Displayed bare numerical values in spec rows (where other columns specify units) with normalized `"mm"` suffix while preserving original numbers in database records.
- Stored all original units verbatim.


1. Confirm preferred official email address (`liftnreach@gmail.com` vs a custom Google Workspace domain like `sales@liftandreach.in`).
2. Confirm primary phone number ordering and whether to retain or update `(+91) 80729 30749`.
3. Confirm if SPM (Special Purpose Machines) requires an active product listing with photos.
4. Confirm whether `LRSSP-0.4T-8.0M` should officially be 24 V instead of 25 V.
5. Confirm whether `LRPT-3.5T` pallet truck capacity is 3500 Kgs or 2500 Kgs.
