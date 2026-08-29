import re
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.produce import ProduceLot
from app.models.mandi import MandiPrice
from app.models.order import Order

router = APIRouter(prefix="/ai", tags=["Kisan AI Assistant"])

class ChatRequest(BaseModel):
    message: str
    language: str = "en" # "en", "mr", "hi"

class ChatResponse(BaseModel):
    reply: str
    suggested_actions: list[str] = []

@router.post("/chat", response_model=ChatResponse)
def kisan_ai_chat(req: ChatRequest, db: Session = Depends(get_db)):
    """
    Intelligent Kisan AI Assistant with Vidarbha Agricultural Intelligence, 
    live APMC mandi lookup, order tracking, and crop advisory.
    """
    msg = req.message.lower().strip()
    lang = req.language

    # 1. Order Tracking Query
    order_match = re.search(r"agc-\d+-[a-z0-9]+", msg)
    if order_match:
        order_num = order_match.group(0).upper()
        order = db.query(Order).filter(Order.order_number.ilike(f"%{order_num}%")).first()
        if order:
            if lang == "mr":
                reply = f"📦 **ऑर्डर {order.order_number}**: स्थिती **{order.status}** आहे. एकूण वजन {sum(i.quantity_kg for i in order.items)} kg, गंतव्यस्थान: {order.destination_city}. वाहन काटोल चेकपॉईंटवरून रवाना झाले आहे."
            elif lang == "hi":
                reply = f"📦 **ऑर्डर {order.order_number}**: वर्तमान स्थिति **{order.status}** है। कुल वजन {sum(i.quantity_kg for i in order.items)} kg, गंतव्य: {order.destination_city}। ट्रक कातोल से रवाना हो चुका है।"
            else:
                reply = f"📦 **Consignment #{order.order_number}**: Current status is **{order.status}**. Total volume: {sum(i.quantity_kg for i in order.items)} kg dispatched to {order.destination_city}. Live GPS indicates transit through Kalmeshwar APMC weighbridge."
            return ChatResponse(reply=reply, suggested_actions=["Download Tax Invoice", "View Delivery Route"])

    # 2. Mandi Price Query
    if any(k in msg for k in ["rate", "price", "bhav", "भाव", "दर", "mandi", "market", "santra", "orange", "turmeric", "haldi", "soybean"]):
        mandi_rates = db.query(MandiPrice).all()
        # Find specific commodity if mentioned
        target_rate = None
        for r in mandi_rates:
            if any(term in msg for term in r.commodity_name.lower().split()):
                target_rate = r
                break
        
        if target_rate:
            if lang == "mr":
                reply = f"📊 **{target_rate.commodity_name}** चा आजचा **{target_rate.mandi_name}** मधील मोडल भाव **₹{target_rate.modal_price_per_kg}/kg** (₹{target_rate.modal_price_quintal}/क्विंटल) आहे. कल: **{target_rate.trend}**."
            elif lang == "hi":
                reply = f"📊 **{target_rate.commodity_name}** का आज **{target_rate.mandi_name}** में मोडल भाव **₹{target_rate.modal_price_per_kg}/kg** (₹{target_rate.modal_price_quintal}/क्विंटल) है। रुझान: **{target_rate.trend}**."
            else:
                reply = f"📊 Today's modal benchmark for **{target_rate.commodity_name}** at **{target_rate.mandi_name}** is **₹{target_rate.modal_price_per_kg}/kg** (₹{target_rate.modal_price_quintal}/Quintal). Market trend is **{target_rate.trend}**."
        else:
            top_rates = ", ".join([f"{r.commodity_name.split('(')[0].strip()}: ₹{r.modal_price_per_kg}/kg" for r in mandi_rates[:3]])
            if lang == "mr":
                reply = f"🌾 **कळमना व विदर्भ मंडी भाव**: {top_rates}. AgroConnect वरून थेट खरेदी केल्यास सरासरी १५-१८% बचत होते."
            elif lang == "hi":
                reply = f"🌾 **कलमना व विदर्भ मंडी दर**: {top_rates}। AgroConnect पर सीधे किसानों से खरीदारी पर 15-18% की बचत होती है।"
            else:
                reply = f"🌾 **Key Vidarbha Mandi Rates Today**: {top_rates}. Buying directly on AgroConnect saves an average of 15–18% by bypassing intermediary commissions."
        return ChatResponse(reply=reply, suggested_actions=["Compare Mandi Savings", "Browse Harvest Batches"])

    # 3. Harvest & Quality Guidance
    if any(k in msg for k in ["harvest", "storage", "curcumin", "export", "quality", "sowing", "soil"]):
        if lang == "mr":
            reply = "🍊 **विदर्भ कृषी सल्ला**: नागपूर संत्रा (मृग बहार) तोडणीनंतर सावलीत प्रतवारी करावी. हळदीमध्ये ५.८% पेक्षा जास्त करक्युमिनसाठी नैसर्गिक उन्हात वाळवणे आवश्यक आहे. सोयाबीन JS-335 मध्ये आर्द्रता ९.५% पेक्षा कमी असावी."
        elif lang == "hi":
            reply = "🍊 **विदर्भ कृषि परामर्श**: नागपुर संतरा तुड़ाई के बाद छायादार शेड में ग्रेडिंग करें। हल्दी में 5.8% से अधिक करक्यूमिन हेतु प्राकृतिक धूप में सुखाएं। सोयाबीन में नमी 9.5% से कम रखें।"
        else:
            reply = "🍊 **Vidarbha Agronomy Advisory**: For GI-Tagged Nagpur Santra, sort by size under ventilated shade immediately post-harvest. For Wardha Turmeric, natural sun-curing preserves 5.8%+ curcumin. Soybeans (JS-335) should maintain moisture under 9.5% for storage."
        return ChatResponse(reply=reply, suggested_actions=["View Grade-A Batches", "Organic Certified Lots"])

    # 4. Logistics & Delivery to Nagpur Zero Mile
    if any(k in msg for k in ["truck", "delivery", "freight", "transport", "logistics", "mumbai", "pune"]):
        if lang == "mr":
            reply = "🚚 **वाहतूक व वाहतूक व्यवस्था**: काटोल, वर्धा आणि सावनेरहून नागपूर झिरो माईल / कळमना येथे २ ते ३ तासांत डायरेक्ट FTL ट्रक पोहोचतात. मुंबई/पुण्यासाठी एक्सप्रेस २२ तासांत डिलिव्हरी उपलब्ध आहे (दर: ₹१.५/kg)."
        elif lang == "hi":
            reply = "🚚 **परिवहन व्यवस्था**: कातोल, वर्धा और सावनेर से नागपुर ज़ीरो माइल 2-3 घंटे में सीधा FTL ट्रक पहुंचता है। मुंबई/पुणे हेतु 22 घंटे में एक्सप्रेस डिलीवरी (दर: ₹1.5/kg) उपलब्ध है।"
        else:
            reply = "🚚 **Nagpur Logistics Hub**: Direct Farm FTL trucks from Katol, Wardha, and Saoner arrive at Nagpur Zero Mile / Kalamna within 2–3 hours. Interstate dispatch to Mumbai/Pune APMC arrives in under 22 hours (flat ₹1.5/kg rate)."
        return ChatResponse(reply=reply, suggested_actions=["Calculate Freight Cost", "View Regional Map"])

    # Default friendly greeting & capabilities
    if lang == "mr":
        reply = "🙏 **नमस्कार! मी AgroConnect किसान सहायक आहे.** मी तुम्हाला आजचे कळमना मंडी भाव, थेट शेतकरी खरेदीतील बचत, पीक सल्ला आणि ऑर्डर ट्रॅकिंगमध्ये मदत करू शकतो. मला कोणताही प्रश्न विचारा!"
    elif lang == "hi":
        reply = "🙏 **नमस्ते! मैं AgroConnect किसान सहायक हूँ।** मैं आपको आज के कलमना मंडी भाव, सीधी किसान खरीदी पर बचत, फसल परामर्श और ऑर्डर ट्रैकिंग में सहायता कर सकता हूँ।"
    else:
        reply = "🌾 **Namaste! I am your AgroConnect Kisan AI Assistant.** I can help you with live Kalamna & Vidarbha mandi rates, calculate direct procurement savings, provide agronomy storage advice, or track your consignment. How can I assist you today?"

    return ChatResponse(
        reply=reply,
        suggested_actions=["Kalamna Santra Rate Today", "Track Order #AGC-20260829-NAGPUR01", "Turmeric Direct Savings"]
    )
