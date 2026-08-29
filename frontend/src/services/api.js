import { INITIAL_USERS, INITIAL_LOTS, INITIAL_MANDI_RATES, INITIAL_ORDERS } from './mockData';

const BASE_URL = '/api';

// Helper to get / set LocalStorage items for persistent demo mode on Vercel
function getStoredLots() {
  const data = localStorage.getItem('agroconnect_lots');
  if (data) {
    try { return JSON.parse(data); } catch {}
  }
  localStorage.setItem('agroconnect_lots', JSON.stringify(INITIAL_LOTS));
  return INITIAL_LOTS;
}

function setStoredLots(lots) {
  localStorage.setItem('agroconnect_lots', JSON.stringify(lots));
}

function getStoredMandiRates() {
  const data = localStorage.getItem('agroconnect_mandi_rates');
  if (data) {
    try { return JSON.parse(data); } catch {}
  }
  localStorage.setItem('agroconnect_mandi_rates', JSON.stringify(INITIAL_MANDI_RATES));
  return INITIAL_MANDI_RATES;
}

function setStoredMandiRates(rates) {
  localStorage.setItem('agroconnect_mandi_rates', JSON.stringify(rates));
}

function getStoredOrders() {
  const data = localStorage.getItem('agroconnect_orders');
  if (data) {
    try { return JSON.parse(data); } catch {}
  }
  localStorage.setItem('agroconnect_orders', JSON.stringify(INITIAL_ORDERS));
  return INITIAL_ORDERS;
}

function setStoredOrders(orders) {
  localStorage.setItem('agroconnect_orders', JSON.stringify(orders));
}

function getAuthHeaders() {
  const token = localStorage.getItem('agroconnect_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(response) {
  if (!response.ok) {
    let errorDetail = 'Network request failed';
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errJson.message || errorDetail;
    } catch {
      errorDetail = response.statusText;
    }
    throw new Error(errorDetail);
  }
  return response.json();
}

export const api = {
  // Auth API
  async login(email, password) {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return await handleResponse(res);
    } catch {
      // Mock Fallback for Vercel
      const user = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) || {
        id: 99,
        full_name: email.split('@')[0],
        email: email,
        role: "RETAILER",
        phone: "+91 98220 11223",
        business_or_farm_name: "Nagpur Agro Mart",
        location_city: "Nagpur",
        state: "Maharashtra",
        is_verified: true
      };
      const token = `mock_jwt_token_${user.role.toLowerCase()}`;
      return { access_token: token, token_type: "bearer", user };
    }
  },

  async register(userData) {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return await handleResponse(res);
    } catch {
      const user = {
        id: Date.now(),
        ...userData,
        is_verified: true
      };
      const token = `mock_jwt_token_${user.role.toLowerCase()}`;
      return { access_token: token, token_type: "bearer", user };
    }
  },

  async getMe() {
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(res);
    } catch {
      const savedUser = localStorage.getItem('agroconnect_user');
      if (savedUser) return JSON.parse(savedUser);
      return INITIAL_USERS[0];
    }
  },

  async getDemoAccounts() {
    try {
      const res = await fetch(`${BASE_URL}/auth/demo-accounts`);
      return await handleResponse(res);
    } catch {
      return INITIAL_USERS;
    }
  },

  // Produce Catalog API
  async getProduceLots(params = {}) {
    try {
      const query = new URLSearchParams();
      if (params.search) query.append('search', params.search);
      if (params.commodity) query.append('commodity', params.commodity);
      if (params.grade) query.append('grade', params.grade);
      if (params.min_price) query.append('min_price', params.min_price);
      if (params.max_price) query.append('max_price', params.max_price);
      if (params.max_moq) query.append('max_moq', params.max_moq);
      if (params.sort_by) query.append('sort_by', params.sort_by);

      const res = await fetch(`${BASE_URL}/produce?${query.toString()}`);
      return await handleResponse(res);
    } catch {
      // Mock Fallback
      let list = [...getStoredLots()];
      if (params.search) {
        const s = params.search.toLowerCase();
        list = list.filter(l => 
          l.commodity_name.toLowerCase().includes(s) || 
          l.variety.toLowerCase().includes(s) ||
          l.farm_location.toLowerCase().includes(s)
        );
      }
      if (params.commodity) {
        list = list.filter(l => l.commodity_name === params.commodity);
      }
      if (params.grade) {
        list = list.filter(l => l.quality_grade === params.grade);
      }
      if (params.max_moq) {
        list = list.filter(l => l.min_order_quantity_kg <= params.max_moq);
      }
      if (params.sort_by === 'price_asc') {
        list.sort((a, b) => a.price_per_kg - b.price_per_kg);
      } else if (params.sort_by === 'price_desc') {
        list.sort((a, b) => b.price_per_kg - a.price_per_kg);
      } else if (params.sort_by === 'moq_asc') {
        list.sort((a, b) => a.min_order_quantity_kg - b.min_order_quantity_kg);
      }
      return list;
    }
  },

  async getProduceDetail(id) {
    try {
      const res = await fetch(`${BASE_URL}/produce/${id}`);
      return await handleResponse(res);
    } catch {
      const list = getStoredLots();
      return list.find(l => l.id === parseInt(id)) || list[0];
    }
  },

  async getCategories() {
    try {
      const res = await fetch(`${BASE_URL}/produce/categories`);
      return await handleResponse(res);
    } catch {
      const list = getStoredLots();
      const commodities = Array.from(new Set(list.map(l => l.commodity_name)));
      const grades = Array.from(new Set(list.map(l => l.quality_grade)));
      return { commodities, grades };
    }
  },

  async getMyFarmerLots() {
    try {
      const res = await fetch(`${BASE_URL}/produce/farmer/my-lots`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(res);
    } catch {
      return getStoredLots().slice(0, 4);
    }
  },

  async createProduceLot(lotData) {
    try {
      const res = await fetch(`${BASE_URL}/produce`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(lotData),
      });
      return await handleResponse(res);
    } catch {
      const lots = getStoredLots();
      const newLot = {
        id: Date.now(),
        ...lotData,
        available_quantity_kg: lotData.total_quantity_kg,
        is_active: true,
        farmer: {
          full_name: "Ashish / Farmer",
          business_or_farm_name: "Vidarbha Agro FPO",
          phone: "+91 98220 12345"
        }
      };
      lots.unshift(newLot);
      setStoredLots(lots);
      return newLot;
    }
  },

  async updateProduceLot(id, lotData) {
    try {
      const res = await fetch(`${BASE_URL}/produce/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(lotData),
      });
      return await handleResponse(res);
    } catch {
      const lots = getStoredLots();
      const idx = lots.findIndex(l => l.id === parseInt(id));
      if (idx !== -1) {
        lots[idx] = { ...lots[idx], ...lotData };
        setStoredLots(lots);
      }
      return lots[idx];
    }
  },

  async deleteProduceLot(id) {
    try {
      const res = await fetch(`${BASE_URL}/produce/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await handleResponse(res);
    } catch {
      let lots = getStoredLots();
      lots = lots.filter(l => l.id !== parseInt(id));
      setStoredLots(lots);
      return { message: "Lot deactivated" };
    }
  },

  // Orders API
  async placeOrder(orderData) {
    try {
      const res = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(orderData),
      });
      return await handleResponse(res);
    } catch {
      // Mock Fallback order placement
      const lots = getStoredLots();
      let totalAmount = 0;
      const orderItems = orderData.items.map((item, idx) => {
        const lot = lots.find(l => l.id === item.produce_lot_id) || lots[0];
        const sub = item.quantity_kg * lot.price_per_kg;
        totalAmount += sub;
        return {
          id: idx + 1,
          produce_lot_id: lot.id,
          quantity_kg: item.quantity_kg,
          price_per_kg: lot.price_per_kg,
          subtotal: sub,
          produce_lot: lot
        };
      });

      const mandiCess = Math.round(totalAmount * 0.015);
      const totalWeight = orderData.items.reduce((acc, i) => acc + i.quantity_kg, 0);
      const logisticsCost = Math.round(totalWeight * 1.5);
      const grandTotal = totalAmount + mandiCess + logisticsCost;

      const newOrder = {
        id: Date.now(),
        order_number: `AGC-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-NAGPUR${Math.floor(10 + Math.random()*90)}`,
        retailer_id: 4,
        total_amount: totalAmount,
        mandi_cess_amount: mandiCess,
        logistics_cost: logisticsCost,
        grand_total: grandTotal,
        status: "CONFIRMED",
        payment_status: "PAID",
        payment_method: orderData.payment_method || "Razorpay (UPI / NetBanking)",
        payment_id: orderData.payment_id || `pay_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        shipping_address: orderData.shipping_address || "Wholesale Warehouse, Nagpur",
        destination_city: orderData.destination_city || "Nagpur",
        notes: orderData.notes || "[Direct FTL Truck] Dispatched from Vidarbha Orchards",
        created_at: new Date().toISOString(),
        items: orderItems
      };

      const orders = getStoredOrders();
      orders.unshift(newOrder);
      setStoredOrders(orders);
      return newOrder;
    }
  },

  async getMyOrders() {
    try {
      const res = await fetch(`${BASE_URL}/orders/my-orders`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(res);
    } catch {
      return getStoredOrders();
    }
  },

  async getFarmerOrders() {
    try {
      const res = await fetch(`${BASE_URL}/orders/farmer-orders`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(res);
    } catch {
      const orders = getStoredOrders();
      return orders.map(o => ({
        order_item_id: o.id,
        order_number: o.order_number,
        commodity_name: o.items?.[0]?.produce_lot?.commodity_name || "Nagpur Mandarin Oranges (Santra)",
        quantity_kg: o.items?.[0]?.quantity_kg || 800,
        price_per_kg: o.items?.[0]?.price_per_kg || 48,
        subtotal: o.items?.[0]?.subtotal || 38400,
        order_status: o.status,
        buyer_name: "Rajesh Gupta",
        buyer_business: "Nagpur Central Supermarkets",
        destination_city: o.destination_city || "Nagpur"
      }));
    }
  },

  async getOrderDetail(orderId) {
    try {
      const res = await fetch(`${BASE_URL}/orders/${orderId}`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(res);
    } catch {
      const orders = getStoredOrders();
      return orders.find(o => o.id === parseInt(orderId)) || orders[0];
    }
  },

  async updateOrderStatus(orderId, status) {
    try {
      const res = await fetch(`${BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      return await handleResponse(res);
    } catch {
      const orders = getStoredOrders();
      const ord = orders.find(o => o.id === parseInt(orderId));
      if (ord) {
        ord.status = status;
        setStoredOrders(orders);
      }
      return { message: `Status updated to ${status}` };
    }
  },

  getInvoiceDownloadUrl(orderId) {
    return `${BASE_URL}/orders/${orderId}/invoice`;
  },

  // Mandi & Analytics API
  async getMandiRates() {
    try {
      const res = await fetch(`${BASE_URL}/mandi/rates`);
      return await handleResponse(res);
    } catch {
      return getStoredMandiRates();
    }
  },

  async getPriceComparison() {
    try {
      const res = await fetch(`${BASE_URL}/mandi/comparison`);
      return await handleResponse(res);
    } catch {
      return [
        {
          commodity_name: "Nagpur Orange (Santra)",
          mandi_name: "Kalamna APMC Market, Nagpur",
          mandi_modal_price_kg: 52.0,
          farm_direct_avg_price_kg: 48.0,
          savings_per_kg: 4.0,
          savings_percentage: 7.7,
          trend: "UP"
        },
        {
          commodity_name: "Wardha Organic Curcumin Turmeric (Haldi)",
          mandi_name: "Wardha APMC Yard",
          mandi_modal_price_kg: 182.0,
          farm_direct_avg_price_kg: 165.0,
          savings_per_kg: 17.0,
          savings_percentage: 9.3,
          trend: "UP"
        },
        {
          commodity_name: "Narkhed Sweet Lemon (Mosambi)",
          mandi_name: "Katol APMC Sub-Market",
          mandi_modal_price_kg: 45.0,
          farm_direct_avg_price_kg: 42.0,
          savings_per_kg: 3.0,
          savings_percentage: 6.7,
          trend: "STABLE"
        },
        {
          commodity_name: "Vidarbha Yellow Soybeans",
          mandi_name: "Saoner APMC Market",
          mandi_modal_price_kg: 47.5,
          farm_direct_avg_price_kg: 46.5,
          savings_per_kg: 1.0,
          savings_percentage: 2.1,
          trend: "DOWN"
        },
        {
          commodity_name: "Ramtek Desi Garlic (Lasan)",
          mandi_name: "Ramtek APMC Yard",
          mandi_modal_price_kg: 152.0,
          farm_direct_avg_price_kg: 140.0,
          savings_per_kg: 12.0,
          savings_percentage: 7.9,
          trend: "UP"
        }
      ];
    }
  },

  async getPlatformOverview() {
    try {
      const res = await fetch(`${BASE_URL}/analytics/overview`);
      return await handleResponse(res);
    } catch {
      return {
        total_farmers: 6,
        total_retailers: 14,
        active_lots: 12,
        total_volume_traded_kg: 18600.0,
        recent_mandi_trends: getStoredMandiRates()
      };
    }
  },

  async getFarmerSummary() {
    try {
      const res = await fetch(`${BASE_URL}/analytics/farmer-summary`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(res);
    } catch {
      return {
        farmer_name: "Ramesh Patil",
        active_listings_count: 4,
        available_stock_kg: 12700.0,
        total_kg_sold: 4800.0,
        total_earnings_inr: 218400.0
      };
    }
  },

  // Kisan AI Assistant API
  async sendAIChat(message, language = 'en') {
    try {
      const res = await fetch(`${BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, language }),
      });
      return await handleResponse(res);
    } catch {
      const msg = message.toLowerCase();
      if (msg.includes('santra') || msg.includes('orange') || msg.includes('भाव') || msg.includes('rate')) {
        return {
          reply: language === 'mr'
            ? "📊 **नागपूर संत्रा (मृग बहार)** चा आजचा **कळमना एपीएमसी** मधील मोडल भाव **₹५२/kg** (₹५,२००/क्विंटल) आहे. AgroConnect वरून थेट खरेदी केल्यास सरासरी १५% बचत होते."
            : language === 'hi'
            ? "📊 **नागपुर संतरा** का आज **कलमना एपीएमसी** में मोडल भाव **₹52/kg** (₹5,200/क्विंटल) है। AgroConnect पर सीधे किसानों से खरीदी पर 15% की बचत होती है।"
            : "📊 Today's modal benchmark for **Nagpur Mandarin Oranges (Santra)** at **Kalamna APMC Market** is **₹52.0/kg** (₹5,200/Quintal). Farm-direct procurement saves an average of 15%."
        };
      }
      if (msg.includes('turmeric') || msg.includes('haldi') || msg.includes('हळद') || msg.includes('हल्दी')) {
        return {
          reply: language === 'mr'
            ? "🌿 **वर्धा सेंद्रिय हळद**: ५.८% करक्युमिनसह थेट शेतकऱ्यांकडून दर **₹१६५/kg** आहे. बाजार भाव ₹१८२/kg च्या तुलनेत ₹१७/kg ची थेट बचत होते."
            : language === 'hi'
            ? "🌿 **वर्धा जैविक हल्दी**: 5.8% करक्यूमिन युक्त दर **₹165/kg** है। मंडी भाव ₹182/kg की तुलना में ₹17/kg की सीधी बचत होती है।"
            : "🌿 **Wardha Organic Turmeric (Haldi)**: Farm-direct rate is **₹165/kg** for 5.8% curcumin grade vs Kalamna/Wardha Mandi benchmark of **₹182/kg** (Net Savings: ₹17/kg)."
        };
      }
      return {
        reply: language === 'mr'
          ? "🌾 **नमस्कार!** मी AgroConnect किसान सहायक आहे. विदर्भातील ताज्या संत्रा, हळद, सोयाबीन, बाजार भाव आणि थेट वाहतुकीबद्दल विचारा."
          : language === 'hi'
          ? "🌾 **नमस्ते!** मैं AgroConnect किसान सहायक हूँ। विदर्भ के संतरा, हल्दी, सोयाबीन, मंडी भाव और सीधी डिलीवरी के बारे में पूछें।"
          : "🌾 **Namaste!** I am your AgroConnect Kisan AI Assistant. Ask me about live Kalamna APMC rates, direct farmer savings, or consignment tracking!"
      };
    }
  },

  // Admin Ashish Central Control API
  async getAdminMetrics() {
    try {
      const res = await fetch(`${BASE_URL}/admin/metrics`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(res);
    } catch {
      const orders = getStoredOrders();
      const totalGmv = orders.reduce((acc, o) => acc + o.grand_total, 0);
      const totalCess = orders.reduce((acc, o) => acc + o.mandi_cess_amount, 0);
      const totalVol = orders.reduce((acc, o) => acc + (o.items?.reduce((iacc, i) => iacc + i.quantity_kg, 0) || 0), 0);

      return {
        admin_name: "Ashish Mohod",
        admin_city: "Nagpur",
        total_farmers: 6,
        total_retailers: 14,
        active_lots: getStoredLots().length,
        total_gmv_inr: totalGmv,
        total_mandi_cess_collected_inr: totalCess,
        total_volume_kg: totalVol,
        total_orders: orders.length,
        recent_orders: orders.slice(0, 8).map(o => ({
          id: o.id,
          order_number: o.order_number,
          buyer_name: "Rajesh Gupta",
          city: o.destination_city,
          grand_total: o.grand_total,
          status: o.status,
          date: o.created_at
        }))
      };
    }
  },

  async updateAdminMandiRate(rateId, modal_price_per_kg, trend) {
    try {
      const res = await fetch(`${BASE_URL}/admin/mandi-rates/${rateId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ modal_price_per_kg, trend }),
      });
      return await handleResponse(res);
    } catch {
      const rates = getStoredMandiRates();
      const rate = rates.find(r => r.id === parseInt(rateId));
      if (rate) {
        rate.modal_price_per_kg = modal_price_per_kg;
        rate.modal_price_quintal = modal_price_per_kg * 100;
        rate.trend = trend.toUpperCase();
        setStoredMandiRates(rates);
      }
      return { message: "Mandi rate updated live." };
    }
  },

  getAdminExportCsvUrl() {
    return `${BASE_URL}/admin/export-csv`;
  },
};
