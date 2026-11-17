import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Lift and Reach Database Seed ---');

  // 1. Settings (Not hardcoded - editable by admin)
  console.log('Seeding settings...');
  const settingsData = [
    { key: 'company_name', value: 'Lift and Reach Equipments', description: 'Company Name' },
    { key: 'tagline', value: 'A Way To Reach The Goal', description: 'Company Tagline' },
    { key: 'meta_title', value: 'Lift and Reach Equipments | Hydraulic equipment Manufacturing Company in Chennai', description: 'Default Meta Title' },
    { key: 'meta_description', value: 'Lift and Reach Equipments | Hydraulic equipment Manufacturing Company in Chennai. Manufacturer of Pallet truck, Stacker, Dock Leveler, Floor cranes, Drum lifter cum tilter, Scissor lifts and Aerial access platforms.', description: 'Default Meta Description' },
    { key: 'meta_keywords', value: 'Pallet truck, Stacker, Dock Leveler, Floor cranes, Drum lifter cum tilter, Scissor lift, Goods lift, Aerial access platform, Aircraft jacks, Chennai, Tamil Nadu', description: 'Default Meta Keywords' },
    { key: 'email', value: 'liftnreach@gmail.com', description: 'Primary Contact Email' },
    { key: 'phone_1', value: '(+91) 89393 59592', description: 'Primary Contact Phone 1' },
    { key: 'phone_2', value: '(+91) 97893 97504', description: 'Contact Phone 2' },
    { key: 'phone_contact_page_alt', value: '(+91) 80729 30749', description: 'Alternative phone shown on original contact page (TODO: confirm with client)' },
    { key: 'whatsapp', value: '918939359592', description: 'WhatsApp number for click-to-chat' },
    { key: 'address', value: 'No.419/9-1, Pillaiyar Koil Street, Kuthambakkam, Chennai - 600124, Tamil Nadu', description: 'Registered Factory & Office Address' },
    { key: 'website', value: 'https://liftandreach.in', description: 'Official Website Domain (Original footer had www.liftandreach.com; TODO: verify domain ownership)' },
    { key: 'google_map_embed', value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.671372579121!2d80.0215!3d13.0565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a528a470126ff55%3A0xc39115bbf088eb8!2sKuthambakkam%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin', description: 'Google Map Embed URL' },
    { key: 'quality_policy', value: 'Our quality policy is to supply Superior Quality products to the entire satisfaction of our customers and it is our first and foremost task to assure our customers a feel of confidence in the quality and performance of our products.', description: 'Company Quality Policy statement' },
    { key: 'opening_hours_mon_tue', value: '6.00 am - 10.00 pm', description: 'Mon - Tues Operating Hours from old site' },
    { key: 'opening_hours_wed_thu', value: '8.00 am - 6.00 pm', description: 'Wed - Thurs Operating Hours from old site' },
    { key: 'opening_hours_fri', value: '3.00 pm - 8.00 pm', description: 'Fri Operating Hours from old site' },
    { key: 'opening_hours_sun', value: 'Closed', description: 'Sunday Operating Hours (Colosed on old site)' }
  ];

  for (const s of settingsData) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value, description: s.description },
      create: s
    });
  }

  // 2. Admin User
  console.log('Seeding admin user...');
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@liftandreach.in';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@LiftReach2026!';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword, name: process.env.ADMIN_NAME || 'System Administrator' },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: process.env.ADMIN_NAME || 'System Administrator'
    }
  });

  // 3. Hero Slides
  console.log('Seeding hero slides...');
  const heroSlidesData = [
    {
      title: 'Lift and Reach Equipments',
      subtitle: 'A Way To Reach The Goal',
      badge: '25+ Years Industrial Excellence',
      image: '/images/product/bannerhome.png',
      ctaText: 'View Products',
      ctaLink: '/products',
      ctaText2: 'Get a Quote',
      ctaLink2: '/contact',
      sortOrder: 1,
      isActive: true
    },
    {
      title: 'Heavy Duty Material Handling Solutions',
      subtitle: 'Hydraulic Scissor Lifts, Goods Lifts & Aerial Access Platforms',
      badge: 'Engineered For Superior Safety & Reliability',
      image: '/images/product/bannerhome1.png',
      ctaText: 'Explore Categories',
      ctaLink: '/products',
      ctaText2: 'Request Quote',
      ctaLink2: '/contact',
      sortOrder: 2,
      isActive: true
    },
    {
      title: 'Custom Built Industrial Hydraulics',
      subtitle: 'Customized capacities up to 25 Tons and elevations up to 25 Meters',
      badge: 'Concept To Commissioning',
      image: '/images/product/bannerhome2.png',
      ctaText: 'Our Full Catalog',
      ctaLink: '/products',
      ctaText2: 'Contact Engineering',
      ctaLink2: '/contact',
      sortOrder: 3,
      isActive: true
    }
  ];

  await prisma.heroSlide.deleteMany();
  for (const slide of heroSlidesData) {
    await prisma.heroSlide.create({ data: slide });
  }

  // 4. About Page structured content
  console.log('Seeding about page...');
  const aboutBlocks = {
    title: 'About Us',
    heading: 'Welcome To LIFT AND REACH EQUIPMENTS',
    tagline: 'A Way To Reach The Goal',
    paragraphs: [
      'Lift and Reach Equipments is Hydraulic equipment Manufacturing Company, located in Sriperumpudur, Chennai, in the state of Tamil Nadu registered under the laws of "The Republic of India".',
      'Lift and Reach Equipments has wide product expertise in design, development and manufacturing with more than 25 years of broad industrial experience in the field of manufacturing Hydraulics material handling equipments and Aerial access platforms.',
      'Lift and Reach Equipments takes a product from the concept stage, all the way to the final product with superior quality. We understand various product development challenges that are typical to an industry. This helps us to address the entire product lifecycle, starting from feasibility study, through conceptual design, detailed design, analysis & simulation, manufacturing and testing.',
      'By extensive industrial best engineering practices, Lift and Reach Equipments supports customers by analyzing their actual requirement to improve their productivity with our specially designed material handling hydraulic equipments.',
      'Custom built Truck mounted/Towable Aerial access platforms up to 25 Meters height, Hydraulic Scissor lifting tables with different height and capacity (Height up to 12 Meters capacity up to 25 Tons), aircraft jacks, special purpose machines are our special products among our variety of products.',
      'Standard products in the array are Pallet truck, Stacker, Dock Leveler, Floor cranes, Drum lifter cum tilter and so on.'
    ],
    serviceSection: {
      subheading: 'Best Services We Provide',
      text: 'After sales service support is an integral part of our industry, We have a separate team of service technicians who visit the customer sites to give a best service experience to the customer. After sales, services and spares are assured with this team.'
    },
    stats: [
      { label: 'Industrial Experience', value: '25+', unit: 'Years' },
      { label: 'Aerial Platform Height', value: 'Up to 25', unit: 'Meters' },
      { label: 'Scissor Table Height', value: 'Up to 12', unit: 'Meters' },
      { label: 'Scissor Lift Capacity', value: 'Up to 25', unit: 'Tons' }
    ],
    processTimeline: [
      { step: '01', title: 'Feasibility Study', desc: 'Analyzing customer site, load profiles, operating environment and functional constraints.' },
      { step: '02', title: 'Conceptual Design', desc: 'Developing ergonomic and structural architecture aligned with industrial standards.' },
      { step: '03', title: 'Detailed Design', desc: 'Precision mechanical, hydraulic and electrical drafting with exact tolerances.' },
      { step: '04', title: 'Analysis & Simulation', desc: 'Stress, load distribution, and structural FEA verification under maximum design loads.' },
      { step: '05', title: 'Manufacturing', desc: 'State-of-the-art fabrication, machining, cylinder assembly and high-grade finishing.' },
      { step: '06', title: 'Testing & Quality Check', desc: 'Full hydraulic pressure testing, static overload testing, and multi-point safety validation.' }
    ],
    galleryImages: [
      '/images/product/DOCK LEVELLER.jpg',
      '/images/product/AIR CRAFT JACKS.jpg',
      '/images/product/HYDRAULIC FLOOR CRANE - LIGHT DUTY.jpg',
      '/images/product/hydraulic barrel lifter tilter.jpg'
    ]
  };

  await prisma.page.upsert({
    where: { slug: 'about' },
    update: { title: 'About Lift and Reach Equipments', content: aboutBlocks },
    create: { slug: 'about', title: 'About Lift and Reach Equipments', content: aboutBlocks }
  });

  // 5. Categories and Products
  console.log('Seeding categories and products...');

  // Helper arrays for applications / industries
  const scissorApplications = [
    'Loading & Unloading of heavy loads from Truck containers',
    'Material Shifting from Ground floor to first & Second floor',
    'Conveyor loading / Unloading',
    'Lifting people for performing maintenance in different heights at construction sites',
    'Lifting Cargoes, forklift, from ground to different floors'
  ];
  const scissorApplicationAreas = [
    'Assembly', 'Automation', 'Coil Handling', 'Hazardous environment', 'Loading Docks',
    'Machine Loading', 'Material Rotation', 'Moving material across floors',
    'Truck Loading & Unloading', 'Working at Heights', 'Man Lifting for Height Access', 'High Travel'
  ];
  const scissorIndustries = [
    'Builders', 'Cement Industry', 'Infrastructure', 'Mining', 'Aerospace', 'Electronics',
    'Chemicals', 'Coal & Minerals', 'Energy & Oil', 'Food & Beverage', 'Paper',
    'Infrastructure Projects', 'Leather', 'Manufacturing', 'Metal Working', 'Printing and Stationery',
    'Pharmaceuticals', 'Railways', 'Retail', 'Steel and Aluminum Plant', 'Warehouses',
    'Wood working', 'Gas Distribution and Logistics', 'Plastics and Polymers', 'Hospitality',
    'Facility Management', 'Expo and Convention Center', 'Media and OOH', 'Rubber and Rubber Products',
    'Scrap and Recycling', 'FMCG', 'Fisheries', 'Food Processing', 'Coir and Mattress',
    'Construction Material', 'Glass Industry', 'Textiles and Cloth'
  ];

  const goodsLiftApplications = [
    'Wall Mounting, can be kept outside the building to reach second floor',
    'Material handling in Logistics mezzanine floor',
    'Widely used to transfer material from one floor to another'
  ];
  const goodsLiftIndustries = [
    'Chemicals', 'Food & Beverage', 'Leather', 'Pharmaceuticals', 'Printing and Stationery',
    'Warehouses', 'Wood working', 'Logistics', 'Agriculture', 'Air Force',
    'Heavy Equipment Manufacturing', 'Rubber and Rubber Products', 'Scrap and Recycling',
    'FMCG', 'E-commerce'
  ];

  const aerialApplications = [
    'High Travel', 'Man Lifting for Height Access', 'Working at Heights',
    'Maintenance of Street Lights', 'Tower lamps', 'Inside & outside cleaning of Glass Doors at heights of inaccessible areas'
  ];
  const aerialIndustries = [
    'Air Force', 'Army', 'Automobiles', 'Builders', 'Coal & Minerals', 'Electronics',
    'Energy & Oil', 'FMCG', 'Gas Distribution and Logistics', 'Hazardous Substances',
    'Infrastructure', 'Infrastructure Projects', 'Leather', 'Plastics and Polymers',
    'Power Generation and Distribution', 'Roof Maintenance', 'Soya', 'Steel and Aluminum Plant'
  ];
  const aerialApplicationAreas = [
    'Agriculture & forestry', 'Bridge & under bridge', 'Broadcasting', 'Energy supply',
    'Film & media', 'Highway maintenance', 'Local authorities', 'Roofing', 'Street lighting',
    'Surveying', 'Telecommunications etc.'
  ];

  const stackerApplications = [
    'Automation', 'Bin and Basket', 'Building Up Stacks', 'High Travel', 'Loading Docks',
    'Machine Loading', 'Material Rotation', 'Moving material across floors', 'Truck Loading & Unloading'
  ];
  const stackerIndustries = ['FMCG', 'Logistics', 'Rubber and Rubber Products'];

  const palletTruckApplications = ['Assembly', 'Material Rotation', 'Moving material across floors'];
  const palletTruckIndustries = [
    'Agriculture', 'Automobiles', 'Cement Industry', 'Coir and Mattress', 'Construction Material',
    'Electronics', 'Facility Management', 'Hospitality', 'Logistics', 'Manufacturing',
    'Metal Working', 'Milk and Diary', 'Paper', 'Pharmaceuticals', 'Plastics and Polymers',
    'Printing and Stationery', 'Railways', 'Retail', 'Rubber and Rubber Products',
    'Textiles and Cloth', 'Warehouses', 'Air Force', 'Coal & Minerals', 'Energy & Oil',
    'Food & Beverage', 'Infrastructure Projects', 'Leather', 'Steel and Aluminum Plant',
    'Wood working', 'Gas Distribution and Logistics', 'Ports', 'Power Generation and Distribution',
    'Scrap and Recycling', 'FMCG', 'E-commerce', 'Food Processing', 'Glass Industry', 'Soya'
  ];

  const zeroLiftApplications = [
    'Used for lifting heavy loads from Ground level to the required heights',
    'Example: Car Lift, Loading Docks, Truck Loading & Unloading, Machine Loading, Hazardous environment'
  ];
  const zeroLiftIndustries = [
    'Automobile Dealers', 'Aviation', 'Chemicals', 'Fisheries', 'FMCG', 'Food & Beverage',
    'Gas Distribution and Logistics', 'Heavy Equipment Manufacturing', 'Logistics',
    'Pharmaceuticals', 'Textiles and Cloth', 'Warehouses', 'Wood working', 'Coal & Minerals',
    'Energy & Oil', 'Hazardous Substances', 'Heavy Equipment & Maintenance', 'Paper',
    'Infrastructure Projects', 'Leather', 'Manufacturing', 'Metal Working', 'Milk and Diary',
    'Municipality', 'Printing and Stationery', 'Retail', 'Showrooms', 'Steel and Aluminum Plant',
    'Vetenary and Animal', 'Plastics and Polymers', 'Hospitality', 'Expo and Convention Center',
    'Power Generation and Distribution', 'Rubber and Rubber Products', 'Scrap and Recycling',
    'Food Processing', 'Coir and Mattress', 'Construction Material', 'Glass Industry', 'Nuclear Power', 'Sugar'
  ];

  const barrelLifterApplications = [
    'This is the Equipment for handling, lifting, weighing, transporting and dispensing of drums and barrels, extensively used in chemical and petroleum and shipping industries. We are provided with Manual and Semi Electric Drum stackers.'
  ];
  const barrelLifterIndustries = ['Chemical', 'Petroleum', 'Shipping industries'];

  const floorCraneApplications = [
    'To replace dies from a machine/press.',
    'To dismantle and assemble engine from vehicles.',
    'To load and unload components in CNC machines.'
  ];
  const floorCraneDescription = 'Hydraulic Floor Crane is widely used to replace dies from machines or press, as when the load is suspended the adjustment is easy while fitting on a machine or press.';

  const dockLevelerApplications = [
    'Machine Loading', 'Truck Loading & Unloading', 'Loading Docks',
    'Dock Levelers are the crucial part of loading bay area. Usage of dock leveler aids in fast loading and unloading of goods at warehouse. Dock leveler acts as bridge between loading bay area and truck, height difference between truck and bay area is bridged and material movement can be carried out smoothly between warehouse and truck.'
  ];
  const dockLevelerIndustries = [
    'Automobile Dealers', 'Chemicals', 'Food Processing', 'Logistics', 'Paper',
    'Pharmaceuticals', 'Warehouses', 'Automobiles', 'Rubber and Rubber Products', 'FMCG'
  ];
  const dockLevelerDescription = 'Loading & Unloading of Goods from truck. (Bridge between Dock & Truck). Dock Levelers is placed at the exterior of the building in a loading bay.';

  const aircraftJacksDescription = 'Aircraft jacks are a vital part of any ground support maintenance program. 1. Axle Jacks - An axle jack is a portable, self-contained hydraulic jack. Axle aircraft jacks are used for aircraft maintenance involving tire repair and replacement, brake service repair and other maintenance procedures when lifting the nose and/or main landing gear is necessary. Axle jacks are placed directly on or under aircraft landing gear. 2. Tripod Jacks';
  const aircraftJacksApplications = [
    'Ground support maintenance program',
    'Tire repair and replacement on aircraft landing gear',
    'Brake service repair and heavy maintenance procedures',
    'Lifting the nose and/or main landing gear'
  ];
  const aircraftJacksIndustries = ['Aviation', 'Air Force', 'Aerospace Defense', 'Aircraft MRO'];

  const hollowRamDescription = 'STANDARD AND CUSTOMIZED SINGLE AND DOUBLE ACTING HYDRAULIC JACKS. Hollow and Solid Ram hydraulic jacks designed for heavy mechanical extraction, stressing, pulling, pressing and high tonnage lifting operations.';
  const hollowRamApplications = [
    'Heavy mechanical extraction and pin pressing',
    'Post-tensioning and cable prestressing',
    'Heavy equipment maintenance and alignment',
    'High-tonnage industrial lifting'
  ];
  const hollowRamIndustries = ['Heavy Engineering', 'Infrastructure', 'Construction', 'Mining', 'Manufacturing'];

  // Delete existing categories and products to prevent duplicates during re-seeding
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // -------------------------------------------------------------
  // Category 1: Scissor Lift
  // -------------------------------------------------------------
  const catScissor = await prisma.category.create({
    data: {
      name: 'Scissor Lift',
      slug: 'scissor-lift',
      image: '/images/product/scissor lift.jpg',
      description: 'Engineered hydraulic scissor lift tables and platforms offering unmatched safety, structural rigidity and smooth elevation for material handling across levels and dock operations.',
      applications: scissorApplications,
      industries: scissorIndustries,
      applicationAreas: scissorApplicationAreas,
      sortOrder: 1,
      isActive: true
    }
  });

  // Subcategory 1.1: Scissor Lift - Hydraulic
  const catScissorHydraulic = await prisma.category.create({
    data: {
      parentId: catScissor.id,
      name: 'Scissor Lift - Hydraulic',
      slug: 'scissor-lift-hydraulic',
      image: '/images/product/Scissor Lift- Pit Mounted.jpg',
      description: 'Hydraulic scissor lifting tables available in pit mounted, floor mounted, towable customized, die loader, and heavy duty industrial variants.',
      applications: scissorApplications,
      industries: scissorIndustries,
      applicationAreas: scissorApplicationAreas,
      sortOrder: 1,
      isActive: true
    }
  });

  // Products under 1.1 Scissor Lift - Hydraulic
  await prisma.product.create({
    data: {
      categoryId: catScissorHydraulic.id,
      code: 'LRSLT-1.0T-1.5M / LRSLT-2.0T-3M / LRSLT-3.0T-4.5M',
      name: 'Pit Mounted / Floor Mounted',
      slug: 'pit-mounted-floor-mounted',
      shortDesc: 'Scissor Lift Hydraulic - Pit Mounted / Floor Mounted',
      description: 'Scissor Lift Hydraulic - Pit Mounted / Floor Mounted designed for robust vertical lifting from ground level up to 4500 mm. Custom built configurations support capacities up to 25000 Kgs and heights up to 10000 MM.',
      applications: scissorApplications,
      industries: scissorIndustries,
      applicationAreas: scissorApplicationAreas,
      images: ['/images/product/Scissor Lift- Pit Mounted.jpg', '/images/product/scissor lift.jpg'],
      specTables: [
        {
          title: 'Specifications',
          columns: ['TYPE', 'LRSLT-1.0T-1.5M', 'LRSLT-2.0T-3M', 'LRSLT-3.0T-4.5M'],
          rows: [
            { label: 'CAPACITY', values: ['1 TON', '2 TONS', '3 TONS'] },
            { label: 'CLOSED HT.', values: ['300 MM', '600 MM', '750 MM'] },
            { label: 'RAISED HT.FROM GL', values: ['1500', '3000', '4500'] },
            { label: 'PLATFORM SIZE', values: ['2000 x 1500', '2500 x 1800', '2500 x 2000'] }
          ]
        }
      ],
      notes: ['CUSTOM BUILT: CAPACITY FROM 500 KGS TO 25000 KGS AND HEIGHT FROM 150 MM TO 10000 MM HEIGHT'],
      sortOrder: 1,
      isActive: true
    }
  });

  await prisma.product.create({
    data: {
      categoryId: catScissorHydraulic.id,
      code: 'LRSTW-0.3T-6.0/9.0/11.0M / LRSTW-0.5T-6.0/9.0/11.0M',
      name: 'Towable-Customized',
      slug: 'towable-customized',
      shortDesc: 'Scissor Lift Hydraulic - Towable',
      description: 'Scissor Lift Hydraulic - Towable with 5 HP 415V AC powerpack, heavy duty outriggers and versatile height reach up to 11000 mm for maintenance and warehouse elevation.',
      applications: scissorApplications,
      industries: scissorIndustries,
      applicationAreas: scissorApplicationAreas,
      images: ['/images/product/Scissor Lift- Towable 2.jpg', '/images/product/Scissor Lift- Towable.jpg'],
      specTables: [
        {
          title: 'Specifications',
          columns: ['TYPE', 'LRSTW-0.3T-6.0/9.0/11.0M', 'LRSTW-0.5T-6.0/9.0/11.0M'],
          rows: [
            { label: 'CAPACITY', values: ['300 Kgs', '500 Kgs'] },
            { label: 'CLOSED HT.', values: ['1300 MM', '1350 MM'] },
            { label: 'RAISED HT.FROM GL', values: ['6000/9000/11000 MM', '6000/9000/11000 MM'] },
            { label: 'PLATFORM SIZE', values: ['2200 X 1000 MM', '2250 x 1300 MM'] },
            { label: 'POWER PACK', values: ['5 HP / 415V,AC', '5 HP / 415V,AC'] }
          ]
        }
      ],
      notes: [],
      sortOrder: 2,
      isActive: true
    }
  });

  await prisma.product.create({
    data: {
      categoryId: catScissorHydraulic.id,
      code: 'LRSDL-0.5T-0.9M / LRSDL-1T-1M',
      name: 'Die Loader',
      slug: 'die-loader',
      shortDesc: 'Scissor Lift - Die Loader',
      description: 'Precision hydraulic die loading table engineered for heavy die handling onto power presses, injection molding and stamping machinery. Optional gravity rollers and ball transfer units available.',
      applications: scissorApplications,
      industries: scissorIndustries,
      applicationAreas: scissorApplicationAreas,
      images: ['/images/product/Scissor Lift- Die Loader.jpg'],
      specTables: [
        {
          title: 'Specifications',
          columns: ['TYPE', 'LRSDL-0.5T-0.9M', 'LRSDL-1T-1M'],
          rows: [
            { label: 'CAPACITY', values: ['500 Kgs', '1000 Kgs'] },
            { label: 'CLOSED HT.', values: ['350 MM', '400 MM'] },
            { label: 'RAISED HT.FROM GL', values: ['900 MM', '1000 MM'] },
            { label: 'PLATFORM SIZE', values: ['1000 x 500 MM', '1500 x 1000 MM'] }
          ]
        }
      ],
      notes: ['SCISSOR LIFT OPTIONALS - TABLE WITH GRAVITY ROLLERS, BALL TRANSFER UNITS ON TOP TOWARDS DIE LOADING ETC'],
      sortOrder: 3,
      isActive: true
    }
  });

  await prisma.product.create({
    data: {
      categoryId: catScissorHydraulic.id,
      code: 'LRSHD-10T-1.5M',
      name: 'Heavy Duty',
      slug: 'heavy-duty',
      shortDesc: 'Scissor Lift Hydraulic Heavy Duty - Customized',
      description: 'Extreme-capacity 10-ton hydraulic scissor table designed for steel mills, heavy equipment manufacturing, coil loading and industrial pressing lines.',
      applications: scissorApplications,
      industries: scissorIndustries,
      applicationAreas: scissorApplicationAreas,
      images: ['/images/product/Scissor Lift- Heavy Duty.jpg'],
      specTables: [
        {
          title: 'Specifications',
          columns: ['TYPE', 'LRSHD-10T-1.5M'],
          rows: [
            { label: 'CAPACITY', values: ['10000 Kgs'] },
            { label: 'CLOSED HT.', values: ['900 MM'] },
            { label: 'RAISED HT.FROM GL', values: ['1500 MM'] },
            { label: 'PLATFORM SIZE', values: ['1200 x 970 MM'] },
            { label: 'POWER PACK', values: ['5 HP - 10 HP / 415 V, AC'] }
          ]
        }
      ],
      notes: [],
      sortOrder: 4,
      isActive: true
    }
  });

  // Direct Scissor Lift Sub-products / Variants under Scissor Lift
  await prisma.product.create({
    data: {
      categoryId: catScissor.id,
      code: 'LRSSP-0.3T-10M / LRSSP-0.4T-8.0M',
      name: 'Scissor Lift - Self Propelled',
      slug: 'scissor-lift-self-propelled',
      shortDesc: 'Scissor Lift Self Propelled - Battery Operated',
      description: 'Self propelled battery operated scissor lift with proportional drive controls, high maneuverability and lifting reach up to 10000 MM. Suitable for facility maintenance and high rack warehousing.',
      applications: scissorApplications,
      industries: scissorIndustries,
      applicationAreas: scissorApplicationAreas,
      images: ['/images/product/Scissor Lift- Self Propelled 1.jpg', '/images/product/Scissor Lift- Self Propelled.jpg'],
      specTables: [
        {
          title: 'Specifications',
          columns: ['TYPE', 'LRSSP-0.3T-10M', 'LRSSP-0.4T-8.0M'],
          rows: [
            { label: 'CAPACITY', values: ['300 Kgs', '400 Kgs'] },
            { label: 'CLOSED HT.', values: ['2500 MM', '2500 MM'] },
            { label: 'RAISED HT.FROM GL', values: ['10000 MM', '8000 MM'] },
            { label: 'PLATFORM SIZE', values: ['2250 X 1100 MM', '2250 X 1100 MM'] },
            // FLAG: Second model battery lists 25 V/ 225 Ah (likely 24 V typo on old site). Kept as-is.
            { label: 'BATTERY', values: ['24 V/ 225 Ah', '25 V/ 225 Ah (Note: listed as 25V on original site)'] }
          ]
        }
      ],
      notes: ['FLAG NOTE: Second model battery listed on original site as 25 V/ 225 Ah (likely a 24 V typo). Stored verbatim.'],
      sortOrder: 2,
      isActive: true
    }
  });

  await prisma.product.create({
    data: {
      categoryId: catScissor.id,
      code: 'LRSTM-1.5T-7.5M',
      name: 'Truck Mounted',
      slug: 'truck-mounted',
      shortDesc: 'Scissor Lift Hydraulic - Truck Mounted - Customized',
      description: 'Vehicle chassis integrated hydraulic scissor platform powered via vehicle PTO or auxiliary AC powerpack. Ideal for municipal lighting, highway signage and industrial mobile height access.',
      applications: scissorApplications,
      industries: scissorIndustries,
      applicationAreas: scissorApplicationAreas,
      images: ['/images/product/Scissor Lift -Truck Mounted.jpg'],
      specTables: [
        {
          title: 'Specifications',
          columns: ['TYPE', 'LRSTM-1.5T-7.5M'],
          rows: [
            { label: 'CAPACITY', values: ['1500 Kgs'] },
            { label: 'CLOSED HT.', values: ['1200 MM'] },
            { label: 'RAISED HT.FROM GL', values: ['7500 MM'] },
            { label: 'PLATFORM SIZE', values: ['2500 x 1500 MM'] },
            { label: 'POWER', values: ['FROM PTO, AC POWER PACK'] }
          ]
        }
      ],
      notes: [],
      sortOrder: 3,
      isActive: true
    }
  });

  await prisma.product.create({
    data: {
      categoryId: catScissor.id,
      code: 'ELECTRIC-SCISSOR-BS',
      name: 'Electric Scissor Lift',
      slug: 'electric-scissor-lift',
      shortDesc: 'Electric Scissor Lift with Ball Screw Actuator',
      description: 'ELECTRIC SCISSOR LIFT WITH BALL SCREW ACTUATOR UP TO 2000 KG CAPACITY AVAILABLE WITH GEARED MOTOR TRACTION MOVEMENT.',
      applications: scissorApplications,
      industries: scissorIndustries,
      applicationAreas: scissorApplicationAreas,
      images: ['/images/product/electric scissor lift.jpg'],
      specTables: [],
      notes: ['ELECTRIC SCISSOR LIFT WITH BALL SCREW ACTUATOR UP TO 2000 KG CAPACITY AVAILABLE WITH GEARED MOTOR TRACTION MOVEMENT'],
      sortOrder: 4,
      isActive: true
    }
  });

  // 1.5 Crawled: scissor lift TOWABLE (Multi Scissor)-Electric.php
  await prisma.product.create({
    data: {
      categoryId: catScissor.id,
      code: 'LRSLT-0.3T-6M/9M/11M / LRSLT-0.5T-6M/9M/11M',
      name: 'Towable (Multi Scissor)',
      slug: 'towable-multi-scissor',
      shortDesc: 'Towable (Multi Scissor) - Electric',
      description: 'Multi-stage scissor lift mechanism mounted on a towable wheeled chassis. Equipped with 5 HP 415 V AC power pack, extending reach to 6000, 9000, or 11000 mm heights. DC version also available.',
      applications: scissorApplications,
      industries: scissorIndustries,
      applicationAreas: scissorApplicationAreas,
      images: ['/images/product/Scissor Lift- Towable 1.jpg'],
      specTables: [
        {
          title: 'Specifications',
          columns: ['TYPE', 'LRSLT-0.3T-6M/9M/11M', 'LRSLT-0.5T-6M/9M/11M'],
          rows: [
            { label: 'CAPACITY', values: ['300 Kg', '500 Kg'] },
            { label: 'CLOSED HEIGHT', values: ['1335 MM', '1360 MM'] },
            { label: 'RAISED HT.FROM GL', values: ['6000/9000/11000 MM', '6000/9000/11000 MM'] },
            { label: 'PLATFORM SIZE', values: ['2200 X 1000 mm', '2250 X 1300 mm'] },
            { label: 'POWER PACK', values: ['5 HP / 415 V, AC', '5 HP / 415 V, AC'] }
          ]
        }
      ],
      notes: ['DC VERSION ALSO AVAILABLE'],
      sortOrder: 5,
      isActive: true
    }
  });

  await prisma.product.create({
    data: {
      categoryId: catScissor.id,
      code: 'LRSLT-2.0T-3M / LRSTR-10.0T-1.5M',
      name: 'Traction-Customized',
      slug: 'traction-customized',
      shortDesc: 'Scissor Lift - Traction',
      description: 'Heavy duty traction scissor lift featuring motorized travel drive for self-contained longitudinal material transfer. Built in both AC and DC versions.',
      applications: scissorApplications,
      industries: scissorIndustries,
      applicationAreas: scissorApplicationAreas,
      images: ['/images/product/Scissor Lift- Traction.jpg', '/images/product/scissor lift TRACTION.jpg'],
      specTables: [
        {
          title: 'Specifications',
          columns: ['TYPE', 'LRSLT-2.0T-3M', 'LRSTR-10.0T-1.5M'],
          rows: [
            { label: 'CAPACITY', values: ['2000 Kg', '10000 Kgs'] },
            { label: 'CLOSED HEIGHT', values: ['1700 MM', '1000 MM'] },
            { label: 'RAISED HT.FROM GL', values: ['3000 MM', '1500 MM'] },
            { label: 'PLATFORM SIZE', values: ['3500 X 1250 mm', '3000 X 2000 MM'] }
          ]
        }
      ],
      notes: ['BOTH AC, DC VERSION AVAILABLE'],
      sortOrder: 6,
      isActive: true
    }
  });

  await prisma.product.create({
    data: {
      categoryId: catScissor.id,
      code: 'LRSTW-0.5-0.8M / LRSTW-0.75-0.9M / LRSTW-0.8-1.5M',
      name: 'Light Duty (Manual)',
      slug: 'light-duty-manual',
      shortDesc: 'Hydraulic Towable Scissor Table Battery Operated / Manual under Light Duty Model',
      description: 'Compact mobile scissor lift tables operated via foot pedal or battery operated hydraulic unit with mechanical safety lock. Perfect for workshop tooling, bench loading and assembly line ergonomics.',
      applications: scissorApplications,
      industries: scissorIndustries,
      applicationAreas: scissorApplicationAreas,
      images: ['/images/product/Scissor Lift- LIGHT WEIGHT.jpg', '/images/product/Scissor Lift- LIGHT WEIGHT 1.jpg'],
      specTables: [
        {
          title: 'Specifications',
          columns: ['TYPE', 'LRSTW-0.5-0.8M', 'LRSTW-0.75-0.9M', 'LRSTW-0.8-1.5M'],
          rows: [
            { label: 'CAPACITY', values: ['500 Kg', '750 Kg', '800 Kg'] },
            { label: 'MAX. LIFTING HEIGHT', values: ['880 MM', '900 MM', '1500 MM'] },
            { label: 'MIN. HEIGHT', values: ['285 MM', '420 MM', '445 MM'] },
            { label: 'PLATFORM SIZE', values: ['815 x 500 x 50 mm', '1000 x 510 x 55 mm', '1220 x 610 mm'] },
            { label: 'MODE OF OPERATION', values: ['Foot Pedal / BO', 'Foot Pedal / BO', 'Foot Pedal / BO'] },
            { label: 'SAFETY FEATURE', values: ['Mechanical Lock', 'Mechanical Lock', 'Mechanical Lock'] }
          ]
        }
      ],
      notes: ['MODE OF OPERATION: Foot Pedal / Battery Operated', 'SAFETY FEATURE: Mechanical Lock'],
      sortOrder: 7,
      isActive: true
    }
  });

  await prisma.product.create({
    data: {
      categoryId: catScissor.id,
      code: 'LRSLT-0.8T-1.5M',
      name: 'Rollers on Top (Manual)',
      slug: 'rollers-on-top-manual',
      shortDesc: 'Scissor Lift - Roller on Top - Manual',
      description: 'Manual hydraulic scissor table equipped with integrated gravity roller conveyor bed on top for frictionless die loading and continuous inline package handling.',
      applications: scissorApplications,
      industries: scissorIndustries,
      applicationAreas: scissorApplicationAreas,
      images: ['/images/product/Scissor Lift- Rollers On Top 2.jpg'],
      specTables: [
        {
          title: 'Specifications',
          columns: ['TYPE', 'LRSLT-0.8T-1.5M'],
          rows: [
            { label: 'CAPACITY', values: ['800 Kg'] },
            { label: 'CLOSED HEIGHT', values: ['600 MM'] },
            { label: 'RAISED HT.FROM GL', values: ['1500 MM'] },
            { label: 'PLATFORM SIZE', values: ['1250 X 1250 MM'] },
            { label: 'OPERATING', values: ['MANUAL'] }
          ]
        }
      ],
      notes: [],
      sortOrder: 8,
      isActive: true
    }
  });

  await prisma.product.create({
    data: {
      categoryId: catScissor.id,
      code: 'LRSLT-2.5T-2.0M',
      name: 'Rollers on Top-Customized',
      slug: 'rollers-on-top-customized',
      shortDesc: 'Scissor Lift - Roller on Top - Customized',
      description: 'Heavy 2.5 Ton customized scissor table with heavy duty roller top bed. Built in both AC and DC versions to integrate into high-volume manufacturing and logistics conveyances.',
      applications: scissorApplications,
      industries: scissorIndustries,
      applicationAreas: scissorApplicationAreas,
      images: ['/images/product/Scissor Lift- Rollers On Top 1.jpg', '/images/product/Scissor Lift- Rollers On Top.jpg'],
      specTables: [
        {
          title: 'Specifications',
          columns: ['TYPE', 'LRSLT-2.5T-2.0M'],
          rows: [
            { label: 'CAPACITY', values: ['2500 Kg'] },
            { label: 'CLOSED HEIGHT', values: ['600 MM'] },
            { label: 'RAISED HT.FROM GL', values: ['2000 MM'] },
            { label: 'PLATFORM SIZE', values: ['2000 X 2650 mm'] },
            { label: 'POWERPACK', values: ['BOTH AC, DC VERSION AVAILABLE'] }
          ]
        }
      ],
      notes: ['BOTH AC, DC VERSION AVAILABLE'],
      sortOrder: 9,
      isActive: true
    }
  });

  // -------------------------------------------------------------
  // Category 2: Goods Lift
  // -------------------------------------------------------------
  const catGoodsLift = await prisma.category.create({
    data: {
      name: 'Goods Lift',
      slug: 'goods-lift',
      image: '/images/product/GOODS LIFT.JPG',
      description: 'Goods lifts are used wherever safety lifting required for different types of material from ground to different floors. Example: Canteen located at different floors, super markets, show rooms, etc.',
      applications: goodsLiftApplications,
      industries: goodsLiftIndustries,
      applicationAreas: ['Mezzanine Floors', 'Multi-level Warehouses', 'Industrial Canteens', 'Automotive Showrooms'],
      sortOrder: 2,
      isActive: true
    }
  });

  await prisma.product.create({
    data: {
      categoryId: catGoodsLift.id,
      code: 'LRGL-SA-500K / LRGL-SA-1000K / LRGL-SA-2000K',
      name: 'Single and Double Column (Standalone Structure)',
      slug: 'single-and-double-column-standalone-structure',
      shortDesc: 'Goods Lift - Standalone Structure',
      description: 'Self-supporting standalone column goods lift structure. Operates safely up to 6 Meters without requiring structural wall anchoring. Fitted with interlocking safety gates.',
      applications: goodsLiftApplications,
      industries: goodsLiftIndustries,
      applicationAreas: ['Logistics Hubs', 'Mezzanines', 'Warehouses'],
      images: ['/images/product/GOODS LIFT.JPG', '/images/product/GOODS LIFT 1.jpg', '/images/product/GOODS LIFT 2.jpg'],
      specTables: [
        {
          title: 'Specifications',
          columns: ['CAPACITY', '500 Kgs', '1000 Kgs', '2000 Kgs'],
          rows: [
            { label: 'HEIGHT', values: ['6 METERS', '6 METERS', '6 METERS'] },
            { label: 'BASKET SIZE', values: ['1200 X 1200 X 1200 HT MM', '1500 X 1500 X 1200 HT MM', '1500 X 1500 X 1200 HT MM'] }
          ]
        }
      ],
      notes: [],
      sortOrder: 1,
      isActive: true
    }
  });

  await prisma.product.create({
    data: {
      categoryId: catGoodsLift.id,
      code: 'LRGL-WM-500 / LRGL-WM-1000K / LRGL-WM-2000K',
      name: 'Single and Double Column (Wall Mounted)',
      slug: 'single-and-double-column-wall-mounted',
      shortDesc: 'Goods Lift - Wall Mounting',
      description: 'Wall anchored vertical hydraulic goods elevator reaching up to 12 Meters. Can be installed outside the building or against existing civil pillars to connect upper floors directly.',
      applications: goodsLiftApplications,
      industries: goodsLiftIndustries,
      applicationAreas: ['External Building Cladding', 'Factory Walls', 'Commercial Buildings'],
      images: ['/images/product/GOODS LIFT wall mounted.jpg', '/images/product/GOODS LIFT 3.jpg'],
      specTables: [
        {
          title: 'Specifications',
          // FLAG: First column capacity in old site is "500" with no unit. Kept verbatim.
          columns: ['CAPACITY', '500 (Note: Unit not specified in old site, assumed Kg)', '1000 Kg', '2000 Kg'],
          rows: [
            { label: 'HEIGHT', values: ['12 METERS', '12 METERS', '12 METERS'] },
            { label: 'BASKET SIZE', values: ['1200 X 1200 X1200 HT MM', '1500 X 1500 X1200 HT MM', '1500 X 1500 X1200 HT MM'] }
          ]
        }
      ],
      notes: ['FLAG NOTE: First column capacity is "500" without unit on original site. Assumed Kg.'],
      sortOrder: 2,
      isActive: true
    }
  });

  // SPM placeholder - inactive as per spec
  await prisma.product.create({
    data: {
      categoryId: catGoodsLift.id,
      code: 'SPM-CUSTOM',
      name: 'SPM',
      slug: 'spm',
      shortDesc: 'Special Purpose Machines - Customized Engineering',
      description: 'Special Purpose Machines tailored to specific material elevation and production line constraints. (No content page existed on original site).',
      applications: goodsLiftApplications,
      industries: goodsLiftIndustries,
      applicationAreas: ['Custom Engineering'],
      images: ['/images/product/GOODS LIFT.JPG'],
      specTables: [],
      notes: ['Special Purpose Machines (SPM) - Placeholder entry as noted in specifications. Contact engineering for bespoke requirements.'],
      sortOrder: 3,
      isActive: false // Inactive placeholder as required
    }
  });

  // -------------------------------------------------------------
  // Category 3: Aerial Access Platform
  // -------------------------------------------------------------
  const catAerial = await prisma.category.create({
    data: {
      name: 'Aerial Access Platform',
      slug: 'aerial-access-platform',
      image: '/images/product/aerial.jpg',
      description: 'High-travel articulated and telescopic man-lifting aerial access platforms for exterior building facade cleaning, street lighting maintenance and electrical grid operations up to 25 meters.',
      applications: aerialApplications,
      industries: aerialIndustries,
      applicationAreas: aerialApplicationAreas,
      sortOrder: 3,
      isActive: true
    }
  });

  await prisma.product.create({
    data: {
      categoryId: catAerial.id,
      code: 'LRAPF-200-10M / LRAPF-200-13M / LRAPF-200-16M',
      name: 'Truck Mounted',
      slug: 'aerial-truck-mounted',
      shortDesc: 'Aerial Access Platform - Truck Mounted',
      description: 'Truck mounted aerial man lift platform featuring 360 degree continuous rotation, dual stabilizers, and outreach up to 6000 mm. Driven directly via vehicle PTO or auxiliary electric powerpack.',
      applications: aerialApplications,
      industries: aerialIndustries,
      applicationAreas: aerialApplicationAreas,
      images: ['/images/product/aerial truck mounted.jpg', '/images/product/aerial.jpg'],
      specTables: [
        {
          title: 'Specifications',
          columns: ['TYPE CODE', 'LRAPF-200-10M', 'LRAPF-200-13M', 'LRAPF-200-16M'],
          rows: [
            { label: 'CAPACITY', values: ['200', '200', '200'] },
            { label: 'CLOSED HEIGHT', values: ['3500', '3500', '4000'] },
            { label: 'MAX. WORKING HEIGHT', values: ['10000', '13000', '16000'] },
            { label: 'MAX. OUTREACH', values: ['3500', '4500', '6000'] },
            { label: 'PLATFORM SIZE', values: ['1100 X 750 X 1100', '1100 X 750 X 1100', '1100 X 750 X 1100'] },
            { label: 'ROTATION', values: ['360° Continuous', '360° Continuous', '360° Continuous'] },
            { label: 'STABILIZERS', values: ['2', '2', '2'] },
            { label: 'POWER', values: ['PTO FROM ENGINE', 'PTO FROM ENGINE', 'PTO FROM ENGINE'] }
          ]
        }
      ],
      notes: [
        'TOWABLE OPTION AVAILABLE UPTO 16 METERS WITH AC AND DC OPERATION',
        'CUSTOM BUILT: AC POWER PACK OPTIONAL WITH CABLE DRUM FOR 25 METERS',
        'STANDARD: DC POWER PACK OPTIONAL WITH BATTERY BACK UP UPTO 220 Ah',
        'FLAG NOTE: Original site spec table has no units for capacity (200) and heights (stored raw; assumed kg / mm).'
      ],
      sortOrder: 1,
      isActive: true
    }
  });

  await prisma.product.create({
    data: {
      categoryId: catAerial.id,
      code: 'LRAPF-200-10M / LRAPF-200-13M / LRAPF-200-16M',
      name: 'Towable',
      slug: 'aerial-towable',
      shortDesc: 'Aerial Access Platform - Towable',
      description: 'Towable aerial work platform offering outreach and working heights up to 16 meters. Features stabilizers and balanced towable running gear for rapid deployment across sites.',
      applications: aerialApplications,
      industries: aerialIndustries,
      applicationAreas: aerialApplicationAreas,
      images: ['/images/product/aerial.jpg', '/images/product/aerial truck mounted.jpg'],
      specTables: [
        {
          title: 'Specifications',
          columns: ['TYPE CODE', 'LRAPF-200-10M', 'LRAPF-200-13M', 'LRAPF-200-16M'],
          rows: [
            { label: 'CAPACITY', values: ['200', '200', '200'] },
            { label: 'CLOSED HEIGHT', values: ['3500', '3500', '4000'] },
            { label: 'MAX. WORKING HEIGHT', values: ['10000', '13000', '16000'] },
            { label: 'MAX. OUTREACH', values: ['3500', '4500', '6000'] },
            // FLAG: Platform sizes on old site have typos "1101 X 750 X 1100" and "1102 X 750 X 1100". Kept verbatim.
            { label: 'PLATFORM SIZE', values: ['1100 X 750 X 1100', '1101 X 750 X 1100', '1102 X 750 X 1100'] },
            { label: 'ROTATION', values: ['360° Continuous', '360° Continuous', '360° Continuous'] },
            { label: 'STABILIZERS', values: ['2', '2', '2'] },
            { label: 'POWER', values: ['PTO FROM ENGINE', 'PTO FROM ENGINE', 'PTO FROM ENGINE'] }
          ]
        }
      ],
      notes: [
        'TOWABLE OPTION AVAILABLE UPTO 16 METERS WITH AC AND DC OPERATION',
        'FLAG NOTE: Platform sizes 1101 X 750 X 1100 and 1102 X 750 X 1100 on original site are likely typos. Preserved verbatim.'
      ],
      sortOrder: 2,
      isActive: true
    }
  });

  await prisma.product.create({
    data: {
      categoryId: catAerial.id,
      code: 'AERIAL-CUSTOM-25M',
      name: 'Custom Built',
      slug: 'aerial-custom-built',
      shortDesc: 'Aerial Access Platform - Custom Built',
      description: 'Custom engineered aerial access platforms built to customer operational requirements up to 25 meters with AC power pack and cable drum.',
      applications: aerialApplications,
      industries: aerialIndustries,
      applicationAreas: aerialApplicationAreas,
      images: ['/images/product/aerial.jpg'],
      specTables: [],
      notes: ['AC POWER PACK OPTIONAL WITH CABLE DRUM FOR 25 METERS'],
      sortOrder: 3,
      isActive: true
    }
  });

  await prisma.product.create({
    data: {
      categoryId: catAerial.id,
      code: 'AERIAL-STD-DC',
      name: 'Standard',
      slug: 'aerial-standard',
      shortDesc: 'Aerial Access Platform - Standard',
      description: 'Standard model aerial access platform equipped with DC powerpack and battery backup up to 220 Ah for silent, zero-emission internal or external height access.',
      applications: aerialApplications,
      industries: aerialIndustries,
      applicationAreas: aerialApplicationAreas,
      images: ['/images/product/aerial truck mounted.jpg'],
      specTables: [],
      notes: ['DC POWER PACK OPTIONAL WITH BATTERY BACK UP UPTO 220 Ah'],
      sortOrder: 4,
      isActive: true
    }
  });

  // -------------------------------------------------------------
  // Category 4: Stacker
  // -------------------------------------------------------------
  const catStacker = await prisma.category.create({
    data: {
      name: 'Stacker',
      slug: 'stacker',
      image: '/images/product/stacker.jpg',
      description: 'For handling components in bulk at stores. Heavy-duty manual and semi-electric stackers engineered for loading docks, machine loading and high travel pallet stacking.',
      applications: stackerApplications,
      industries: stackerIndustries,
      applicationAreas: ['Warehouses', 'Production Stores', 'Dispatch Yards'],
      sortOrder: 4,
      isActive: true
    }
  });

  await prisma.product.create({
    data: {
      categoryId: catStacker.id,
      code: 'LRHS-1T-1.5M / LRHS-2T-1.6M',
      name: 'Hydraulic Stacker - Manual',
      slug: 'hydraulic-stacker-manual',
      shortDesc: 'Hydraulic Stacker - Manual',
      description: 'Manual hydraulic pallet stacker designed for bulk components handling at stores. Ergonomic steering, foot pump and hand valve control.',
      applications: stackerApplications,
      industries: stackerIndustries,
      applicationAreas: ['Warehouses', 'Component Stores'],
      images: ['/images/product/stacker.jpg', '/images/product/stacker 1.jpg'],
      specTables: [
        {
          title: 'Specifications',
          // FLAG: 2nd col repeats code LRHS-1T-1.5M with 3000 mm lift; 3rd col has LRHS-2T-1.6M but capacity 1000 Kgs. Kept verbatim.
          columns: ['TYPE CODE', 'LRHS-1T-1.5M', 'LRHS-1T-1.5M (Note: 3000 MM Lift)', 'LRHS-2T-1.6M'],
          rows: [
            { label: 'CAPACITY', values: ['1000 Kgs', '1000 Kgs', '1000 Kgs (Note: Listed as 1000 Kgs despite 2T code)'] },
            { label: 'LIFTING HEIGHT', values: ['1500 MM', '3000 MM', '1600 MM'] },
            { label: 'CLOSED HEIGHT', values: ['80 MM', '80 MM', '80 MM'] },
            { label: 'FORK HEIGHT', values: ['900 MM', '900 MM', '1000 MM'] },
            { label: 'FORK WIDTH', values: ['150 MM', '150 MM', '150 MM'] },
            { label: 'LOAD CENTRE', values: ['400 MM', '400 MM', '400 MM'] },
            { label: 'OVERALL (L X W X H)', values: ['1410 x 780 x 1965 MM', '1500 x 800 x 2060 MM', '1500 x 865 x 2100 MM'] }
          ]
        }
      ],
      notes: [
        'OVERALL SIZE MAY SLIGHTLY VARY DEPENDING ON APPLICATION AND USER REQUIREMENT',
        'OPTIONAL SPECIAL FORKS AVAILABLE TOWARDS SPECIAL APPLICATION',
        'FLAG NOTE: Original table repeated code LRHS-1T-1.5M for the 3000mm variant and specified 1000 Kgs capacity for LRHS-2T-1.6M. Kept verbatim.'
      ],
      sortOrder: 1,
      isActive: true
    }
  });

  await prisma.product.create({
    data: {
      categoryId: catStacker.id,
      code: 'LRHS-EL-1.5T-2M / LRHS-EL-2T-2M',
      name: 'Hydraulic Stacker - Semi Electric',
      slug: 'hydraulic-stacker-semi-electric',
      shortDesc: 'Hydraulic Stacker - Semi Electric',
      description: 'Semi electric battery operated lift stacker with manual travel, motorized rapid lift hydraulic pack, and adjustable forks for effortless palletized store organization.',
      applications: stackerApplications,
      industries: stackerIndustries,
      applicationAreas: ['Distribution Centers', 'Supermarkets', 'Industrial Warehouses'],
      images: ['/images/product/stacker 1.jpg', '/images/product/stacker.jpg'],
      specTables: [
        {
          title: 'Specifications',
          columns: ['TYPE CODE', 'LRHS-EL-1.5T-2M', 'LRHS-EL-2T-2M'],
          rows: [
            { label: 'CAPACITY', values: ['1500 Kgs', '2000 Kgs'] },
            { label: 'LIFTING HEIGHT', values: ['2000 MM', '2000 MM'] },
            { label: 'CLOSED HEIGHT', values: ['90 MM', '90 MM'] },
            { label: 'FORK HEIGHT (LENGTH X WIDTH)', values: ['1000 x 300 - 850 mm', '1000 x 300 - 850 mm'] },
            { label: 'LOAD CENTRE', values: ['400 MM', '400 MM'] },
            { label: 'MIN. TURNING RADIUS', values: ['1350 MM', '1350 MM'] },
            { label: 'LIFTING MOTOR', values: ['12 / 1.5-1.6 kw', '12 / 1.5-1.6 kw'] },
            { label: 'BATTERY', values: ['12v / 15 A', '12v / 15 A'] },
            { label: 'OVERALL (L X W X H)', values: ['1660 x 865 x 1580 mm', '1660 x 865 x 1580 mm'] }
          ]
        }
      ],
      notes: [],
      sortOrder: 2,
      isActive: true
    }
  });

  // -------------------------------------------------------------
  // Category 5: Pallet Truck
  // -------------------------------------------------------------
  const catPalletTruck = await prisma.category.create({
    data: {
      name: 'Pallet Truck',
      slug: 'pallet-truck',
      image: '/images/product/PALLET TRUCK.jpg',
      description: 'Hydraulic Pallet Truck - Manual for swift, dependable horizontal transport of palletized goods across assembly floors, container loading bays, and warehouses.',
      applications: palletTruckApplications,
      industries: palletTruckIndustries,
      applicationAreas: ['Assembly Lines', 'Floor Material Movement', 'Container Destuffing'],
      sortOrder: 5,
      isActive: true
    }
  });

  await prisma.product.create({
    data: {
      categoryId: catPalletTruck.id,
      code: 'LRPT-2T / LRPT-3.5T',
      name: 'Hydraulic Pallet Truck - Manual',
      slug: 'hydraulic-pallet-truck-manual',
      shortDesc: 'Hydraulic Pallet Truck - Manual',
      description: 'High tensile steel chassis with 3-position fingertip control handle (Raise, Neutral, Lower), overload relief bypass valve, and heavy duty polyurethane rollers.',
      applications: palletTruckApplications,
      industries: palletTruckIndustries,
      applicationAreas: ['Assembly', 'Material Rotation', 'Moving material across floors'],
      images: ['/images/product/PALLET TRUCK 1.jpg', '/images/product/PALLET TRUCK.jpg'],
      specTables: [
        {
          title: 'Specifications',
          columns: ['TYPE', 'LRPT-2T', 'LRPT-3.5T'],
          rows: [
            // FLAG: LRPT-3.5T lists capacity 2500 Kgs. Kept verbatim.
            { label: 'CAPACITY', values: ['2000 Kgs', '2500 Kgs (Note: Listed as 2500 Kgs on original site despite 3.5T code)'] },
            { label: 'WIDTH OF FORKS', values: ['160 MM', '160 MM'] },
            { label: 'WIDTH BETWEEN FORKS', values: ['225 MM', '230 MM'] },
            { label: 'OVERALL FORK WIDTH', values: ['540 MM', '550 MM'] },
            { label: 'OVERALL LENGTH', values: ['1150 MM', '1550 MM'] },
            { label: 'FORK LENGTH', values: ['1100 MM', '1150 MM'] },
            { label: 'MIN. HEIGHT OF FORKS', values: ['90 MM', '85 MM'] },
            { label: 'MAX. HEIGHT OF FORKS', values: ['200 MM', '195 MM'] }
          ]
        }
      ],
      notes: [
        'FLAG NOTE: LRPT-3.5T model lists capacity as 2500 Kgs on original site. Kept verbatim.'
      ],
      sortOrder: 1,
      isActive: true
    }
  });

  // -------------------------------------------------------------
  // Category 6: Zero Lift
  // -------------------------------------------------------------
  const catZeroLift = await prisma.category.create({
    data: {
      name: 'Zero Lift',
      slug: 'zero-lift',
      image: '/images/product/ZERO LIFT.jpg',
      description: 'Zero Lift - Customized. Used for lifting heavy loads from Ground level to the required heights. Floor mounted so no pit is required, allowing pallet trucks and forklifts to drive straight onto the platform.',
      applications: zeroLiftApplications,
      industries: zeroLiftIndustries,
      applicationAreas: ['No-Pit Facilities', 'Container Unloading', 'Car Lifting', 'Truck Docking'],
      sortOrder: 6,
      isActive: true
    }
  });

  await prisma.product.create({
    data: {
      categoryId: catZeroLift.id,
      code: 'LRZLT-0.5T-1.5M / LRZLT-1.0T-3.0M / LRZLT-2T-4.5M',
      name: 'Zero Lift - Customized',
      slug: 'zero-lift-customized',
      shortDesc: 'Zero Lift - Customized',
      description: 'Customized low-profile floor mounted zero lift table. Enables standard hand pallet trucks, stackers or forklifts to wheel loads directly onto the deck without pit excavation.',
      applications: zeroLiftApplications,
      industries: zeroLiftIndustries,
      applicationAreas: ['Car Lift', 'Loading Docks', 'Truck Loading & Unloading', 'Machine Loading'],
      images: ['/images/product/ZERO LIFT.jpg', '/images/product/ZERO LIFT 1.jpg'],
      specTables: [
        {
          title: 'Specifications',
          columns: ['TYPE CODE [MANUAL]', 'LRZLT-0.5T-1.5M', 'LRZLT-1.0T-3.0M', 'LRZLT-2T-4.5M'],
          rows: [
            { label: 'CAPACITY', values: ['500 Kgs', '1 TON', '2 TONS'] },
            { label: 'CLOSED HEIGHT', values: ['300 MM', '350 MM', '450 MM'] },
            { label: 'RAISED HT. FROM GL', values: ['1500', '3000', '4500'] },
            { label: 'PLATFORM SIZE', values: ['2000 X 1500', '2500 X 1800', '2500 X 2000'] },
            { label: 'POWER PACK', values: ['2 HP', '2 HP', '5 HP'] }
          ]
        }
      ],
      notes: [
        'CAPACITY FROM 500 KGS TO 5000 KGS AND HEIGHT FROM 0 MM TO 2000 MM HEIGHT',
        'FLOOR MOUNTED, NO PIT IS REQUIRED',
        'MOBILE OPTION ALSO AVAILABLE, LOW SPACE REQUIREMENT',
        'CAPACITY UPTO 5 TON',
        'FORKLIFT, PALLET TRUCK, STACKER CAN BE USED FOR LOADING / UNLOADING FROM CONTAINERS, TRUCKS, TATA ACE ETC.'
      ],
      sortOrder: 1,
      isActive: true
    }
  });

  // -------------------------------------------------------------
  // Category 7: Hydraulic Barrel Lifter & Tilter
  // -------------------------------------------------------------
  const catBarrelLifter = await prisma.category.create({
    data: {
      name: 'Hydraulic Barrel Lifter & Tilter',
      slug: 'hydraulic-barrel-lifter-tilter',
      image: '/images/product/hydraulic barrel lifter tilter.jpg',
      description: 'This is the Equipment for handling, lifting, weighing, transporting and dispensing of drums and barrels, extensively used in chemical and petroleum and shipping industries. We are provided with Manual and Semi Electric Drum stackers.',
      applications: barrelLifterApplications,
      industries: barrelLifterIndustries,
      applicationAreas: ['Chemical Dispensing', 'Refinery Drum Transport', 'Pharmaceutical Blending'],
      sortOrder: 7,
      isActive: true
    }
  });

  await prisma.product.create({
    data: {
      categoryId: catBarrelLifter.id,
      code: 'LRBLT-TL-350',
      name: 'Hydraulic Barrel Lifter & Tilter',
      slug: 'hydraulic-barrel-lifter-tilter-standard',
      shortDesc: 'Hydraulic Barrel Lifter & Tilter',
      description: 'Specialized 360-degree worm-gear controlled drum clamp and tilt unit. Provides controlled dispensing of chemical, petroleum and solvent barrels with maximum operator safety.',
      applications: barrelLifterApplications,
      industries: barrelLifterIndustries,
      applicationAreas: ['Drum Handling', 'Liquid Dispensing', 'Drum Weighed Stacking'],
      images: ['/images/product/hydraulic barrel lifter tilter.jpg', '/images/product/hydraulic barrel lifter tilter 1.jpg'],
      specTables: [
        {
          title: 'Specifications',
          columns: ['TYPE CODE', 'LRBLT-TL-350'],
          rows: [
            { label: 'RATED CAPACITY', values: ['350 Kgs'] },
            { label: 'LIFTING HEIGHT', values: ['1425 MM'] },
            { label: 'OVERALL LENGTH', values: ['1190 MM'] },
            { label: 'OVERALL WIDTH', values: ['890 MM'] },
            { label: 'OVERALL HEIGHT', values: ['2020 MM'] }
          ]
        }
      ],
      notes: ['Provided with Manual and Semi Electric Drum stacker options.'],
      sortOrder: 1,
      isActive: true
    }
  });

  // -------------------------------------------------------------
  // Category 8: Hydraulic Floor Crane - Light Duty
  // -------------------------------------------------------------
  const catFloorCrane = await prisma.category.create({
    data: {
      name: 'Hydraulic Floor Crane - Light Duty',
      slug: 'hydraulic-floor-crane-light-duty',
      image: '/images/product/HYDRAULIC FLOOR CRANE - LIGHT DUTY.jpg',
      description: floorCraneDescription,
      applications: floorCraneApplications,
      industries: ['Tool Rooms', 'Automotive Repair', 'CNC Machining', 'Fabrication Workshops'],
      applicationAreas: ['Die Replacement', 'Engine Assembly', 'Machine Tool Loading'],
      sortOrder: 8,
      isActive: true
    }
  });

  // Crawled specs: LRFC-1T and LRFC-2T
  await prisma.product.create({
    data: {
      categoryId: catFloorCrane.id,
      code: 'LRFC-1T / LRFC-2T',
      name: 'Hydraulic Floor Crane - Light Duty',
      slug: 'hydraulic-floor-crane-light-duty-standard',
      shortDesc: 'Hydraulic Floor Crane - Light Duty (Short: Hydraulic Floor Crane)',
      description: 'Hydraulic Floor Crane is widely used to replace dies from machines or press, as when the load is suspended the adjustment is easy while fitting on a machine or press. Fitted with multi-position telescopic boom and forged swivel hook.',
      applications: floorCraneApplications,
      industries: ['Tool Rooms', 'Automotive Repair', 'CNC Machining', 'Fabrication Workshops'],
      applicationAreas: ['Die Replacement', 'Engine Dismantling', 'CNC Component Handling'],
      images: ['/images/product/HYDRAULIC FLOOR CRANE - LIGHT DUTY.jpg', '/images/product/HYDRAULIC FLOOR CRANE - LIGHT DUTY 1.jpg'],
      specTables: [
        {
          title: 'Specifications',
          columns: ['TYPE (LIGHT DUTY)', 'LRFC-1T', 'LRFC-2T'],
          rows: [
            { label: 'CAPACITY', values: ['1000 Kgs', '2000 Kgs'] },
            { label: 'LIFTING RANGE MINIMUM', values: ['55 MM', '380 MM'] },
            { label: 'LIFTING RANGE MAXIMUM', values: ['2270 MM', '2400 MM'] },
            { label: 'LIFTING CAPACITY MINIMUM', values: ['250 MM', '500 MM'] },
            { label: 'LIFTING CAPACITY MAXIMUM', values: ['1000 MM', '2000 MM'] },
            { label: 'OVERALL DIMENSION (LxWxH)', values: ['1560 x 635 x 1530 mm', '2310 x 1300 x 1575 mm'] }
          ]
        }
      ],
      notes: [
        'Widely used to replace dies from machines or press, as when the load is suspended the adjustment is easy while fitting on a machine or press.'
      ],
      sortOrder: 1,
      isActive: true
    }
  });

  // -------------------------------------------------------------
  // Category 9: Dock Leveler
  // -------------------------------------------------------------
  const catDockLeveler = await prisma.category.create({
    data: {
      name: 'Dock Leveler',
      slug: 'dock-leveler',
      image: '/images/product/DOCK LEVELLER.jpg',
      description: dockLevelerDescription,
      applications: dockLevelerApplications,
      industries: dockLevelerIndustries,
      applicationAreas: ['Loading Bays', 'Warehouse Receiving Docks', 'Logistics Depots'],
      sortOrder: 9,
      isActive: true
    }
  });

  // Crawled specs: LRDL - 9T-18*20 and LRDL-12T- 20 * 25
  await prisma.product.create({
    data: {
      categoryId: catDockLeveler.id,
      code: 'LRDL-9T-18*20 / LRDL-12T-20*25',
      name: 'Hydraulic Mechanical Dock Leveler',
      slug: 'hydraulic-mechanical-dock-leveler',
      shortDesc: 'Hydraulic Mechanical Dock Leveler',
      description: 'Heavy duty electro-hydraulic dock leveler with articulated hinged lip board. Bridges height disparities between dock bays and container truck beds for fast, seamless forklift transit.',
      applications: dockLevelerApplications,
      industries: dockLevelerIndustries,
      applicationAreas: ['Loading Docks', 'Warehouse Logistics', 'Truck Loading & Unloading'],
      images: ['/images/product/DOCK LEVELLER.jpg', '/images/product/DOCK LEVELLER 1.jpg'],
      specTables: [
        {
          title: 'Specifications',
          columns: ['MODEL NO.', 'LRDL - 9T-18*20', 'LRDL-12T- 20 * 25'],
          rows: [
            { label: 'CAPACITY', values: ['9000 Kgs', '12000 Kgs'] },
            { label: 'PLATFORM SIZE', values: ['1800 X 2000 MM', '2000 X 2500 MM'] },
            { label: 'LIP BOARD SIZE', values: ['300 MM', '450 MM'] },
            { label: 'TRAVEL UP', values: ['300 MM', '300 MM'] },
            { label: 'TRAVEL DOWN', values: ['300 MM', '300 MM'] },
            { label: 'PIT DIMENSION (Length)', values: ['2150 MM', '2650 MM'] },
            { label: 'PIT DIMENSION (Width)', values: ['1860 MM', '2060 MM'] },
            { label: 'PIT DIMENSION (Depth)', values: ['485 MM', '600 MM'] }
          ]
        }
      ],
      notes: [
        'Bridge between Dock & Truck. Dock Levelers is placed at the exterior of the building in a loading bay.',
        'Aids in fast loading and unloading of goods at warehouse.'
      ],
      sortOrder: 1,
      isActive: true
    }
  });

  // -------------------------------------------------------------
  // Category 10: Aircraft Jacks
  // -------------------------------------------------------------
  const catAircraftJacks = await prisma.category.create({
    data: {
      name: 'Aircraft Jacks',
      slug: 'aircraft-jacks',
      image: '/images/product/AIR CRAFT JACKS.jpg',
      description: aircraftJacksDescription,
      applications: aircraftJacksApplications,
      industries: aircraftJacksIndustries,
      applicationAreas: ['Hangar Maintenance', 'Tire & Brake Service', 'Landing Gear Overhaul'],
      sortOrder: 10,
      isActive: true
    }
  });

  // Crawled specs: LRARJ - 9.5T-0.95M and LRARJ -10T-0.85M
  await prisma.product.create({
    data: {
      categoryId: catAircraftJacks.id,
      code: 'LRARJ-9.5T-0.95M / LRARJ-10T-0.85M',
      name: 'Axle Jacks and Tripod Jacks',
      slug: 'axle-jacks-and-tripod-jacks',
      shortDesc: 'Aircraft Jacks (Axle Jacks & Tripod Jacks)',
      description: 'Aircraft jacks are a vital part of any ground support maintenance program. Axle aircraft jacks are portable, self-contained hydraulic jacks used for aircraft maintenance involving tire repair and replacement, brake service repair and other maintenance procedures when lifting the nose and/or main landing gear is necessary. Axle jacks are placed directly on or under aircraft landing gear.',
      applications: aircraftJacksApplications,
      industries: aircraftJacksIndustries,
      applicationAreas: ['Axle Jacking', 'Tripod Jacking', 'Runway Ground Support'],
      images: ['/images/product/AIR CRAFT JACKS.jpg', '/images/product/AIR CRAFT JACKS 1.jpg', '/images/product/AIR CRAFT JACKS 2.jpg'],
      specTables: [
        {
          title: 'Specifications',
          columns: ['TYPE', 'LRARJ - 9.5T-0.95M', 'LRARJ -10T-0.85M'],
          rows: [
            { label: 'CAPACITY', values: ['9.5 TON', '10 TON'] },
            { label: 'CLOSED HEIGHT', values: ['1575 MM', '800 MM'] },
            { label: 'LIFTING HEIGHT', values: ['950 MM', '850 MM'] },
            { label: 'RAISED HT.FROM GL', values: ['2525 MM', '1650 MM'] },
            { label: 'TEST LOAD', values: ['13.5 TON', '13.5 TON'] }
          ]
        }
      ],
      notes: [
        'An axle jack is a portable, self-contained hydraulic jack. Axle aircraft jacks are used for aircraft maintenance involving tire repair and replacement, brake service repair and other maintenance procedures when lifting the nose and/or main landing gear is necessary.',
        'FLAG NOTE: "Tripod Jacks" heading was listed on old home page without descriptive body text.'
      ],
      sortOrder: 1,
      isActive: true
    }
  });

  // -------------------------------------------------------------
  // Category 11: Hollow & Solid Ram Hydraulic Jack
  // -------------------------------------------------------------
  const catHollow = await prisma.category.create({
    data: {
      name: 'Hollow & Solid Ram Hydraulic Jack',
      slug: 'hollow-and-solid-ram-hydraulic-jack',
      image: '/images/product/hollow.jpg',
      description: hollowRamDescription,
      applications: hollowRamApplications,
      industries: hollowRamIndustries,
      applicationAreas: ['Pin Pressing', 'Cable Pre-tensioning', 'Heavy Extraction'],
      sortOrder: 11,
      isActive: true
    }
  });

  // Crawled specs: LRHJ - 20T - 250 - HO and LRHJ - 20T - 250 - SO
  await prisma.product.create({
    data: {
      categoryId: catHollow.id,
      code: 'LRHJ - 20T - 250 - HO / LRHJ - 20T - 250 - SO',
      name: 'Hollow & Solid Ram Hydraulic Jack',
      slug: 'hollow-and-solid-ram-hydraulic-jack-standard',
      shortDesc: 'Hollow & Solid Ram Hydraulic Jack',
      description: 'High pressure single and double acting hydraulic cylinders available in hollow center-hole design (for tensioning cables, rods, pulling pins) and solid ram configuration for brute force vertical lifting.',
      applications: hollowRamApplications,
      industries: hollowRamIndustries,
      applicationAreas: ['Tensioning', 'Structural Prestressing', 'Heavy Plant Rigging'],
      images: ['/images/product/hollow.jpg'],
      specTables: [
        {
          title: 'Specifications',
          columns: ['TYPE', 'LRHJ - 20T - 250 - HO', 'LRHJ - 20T - 250 - SO'],
          rows: [
            { label: 'CAPACITY', values: ['10 to 50 TON', '10 to 100 TON'] }
          ]
        }
      ],
      notes: ['STANDARD AND CUSTOMIZED SINGLE AND DOUBLE ACTING HYDRAULIC JACKS'],
      sortOrder: 1,
      isActive: true
    }
  });

  console.log('--- Database Seeding Completed Successfully! ---');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
