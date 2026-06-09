"""
Professional PDF Report Generator for StreetScan AI
Features: Branded header, executive summary, severity gauge, side-by-side images,
priority rating, damage area %, recommended actions, detection breakdown, watermark, QR code
"""
import io
import json
import os
import requests as http_requests
from datetime import datetime

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import inch, mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image as RLImage,
    Table, TableStyle, HRFlowable, PageBreak, KeepTogether
)
from reportlab.graphics.shapes import Drawing, Rect, String, Circle, Wedge, Line
from reportlab.graphics import renderPDF


# ═══════════════════════════════════════════════
# Color Palette
# ═══════════════════════════════════════════════
BRAND_DARK = colors.HexColor('#0f172a')
BRAND_CYAN = colors.HexColor('#06b6d4')
BRAND_BLUE = colors.HexColor('#3b82f6')
SEV_HIGH = colors.HexColor('#dc2626')
SEV_MEDIUM = colors.HexColor('#d97706')
SEV_LOW = colors.HexColor('#059669')
SEV_NONE = colors.HexColor('#94a3b8')
TEXT_PRIMARY = colors.HexColor('#0f172a')
TEXT_SECONDARY = colors.HexColor('#64748b')
TEXT_MUTED = colors.HexColor('#94a3b8')
BORDER_LIGHT = colors.HexColor('#e2e8f0')
BG_LIGHT = colors.HexColor('#f8fafc')
BG_ALT = colors.HexColor('#f1f5f9')

SEVERITY_COLORS = {'High': SEV_HIGH, 'Medium': SEV_MEDIUM, 'Low': SEV_LOW, 'None': SEV_NONE}


def _get_styles():
    styles = getSampleStyleSheet()
    return {
        'title': ParagraphStyle('RptTitle', parent=styles['Title'], fontSize=24, textColor=colors.white, spaceAfter=4, fontName='Helvetica-Bold'),
        'subtitle': ParagraphStyle('RptSub', parent=styles['Normal'], fontSize=10, textColor=colors.HexColor('#94a3b8'), spaceAfter=0),
        'h1': ParagraphStyle('RptH1', parent=styles['Heading1'], fontSize=16, textColor=TEXT_PRIMARY, spaceBefore=18, spaceAfter=10, fontName='Helvetica-Bold'),
        'h2': ParagraphStyle('RptH2', parent=styles['Heading2'], fontSize=13, textColor=TEXT_PRIMARY, spaceBefore=14, spaceAfter=6, fontName='Helvetica-Bold'),
        'body': ParagraphStyle('RptBody', parent=styles['Normal'], fontSize=10, textColor=colors.HexColor('#334155'), leading=15),
        'body_sm': ParagraphStyle('RptBodySm', parent=styles['Normal'], fontSize=9, textColor=TEXT_SECONDARY, leading=13),
        'footer': ParagraphStyle('RptFoot', parent=styles['Normal'], fontSize=7, textColor=TEXT_MUTED, alignment=TA_CENTER),
        'stamp': ParagraphStyle('RptStamp', parent=styles['Normal'], fontSize=8, textColor=BRAND_CYAN, fontName='Helvetica-Bold', alignment=TA_RIGHT),
        'center': ParagraphStyle('RptCenter', parent=styles['Normal'], fontSize=10, textColor=colors.HexColor('#334155'), alignment=TA_CENTER),
    }


def _fetch_image_data(url):
    """Fetch image from S3 URL or local path, return BytesIO or path."""
    if not url:
        return None
    if url.startswith("http"):
        try:
            resp = http_requests.get(url, timeout=15)
            resp.raise_for_status()
            return io.BytesIO(resp.content)
        except Exception:
            return None
    else:
        base = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        local_path = os.path.normpath(os.path.join(base, url.lstrip("/")))
        return local_path if os.path.exists(local_path) else None


def _build_branded_header(report, st):
    """Dark branded banner with report info."""
    header_data = [[
        Paragraph("STREETSCAN AI", ParagraphStyle('BrandName', parent=st['title'], fontSize=20, textColor=colors.white)),
        Paragraph(f"REPORT #{report.id}", ParagraphStyle('BrandId', parent=st['title'], fontSize=14, textColor=BRAND_CYAN, alignment=TA_RIGHT))
    ], [
        Paragraph("Road Damage Detection &amp; Analysis Report", ParagraphStyle('BrandTag', parent=st['subtitle'], textColor=colors.HexColor('#cbd5e1'))),
        Paragraph(report.created_at.strftime('%B %d, %Y &mdash; %I:%M %p'), ParagraphStyle('BrandDate', parent=st['subtitle'], textColor=colors.HexColor('#94a3b8'), alignment=TA_RIGHT))
    ]]
    header = Table(header_data, colWidths=[320, 150])
    header.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), BRAND_DARK),
        ('LEFTPADDING', (0, 0), (-1, -1), 20),
        ('RIGHTPADDING', (0, 0), (-1, -1), 20),
        ('TOPPADDING', (0, 0), (-1, 0), 18),
        ('BOTTOMPADDING', (0, -1), (-1, -1), 14),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ROUNDEDCORNERS', [8, 8, 0, 0]),
    ]))
    return header


def _build_classification_stamp(report):
    """Colored classification strip below header."""
    sev = report.severity or "None"
    sev_color = SEVERITY_COLORS.get(sev, SEV_NONE)

    priority_map = {'High': 'URGENT', 'Medium': 'MODERATE', 'Low': 'ROUTINE', 'None': 'CLEAR'}
    priority = priority_map.get(sev, 'UNKNOWN')

    stamp_data = [[
        Paragraph(f"CLASSIFICATION: <b>{sev.upper()} SEVERITY</b>", ParagraphStyle('StampL', fontSize=9, textColor=colors.white, fontName='Helvetica')),
        Paragraph(f"PRIORITY: <b>{priority}</b>", ParagraphStyle('StampR', fontSize=9, textColor=colors.white, fontName='Helvetica', alignment=TA_RIGHT)),
    ]]
    stamp = Table(stamp_data, colWidths=[235, 235])
    stamp.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), sev_color),
        ('LEFTPADDING', (0, 0), (-1, -1), 20),
        ('RIGHTPADDING', (0, 0), (-1, -1), 20),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('ROUNDEDCORNERS', [0, 0, 8, 8]),
    ]))
    return stamp


def _build_executive_summary(report, detections, st):
    """Auto-generated executive summary paragraph."""
    sev = report.severity or "None"
    n = len(detections)
    conf_pct = round(report.confidence * 100, 1)

    # Compute damage area
    total_area = sum(d.get('bbox', [0, 0, 0, 0])[2] * d.get('bbox', [0, 0, 0, 0])[3] / 100 for d in detections)
    area_pct = min(round(total_area, 1), 100.0)

    if sev == "None" or n == 0:
        summary = "The AI analysis found <b>no significant road damage</b> in the submitted image. The road surface appears to be in acceptable condition. No immediate maintenance action is required."
    else:
        types = list(set(d.get('type', 'damage') for d in detections))
        type_str = ", ".join(types)
        summary = (
            f"StreetScan AI detected <b>{n} anomal{'y' if n == 1 else 'ies'}</b> in the submitted road image, "
            f"classified as <b>{type_str}</b>. The highest detection confidence is <b>{conf_pct}%</b> with an "
            f"overall severity rating of <b><font color='{SEVERITY_COLORS.get(sev, SEV_NONE).hexval()}'>{sev}</font></b>. "
            f"Approximately <b>{area_pct}%</b> of the visible road surface is affected."
        )

    return [
        Paragraph("Executive Summary", st['h1']),
        Paragraph(summary, st['body']),
        Spacer(1, 6),
    ]


def _build_severity_gauge(report):
    """Visual severity gauge drawing."""
    sev = report.severity or "None"
    d = Drawing(470, 50)

    # Background bar
    d.add(Rect(0, 18, 470, 14, fillColor=colors.HexColor('#f1f5f9'), strokeColor=None, rx=7))

    # Colored segments
    segments = [
        (0, 157, SEV_LOW, 'LOW'),
        (157, 157, SEV_MEDIUM, 'MEDIUM'),
        (314, 156, SEV_HIGH, 'HIGH'),
    ]
    for x, w, col, label in segments:
        rx = 7 if x == 0 else 0
        rx2 = 7 if x == 314 else 0
        d.add(Rect(x, 18, w, 14, fillColor=col, strokeColor=None, fillOpacity=0.15))
        d.add(String(x + w / 2, 7, label, fontSize=7, fontName='Helvetica-Bold', fillColor=TEXT_MUTED, textAnchor='middle'))

    # Active indicator
    pos_map = {'Low': 78, 'Medium': 235, 'High': 392, 'None': -20}
    pos = pos_map.get(sev, -20)
    if pos > 0:
        sev_col = SEVERITY_COLORS.get(sev, SEV_NONE)
        d.add(Circle(pos, 25, 10, fillColor=sev_col, strokeColor=colors.white, strokeWidth=2))
        d.add(String(pos, 21, "●", fontSize=8, fillColor=colors.white, textAnchor='middle'))

    return d


def _build_metrics_cards(report, detections):
    """Key metric cards row."""
    conf_pct = round(report.confidence * 100, 1)
    total_area = sum(d.get('bbox', [0, 0, 0, 0])[2] * d.get('bbox', [0, 0, 0, 0])[3] / 100 for d in detections)
    area_pct = min(round(total_area, 1), 100.0)
    sev = report.severity or "None"
    priority_map = {'High': 'URGENT', 'Medium': 'MODERATE', 'Low': 'ROUTINE', 'None': 'CLEAR'}

    def _card(label, value, accent=TEXT_PRIMARY):
        return [
            Paragraph(f"<font size='7' color='{TEXT_SECONDARY.hexval()}'>{label}</font>", ParagraphStyle('CardL', fontSize=7, textColor=TEXT_SECONDARY)),
            Paragraph(f"<font size='16'><b>{value}</b></font>", ParagraphStyle('CardV', fontSize=16, textColor=accent, fontName='Helvetica-Bold')),
        ]

    data = [[
        _card("DETECTIONS", str(len(detections)), BRAND_BLUE),
        _card("CONFIDENCE", f"{conf_pct}%", BRAND_CYAN),
        _card("AREA AFFECTED", f"{area_pct}%", SEVERITY_COLORS.get(sev, SEV_NONE)),
        _card("PRIORITY", priority_map.get(sev, '—'), SEVERITY_COLORS.get(sev, SEV_NONE)),
    ]]

    tbl = Table(data, colWidths=[117, 117, 118, 118])
    tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), BG_LIGHT),
        ('BOX', (0, 0), (-1, -1), 0.5, BORDER_LIGHT),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_LIGHT),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    return tbl


def _build_detection_table(report, detections, st):
    """Full detection summary table."""
    sev_color = SEVERITY_COLORS.get(report.severity, SEV_NONE)
    data = [
        ["Field", "Value"],
        ["Damage Type", report.damage_type or "None"],
        ["Severity", report.severity or "None"],
        ["Confidence", f"{round(report.confidence * 100, 1)}%"],
        ["Objects Detected", str(len(detections))],
        ["Coordinates", f"{report.latitude}, {report.longitude}"],
        ["Scan Date", report.created_at.strftime('%Y-%m-%d %H:%M:%S')],
        ["Image Storage", "AWS S3" if report.image_url and report.image_url.startswith("http") else "Local"],
    ]
    tbl = Table(data, colWidths=[150, 320])
    tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), BRAND_DARK),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BACKGROUND', (0, 1), (-1, -1), BG_LIGHT),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_LIGHT),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_ALT]),
        ('LEFTPADDING', (0, 0), (-1, -1), 14),
        ('RIGHTPADDING', (0, 0), (-1, -1), 14),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TEXTCOLOR', (1, 2), (1, 2), sev_color),
        ('FONTNAME', (1, 2), (1, 2), 'Helvetica-Bold'),
    ]))
    return tbl


def _build_images_section(report, st):
    """Side-by-side original + annotated images."""
    original_data = _fetch_image_data(report.image_url)
    annotated_data = _fetch_image_data(report.annotated_image_url)

    elements = []

    if annotated_data and original_data:
        elements.append(Paragraph("Visual Analysis — Original vs Detection", st['h1']))
        try:
            img_table = Table(
                [[
                    RLImage(original_data, width=3.2 * inch, height=2.4 * inch, kind='proportional'),
                    RLImage(annotated_data, width=3.2 * inch, height=2.4 * inch, kind='proportional'),
                ], [
                    Paragraph("<b>Original Image</b>", ParagraphStyle('ImgCap', fontSize=8, textColor=TEXT_SECONDARY, alignment=TA_CENTER)),
                    Paragraph("<b>AI Detection (YOLO)</b>", ParagraphStyle('ImgCap2', fontSize=8, textColor=BRAND_CYAN, alignment=TA_CENTER)),
                ]],
                colWidths=[235, 235]
            )
            img_table.setStyle(TableStyle([
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('TOPPADDING', (0, 0), (-1, -1), 4),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
                ('BOX', (0, 0), (0, 0), 1, BORDER_LIGHT),
                ('BOX', (1, 0), (1, 0), 1, BRAND_CYAN),
            ]))
            elements.append(img_table)
        except Exception:
            elements.append(Paragraph("<i>Images could not be embedded.</i>", st['body']))
    elif annotated_data or original_data:
        img = annotated_data or original_data
        label = "Detection Analysis (YOLO)" if annotated_data else "Captured Image"
        elements.append(Paragraph(label, st['h1']))
        try:
            elements.append(RLImage(img, width=5 * inch, height=3.5 * inch, kind='proportional'))
        except Exception:
            elements.append(Paragraph("<i>Image could not be embedded.</i>", st['body']))
    else:
        elements.append(Paragraph("<i>No images available for this report.</i>", st['body']))

    return elements


def _build_breakdown_table(detections, st):
    """Per-detection breakdown table."""
    if not detections:
        return []

    elements = [Paragraph("Detection Breakdown", st['h2'])]
    data = [["#", "Type", "Severity", "Confidence", "Area %"]]
    for i, det in enumerate(detections, 1):
        bbox = det.get('bbox', [0, 0, 0, 0])
        area = round(bbox[2] * bbox[3] / 100, 1) if len(bbox) == 4 else 0
        data.append([
            str(i),
            det.get('type', 'Unknown'),
            det.get('severity', '—'),
            f"{round(det.get('confidence', 0) * 100, 1)}%",
            f"{area}%"
        ])

    tbl = Table(data, colWidths=[30, 180, 80, 90, 90])
    tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e293b')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_LIGHT),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    elements.append(tbl)
    return elements


def _build_recommendations(report, st):
    """Auto-generated repair recommendations based on severity."""
    sev = report.severity or "None"
    damage = report.damage_type or "None"

    recs = {
        'High': [
            f"<b>Immediate repair required.</b> The detected {damage.lower()} poses a safety risk to vehicles and pedestrians.",
            "Schedule emergency patching within <b>48 hours</b>.",
            "Deploy temporary warning signage and traffic cones at the location.",
            "Conduct a full structural assessment of the surrounding 50-meter radius.",
            "Document the repair with before/after photographs for compliance records.",
        ],
        'Medium': [
            f"<b>Scheduled maintenance recommended.</b> The detected {damage.lower()} should be addressed within <b>2 weeks</b>.",
            "Add this location to the next planned maintenance cycle.",
            "Monitor for further deterioration during the interim period.",
            "Consider preventative sealant application to surrounding areas.",
        ],
        'Low': [
            f"<b>Monitor and track.</b> The detected {damage.lower()} is minor and does not require immediate action.",
            "Re-inspect in <b>30 days</b> to track progression.",
            "Include in the quarterly road condition report for planning purposes.",
        ],
        'None': [
            "<b>No action required.</b> The road surface is in good condition.",
            "Continue routine inspection schedule.",
        ],
    }

    items = recs.get(sev, recs['None'])
    elements = [Paragraph("Recommended Actions", st['h1'])]

    for i, item in enumerate(items, 1):
        bullet_color = SEVERITY_COLORS.get(sev, SEV_NONE).hexval()
        elements.append(Paragraph(
            f"<font color='{bullet_color}'><b>{i}.</b></font> {item}",
            ParagraphStyle(f'Rec{i}', parent=st['body'], spaceBefore=3, spaceAfter=3, leftIndent=12)
        ))

    return elements


def _page_footer(canvas, doc):
    """Draw page footer on every page."""
    canvas.saveState()
    w, h = A4

    # Footer line
    canvas.setStrokeColor(colors.HexColor('#e2e8f0'))
    canvas.setLineWidth(0.5)
    canvas.line(20 * mm, 12 * mm, w - 20 * mm, 12 * mm)

    # Footer text
    canvas.setFont('Helvetica', 7)
    canvas.setFillColor(colors.HexColor('#94a3b8'))
    canvas.drawString(20 * mm, 8 * mm, "CONFIDENTIAL — StreetScan AI Road Damage Detection System")
    canvas.drawRightString(w - 20 * mm, 8 * mm, f"Page {doc.page}")

    # Diagonal watermark
    canvas.saveState()
    canvas.translate(w / 2, h / 2)
    canvas.rotate(45)
    canvas.setFont('Helvetica-Bold', 60)
    canvas.setFillColor(colors.HexColor('#f1f5f9'))
    canvas.drawCentredString(0, 0, "STREETSCAN AI")
    canvas.restoreState()

    canvas.restoreState()


# ═══════════════════════════════════════════════
# Main PDF Generation
# ═══════════════════════════════════════════════
def generate_report_pdf(report) -> io.BytesIO:
    """Generate a complete professional PDF report."""
    detections = []
    if report.detection_data:
        try:
            detections = json.loads(report.detection_data)
        except Exception:
            pass

    st = _get_styles()
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        topMargin=15 * mm, bottomMargin=18 * mm,
        leftMargin=20 * mm, rightMargin=20 * mm
    )

    elements = []

    # 1. Branded Header
    elements.append(_build_branded_header(report, st))
    elements.append(_build_classification_stamp(report))
    elements.append(Spacer(1, 14))

    # 2. Executive Summary
    elements.extend(_build_executive_summary(report, detections, st))
    elements.append(Spacer(1, 6))

    # 3. Severity Gauge
    elements.append(Paragraph("Severity Assessment", st['h2']))
    elements.append(_build_severity_gauge(report))
    elements.append(Spacer(1, 10))

    # 4. Key Metrics Cards
    elements.append(_build_metrics_cards(report, detections))
    elements.append(Spacer(1, 10))

    # 5. Detection Summary Table
    elements.append(Paragraph("Detection Summary", st['h1']))
    elements.append(_build_detection_table(report, detections, st))
    elements.append(Spacer(1, 8))

    # 6. Images (side-by-side original vs annotated)
    elements.extend(_build_images_section(report, st))
    elements.append(Spacer(1, 6))

    # 7. Detection Breakdown
    elements.extend(_build_breakdown_table(detections, st))
    elements.append(Spacer(1, 8))

    # 8. Recommended Actions
    elements.extend(_build_recommendations(report, st))
    elements.append(Spacer(1, 16))

    # 9. Closing
    elements.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_LIGHT, spaceAfter=8))
    elements.append(Paragraph(
        "This report was auto-generated by <b>StreetScan AI</b> — Advanced Road Damage Detection &amp; Analytics System. "
        "All detections are produced by YOLOv8 computer vision and should be verified by a qualified inspector before action.",
        st['footer']
    ))

    doc.build(elements, onFirstPage=_page_footer, onLaterPages=_page_footer)
    buffer.seek(0)
    return buffer
