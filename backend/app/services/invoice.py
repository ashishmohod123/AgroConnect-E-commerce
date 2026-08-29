import os
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

INVOICE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "invoices")
os.makedirs(INVOICE_DIR, exist_ok=True)

def generate_order_invoice_pdf(order, retailer, order_items_data) -> str:
    """
    Generates a professional B2B Tax Invoice & Agricultural Consignment Note PDF.
    Returns the absolute path to the generated PDF.
    """
    filename = f"Invoice_{order.order_number}.pdf"
    filepath = os.path.join(INVOICE_DIR, filename)

    doc = SimpleDocTemplate(
        filepath,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'MainTitle',
        parent=styles['Heading1'],
        fontSize=20,
        textColor=colors.HexColor('#1b4332'),
        spaceAfter=2
    )
    subtitle_style = ParagraphStyle(
        'Subtitle',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.HexColor('#52b788'),
        spaceAfter=10
    )
    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontSize=12,
        textColor=colors.HexColor('#2d6a4f'),
        spaceBefore=8,
        spaceAfter=4
    )
    body_bold = ParagraphStyle(
        'BodyBold',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.HexColor('#212529'),
        fontName='Helvetica-Bold'
    )
    body_text = ParagraphStyle(
        'BodyText',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.HexColor('#495057')
    )

    elements = []

    # Header section
    elements.append(Paragraph("<b>AgroConnect</b> — B2B Farm Marketplace", title_style))
    elements.append(Paragraph("Direct Farmer-to-Retailer Trade Network | Nagpur & Vidarbha APMC Corridor", subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#2d6a4f'), spaceAfter=12))

    # Invoice Meta & Buyer/Seller Details in a 2-column table
    created_date_str = order.created_at.strftime('%d %B %Y, %I:%M %p') if hasattr(order.created_at, 'strftime') else str(order.created_at)
    
    meta_info = [
        [
            Paragraph(f"<b>INVOICE NO:</b> {order.order_number}<br/>"
                      f"<b>Date:</b> {created_date_str}<br/>"
                      f"<b>Payment Status:</b> <font color='#2d6a4f'><b>{order.payment_status}</b></font><br/>"
                      f"<b>Method:</b> {order.payment_method}<br/>"
                      f"<b>Ref ID:</b> {order.payment_id or 'N/A'}", body_text),
            Paragraph(f"<b>CONSIGNEE (BUYER):</b><br/>"
                      f"<b>Name:</b> {retailer.full_name}<br/>"
                      f"<b>Business:</b> {retailer.business_or_farm_name}<br/>"
                      f"<b>Phone:</b> {retailer.phone}<br/>"
                      f"<b>Delivery To:</b> {order.shipping_address}, {order.destination_city}", body_text)
        ]
    ]
    meta_table = Table(meta_info, colWidths=[3.5 * inch, 3.8 * inch])
    meta_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8f9fa')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#dee2e6')),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    elements.append(meta_table)
    elements.append(Spacer(1, 14))

    # Items Table
    elements.append(Paragraph("<b>Agricultural Consignment & Lot Details:</b>", section_heading))
    
    table_data = [
        [
            Paragraph("<b>#</b>", body_bold),
            Paragraph("<b>Commodity & Variety</b>", body_bold),
            Paragraph("<b>Grade & Origin</b>", body_bold),
            Paragraph("<b>Qty (kg)</b>", body_bold),
            Paragraph("<b>Rate (Rs/kg)</b>", body_bold),
            Paragraph("<b>Total (Rs)</b>", body_bold)
        ]
    ]

    for idx, item in enumerate(order_items_data, start=1):
        lot = item.get('produce_lot')
        comm_name = lot.commodity_name if lot else "Produce Item"
        variety = lot.variety if lot else "Standard"
        grade = lot.quality_grade if lot else "Grade A"
        location = lot.farm_location if lot else "Nagpur"
        
        table_data.append([
            Paragraph(str(idx), body_text),
            Paragraph(f"<b>{comm_name}</b><br/><font size='7.5' color='#6c757d'>{variety}</font>", body_text),
            Paragraph(f"{grade}<br/><font size='7.5' color='#6c757d'>Origin: {location}</font>", body_text),
            Paragraph(f"{item.get('quantity_kg', 0):,.1f} kg", body_text),
            Paragraph(f"Rs. {item.get('price_per_kg', 0):,.2f}", body_text),
            Paragraph(f"<b>Rs. {item.get('subtotal', 0):,.2f}</b>", body_text),
        ])

    items_table = Table(table_data, colWidths=[0.4*inch, 2.3*inch, 2.0*inch, 0.9*inch, 0.8*inch, 1.0*inch])
    items_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e8f5e9')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor('#1b4332')),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('ALIGN', (3,1), (-1,-1), 'RIGHT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#ced4da')),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(items_table)
    elements.append(Spacer(1, 12))

    # Summary Totals Table
    totals_data = [
        [Paragraph("Produce Subtotal:", body_text), Paragraph(f"Rs. {order.total_amount:,.2f}", body_bold)],
        [Paragraph("Mandi Regulatory Cess (1.5% APMC):", body_text), Paragraph(f"Rs. {order.mandi_cess_amount:,.2f}", body_text)],
        [Paragraph("Freight & Logistics Dispatch:", body_text), Paragraph(f"Rs. {order.logistics_cost:,.2f}", body_text)],
        [Paragraph("<b>FINAL PAYABLE GRAND TOTAL:</b>", body_bold), Paragraph(f"<b>Rs. {order.grand_total:,.2f}</b>", body_bold)],
    ]
    totals_table = Table(totals_data, colWidths=[5.4*inch, 2.0*inch])
    totals_table.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'RIGHT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BACKGROUND', (0,-1), (-1,-1), colors.HexColor('#d8f3dc')),
        ('LINEABOVE', (0,-1), (-1,-1), 1, colors.HexColor('#2d6a4f')),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(totals_table)
    elements.append(Spacer(1, 20))

    # Footer note & certification
    elements.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#adb5bd'), spaceAfter=8))
    elements.append(Paragraph(
        "<b>Terms & Condition:</b> This electronic consignment note is generated automatically by AgroConnect B2B Trading Platform. "
        "Direct farmer settlement is processed upon QR dispatch verification at Kalamna / Wardha APMC checkpoints.",
        ParagraphStyle('Footer', parent=styles['Normal'], fontSize=7.5, textColor=colors.HexColor('#6c757d'))
    ))

    # Build PDF document
    doc.build(elements)
    return filepath
