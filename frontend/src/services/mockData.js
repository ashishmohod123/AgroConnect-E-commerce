export const INITIAL_USERS = [
  {
    id: 1,
    full_name: "Ashish Mohod",
    email: "ashish@agroconnect.in",
    role: "ADMIN",
    phone: "+91 98220 12345",
    business_or_farm_name: "AgroConnect Central Administration, Nagpur",
    location_city: "Nagpur",
    state: "Maharashtra",
    is_verified: true
  },
  {
    id: 2,
    full_name: "Ramesh Patil",
    email: "ramesh@katolfarms.com",
    role: "FARMER",
    phone: "+91 98230 11223",
    business_or_farm_name: "Katol Citrus & Orange FPO",
    location_city: "Katol, Nagpur Rural",
    state: "Maharashtra",
    is_verified: true
  },
  {
    id: 3,
    full_name: "Santosh Deshmukh",
    email: "santosh@wardhaagro.com",
    role: "FARMER",
    phone: "+91 94221 44556",
    business_or_farm_name: "Wardha Organic Producers Group",
    location_city: "Wardha",
    state: "Maharashtra",
    is_verified: true
  },
  {
    id: 4,
    full_name: "Rajesh Gupta",
    email: "rajesh@nagpurmart.com",
    role: "RETAILER",
    phone: "+91 93710 99887",
    business_or_farm_name: "Nagpur Central Supermarkets Pvt Ltd",
    location_city: "Itwari, Nagpur",
    state: "Maharashtra",
    is_verified: true
  }
];

export const INITIAL_LOTS = [
  {
    id: 1,
    farmer_id: 2,
    commodity_name: "Nagpur Mandarin Oranges (Santra)",
    variety: "GI-Tagged Nagpur Santra (Mrig Bahar Export)",
    quality_grade: "Grade A (Export / Premium)",
    total_quantity_kg: 6000.0,
    available_quantity_kg: 5200.0,
    min_order_quantity_kg: 100.0,
    price_per_kg: 48.0,
    harvest_date: new Date(Date.now() - 2 * 86400000).toISOString(),
    description: "World-famous GI-Tagged Nagpur Santra from Katol black soil orchards. High brix sweetness, rich juice content, tree-ripened without artificial ethylene gassing.",
    farm_location: "Katol Orchards, Nagpur Rural",
    image_url: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80",
    is_active: true,
    farmer: {
      full_name: "Ramesh Patil",
      business_or_farm_name: "Katol Citrus & Orange FPO",
      phone: "+91 98230 11223"
    }
  },
  {
    id: 2,
    farmer_id: 2,
    commodity_name: "Narkhed Sweet Lemon (Mosambi)",
    variety: "Desi Sweet Mosambi (Juice Grade-1)",
    quality_grade: "Grade A (Export / Premium)",
    total_quantity_kg: 4500.0,
    available_quantity_kg: 4500.0,
    min_order_quantity_kg: 50.0,
    price_per_kg: 42.0,
    harvest_date: new Date(Date.now() - 1 * 86400000).toISOString(),
    description: "Lush sweet limes harvested from Narkhed citrus belt. Thin peel, dense juicy segments, ideal for commercial juice chains and retail produce aisles.",
    farm_location: "Narkhed, Nagpur",
    image_url: "https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=800&q=80",
    is_active: true,
    farmer: {
      full_name: "Ramesh Patil",
      business_or_farm_name: "Katol Citrus & Orange FPO",
      phone: "+91 98230 11223"
    }
  },
  {
    id: 3,
    farmer_id: 3,
    commodity_name: "Wardha Organic Curcumin Turmeric (Haldi)",
    variety: "Salem Organic Finger (Curcumin 5.8%)",
    quality_grade: "100% Certified Organic",
    total_quantity_kg: 2200.0,
    available_quantity_kg: 1900.0,
    min_order_quantity_kg: 25.0,
    price_per_kg: 165.0,
    harvest_date: new Date(Date.now() - 5 * 86400000).toISOString(),
    description: "100% Certified Organic whole dried turmeric fingers from Wardha organic cluster. Lab-certified 5.8% curcumin content with rich golden aroma.",
    farm_location: "Seloo, Wardha District",
    image_url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
    is_active: true,
    farmer: {
      full_name: "Santosh Deshmukh",
      business_or_farm_name: "Wardha Organic Producers Group",
      phone: "+91 94221 44556"
    }
  },
  {
    id: 4,
    farmer_id: 2,
    commodity_name: "Bhiwapur Hot Red Sun-Dried Chilli",
    variety: "Teja Stemless Extra-Hot (SHU 35,000+)",
    quality_grade: "Grade A (Export / Premium)",
    total_quantity_kg: 2000.0,
    available_quantity_kg: 1800.0,
    min_order_quantity_kg: 20.0,
    price_per_kg: 195.0,
    harvest_date: new Date(Date.now() - 6 * 86400000).toISOString(),
    description: "Famous pungent Bhiwapur red chillies known across Maharashtra for intense red pigment (ASTA 100+) and sharp heat. Sun-dried on hygienic tarpaulins.",
    farm_location: "Bhiwapur, Nagpur Rural",
    image_url: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80",
    is_active: true,
    farmer: {
      full_name: "Prashant Bhende",
      business_or_farm_name: "Ramtek Spices & Horticultural Society",
      phone: "+91 98229 33445"
    }
  },
  {
    id: 5,
    farmer_id: 2,
    commodity_name: "Vidarbha Desi Pigeon Pea (Tur Dal)",
    variety: "Unpolished Fatka Desi Tur",
    quality_grade: "Grade A (Export / Premium)",
    total_quantity_kg: 5500.0,
    available_quantity_kg: 5500.0,
    min_order_quantity_kg: 50.0,
    price_per_kg: 115.0,
    harvest_date: new Date(Date.now() - 4 * 86400000).toISOString(),
    description: "Unpolished laser-sorted whole pigeon peas directly sourced from Kalmeshwar / Hinganghat mandis. Zero water polish, rich in plant protein.",
    farm_location: "Kalmeshwar, Nagpur",
    image_url: "https://images.unsplash.com/photo-1585994192700-4e16104b60b9?auto=format&fit=crop&w=800&q=80",
    is_active: true,
    farmer: {
      full_name: "Gajanan Wankhede",
      business_or_farm_name: "Saoner Agro & Grains FPO",
      phone: "+91 97654 77889"
    }
  },
  {
    id: 6,
    farmer_id: 2,
    commodity_name: "Vidarbha Yellow Soybeans",
    variety: "JS-335 High-Protein Oilseed",
    quality_grade: "Grade B (Commercial Wholesale)",
    total_quantity_kg: 15000.0,
    available_quantity_kg: 13500.0,
    min_order_quantity_kg: 200.0,
    price_per_kg: 46.5,
    harvest_date: new Date(Date.now() - 7 * 86400000).toISOString(),
    description: "Moisture-controlled (under 9.5%) clean yellow soybeans suitable for oil mills, soy chunk plants, and animal feed manufacturing.",
    farm_location: "Saoner Tehsil, Nagpur",
    image_url: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80",
    is_active: true,
    farmer: {
      full_name: "Gajanan Wankhede",
      business_or_farm_name: "Saoner Agro & Grains FPO",
      phone: "+91 97654 77889"
    }
  },
  {
    id: 7,
    farmer_id: 2,
    commodity_name: "Vidarbha Sharbati Golden Wheat",
    variety: "Sharbati Desi Tukdi (Heavy Grain)",
    quality_grade: "Grade A (Export / Premium)",
    total_quantity_kg: 10000.0,
    available_quantity_kg: 10000.0,
    min_order_quantity_kg: 150.0,
    price_per_kg: 34.0,
    harvest_date: new Date(Date.now() - 10 * 86400000).toISOString(),
    description: "Heavy luster golden Sharbati wheat grains from Umred fields. High natural sweetness, ideal for premium rotis and chakki atta brands.",
    farm_location: "Umred, Nagpur",
    image_url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
    is_active: true,
    farmer: {
      full_name: "Gajanan Wankhede",
      business_or_farm_name: "Saoner Agro & Grains FPO",
      phone: "+91 97654 77889"
    }
  },
  {
    id: 8,
    farmer_id: 3,
    commodity_name: "Vidarbha White Gold Long-Staple Cotton",
    variety: "BT-2 Hybrid (29mm+ Staple)",
    quality_grade: "Grade A (Export / Premium)",
    total_quantity_kg: 8000.0,
    available_quantity_kg: 8000.0,
    min_order_quantity_kg: 100.0,
    price_per_kg: 72.0,
    harvest_date: new Date(Date.now() - 8 * 86400000).toISOString(),
    description: "Clean, trash-free raw unginned cotton from Hinganghat cotton hub. High tensile strength, bright white color with zero yellow stain.",
    farm_location: "Hinganghat, Wardha",
    image_url: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=800&q=80",
    is_active: true,
    farmer: {
      full_name: "Santosh Deshmukh",
      business_or_farm_name: "Wardha Organic Producers Group",
      phone: "+91 94221 44556"
    }
  },
  {
    id: 9,
    farmer_id: 2,
    commodity_name: "Ramtek Desi Garlic (Lasan)",
    variety: "Ramtek Local Pungent White Garlic",
    quality_grade: "Grade A (Export / Premium)",
    total_quantity_kg: 2500.0,
    available_quantity_kg: 2500.0,
    min_order_quantity_kg: 25.0,
    price_per_kg: 140.0,
    harvest_date: new Date(Date.now() - 3 * 86400000).toISOString(),
    description: "High allicin content pungent desi garlic from Ramtek soil. Tight cloves, long shelf-life (4+ months), highly valued by spice and paste processors.",
    farm_location: "Ramtek, Nagpur Rural",
    image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=800&q=80",
    is_active: true,
    farmer: {
      full_name: "Prashant Bhende",
      business_or_farm_name: "Ramtek Spices & Horticultural Society",
      phone: "+91 98229 33445"
    }
  },
  {
    id: 10,
    farmer_id: 2,
    commodity_name: "Nagbhid Chinnor Aromatic Rice",
    variety: "Traditional Vidarbha Chinnor (Aromatic)",
    quality_grade: "100% Certified Organic",
    total_quantity_kg: 4000.0,
    available_quantity_kg: 4000.0,
    min_order_quantity_kg: 50.0,
    price_per_kg: 78.0,
    harvest_date: new Date(Date.now() - 12 * 86400000).toISOString(),
    description: "Famous traditional aromatic rice variety of Eastern Vidarbha. Subtle natural fragrance, delicate grains, rich in minerals.",
    farm_location: "Nagbhid, Vidarbha",
    image_url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
    is_active: true,
    farmer: {
      full_name: "Prashant Bhende",
      business_or_farm_name: "Ramtek Spices & Horticultural Society",
      phone: "+91 98229 33445"
    }
  },
  {
    id: 11,
    farmer_id: 3,
    commodity_name: "Wardha Bold Groundnuts (Shengdana)",
    variety: "Arvi Bold Oil-Grade Peanuts",
    quality_grade: "Grade A (Export / Premium)",
    total_quantity_kg: 5000.0,
    available_quantity_kg: 5000.0,
    min_order_quantity_kg: 50.0,
    price_per_kg: 88.0,
    harvest_date: new Date(Date.now() - 9 * 86400000).toISOString(),
    description: "Two-kernel bold raw groundnuts with 48% natural oil content. Clean pods, zero aflatoxin, ideal for roasting, snacks, and cold-pressed oil.",
    farm_location: "Arvi, Wardha",
    image_url: "https://images.unsplash.com/photo-1567892328524-74c6d66e7456?auto=format&fit=crop&w=800&q=80",
    is_active: true,
    farmer: {
      full_name: "Santosh Deshmukh",
      business_or_farm_name: "Wardha Organic Producers Group",
      phone: "+91 94221 44556"
    }
  },
  {
    id: 12,
    farmer_id: 2,
    commodity_name: "Katol Kagzi Acid Lime (Nimbu)",
    variety: "Kagzi Seedless Thin-Skin Lime",
    quality_grade: "Grade A (Export / Premium)",
    total_quantity_kg: 3000.0,
    available_quantity_kg: 3000.0,
    min_order_quantity_kg: 25.0,
    price_per_kg: 55.0,
    harvest_date: new Date(Date.now() - 1 * 86400000).toISOString(),
    description: "Juicy, bright yellow-green paper-thin skin acid limes from Katol orchards. High acidity and citric juice volume.",
    farm_location: "Katol, Nagpur Rural",
    image_url: "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80",
    is_active: true,
    farmer: {
      full_name: "Ramesh Patil",
      business_or_farm_name: "Katol Citrus & Orange FPO",
      phone: "+91 98230 11223"
    }
  }
];

export const INITIAL_MANDI_RATES = [
  {
    id: 1,
    mandi_name: "Kalamna APMC Market, Nagpur",
    commodity_name: "Nagpur Orange (Santra)",
    variety: "Mrig Bahar",
    min_price_quintal: 4400.0,
    max_price_quintal: 5800.0,
    modal_price_quintal: 5200.0,
    modal_price_per_kg: 52.0,
    trend: "UP"
  },
  {
    id: 2,
    mandi_name: "Katol APMC Sub-Market",
    commodity_name: "Narkhed Sweet Lemon (Mosambi)",
    variety: "Desi Mosambi",
    min_price_quintal: 3900.0,
    max_price_quintal: 4800.0,
    modal_price_quintal: 4500.0,
    modal_price_per_kg: 45.0,
    trend: "STABLE"
  },
  {
    id: 3,
    mandi_name: "Wardha APMC Yard",
    commodity_name: "Wardha Organic Curcumin Turmeric (Haldi)",
    variety: "Salem Finger",
    min_price_quintal: 16000.0,
    max_price_quintal: 19500.0,
    modal_price_quintal: 18200.0,
    modal_price_per_kg: 182.0,
    trend: "UP"
  },
  {
    id: 4,
    mandi_name: "Saoner APMC Market",
    commodity_name: "Vidarbha Yellow Soybeans",
    variety: "JS-335",
    min_price_quintal: 4400.0,
    max_price_quintal: 4900.0,
    modal_price_quintal: 4750.0,
    modal_price_per_kg: 47.5,
    trend: "DOWN"
  },
  {
    id: 5,
    mandi_name: "Kalamna APMC Market, Nagpur",
    commodity_name: "Vidarbha Sharbati Golden Wheat",
    variety: "Sharbati Tukdi",
    min_price_quintal: 3300.0,
    max_price_quintal: 3850.0,
    modal_price_quintal: 3650.0,
    modal_price_per_kg: 36.5,
    trend: "STABLE"
  },
  {
    id: 6,
    mandi_name: "Amravati Main APMC",
    commodity_name: "Vidarbha Desi Pigeon Pea (Tur Dal)",
    variety: "Desi Fatka",
    min_price_quintal: 11500.0,
    max_price_quintal: 13000.0,
    modal_price_quintal: 12400.0,
    modal_price_per_kg: 124.0,
    trend: "UP"
  },
  {
    id: 7,
    mandi_name: "Ramtek APMC Yard",
    commodity_name: "Ramtek Desi Garlic (Lasan)",
    variety: "Ramtek Local",
    min_price_quintal: 13000.0,
    max_price_quintal: 16500.0,
    modal_price_quintal: 15200.0,
    modal_price_per_kg: 152.0,
    trend: "UP"
  },
  {
    id: 8,
    mandi_name: "Hinganghat APMC Market, Wardha",
    commodity_name: "Vidarbha White Gold Long-Staple Cotton",
    variety: "BT-2 Medium Staple",
    min_price_quintal: 6800.0,
    max_price_quintal: 7800.0,
    modal_price_quintal: 7500.0,
    modal_price_per_kg: 75.0,
    trend: "STABLE"
  }
];

export const INITIAL_ORDERS = [
  {
    id: 1,
    order_number: "AGC-20260829-NAGPUR01",
    retailer_id: 4,
    total_amount: 38400.0,
    mandi_cess_amount: 576.0,
    logistics_cost: 1200.0,
    grand_total: 40176.0,
    status: "CONFIRMED",
    payment_status: "PAID",
    payment_method: "Razorpay (UPI / NetBanking)",
    payment_id: "pay_ASHISH_NAGPUR_9918",
    shipping_address: "Shop 14-16, Grain Market Complex, Itwari",
    destination_city: "Nagpur",
    notes: "[Direct FTL Truck] Direct dispatch from Katol Orchards. Authorized by Admin Ashish.",
    created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    items: [
      {
        id: 1,
        produce_lot_id: 1,
        quantity_kg: 800.0,
        price_per_kg: 48.0,
        subtotal: 38400.0,
        produce_lot: INITIAL_LOTS[0]
      }
    ]
  }
];
