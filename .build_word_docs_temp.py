from __future__ import annotations

import re
from datetime import date
from io import BytesIO
from pathlib import Path
from urllib.parse import unquote, urlparse

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(r"D:\Alumni_Portal1")
SOURCE_DIR = ROOT / "security-reports"
OUT_DIR = SOURCE_DIR / "professional-documents"
PREPARED = "18 November 2026"
ASSESSMENT_DATE = "17 November 2026"
NAVY = "18324B"
TEAL = "197C80"
PALE = "EAF1F5"
LIGHT = "F4F7F9"
INK = "243746"
MUTED = "5C6B75"
WHITE = "FFFFFF"

REPORTS = [
    ("SECURITY_AUDIT_REPORT.md", "Application_Security_Audit_Report.docx"),
    ("VULNERABILITY_REGISTER.md", "Vulnerability_Register.docx"),
    ("REMEDIATION_LOG.md", "Security_Remediation_Report.docx"),
    ("RETESTING_REPORT.md", "Security_Retesting_Report.docx"),
    ("FUNCTIONAL_TEST_REPORT.md", "Functional_Testing_Report.docx"),
    ("DEPLOYMENT_READINESS_CHECKLIST.md", "Deployment_Readiness_Report.docx"),
    ("DATABASE_SCHEMA_SECURITY_REVIEW.md", "Database_Security_Assessment.docx"),
    ("DATABASE_VULNERABILITY_REGISTER.md", "Database_Vulnerability_Register.docx"),
    ("DATABASE_REMEDIATION_LOG.md", "Database_Remediation_Report.docx"),
    ("DATABASE_RETESTING_REPORT.md", "Database_Retesting_Report.docx"),
    ("DATABASE_MIGRATION_RECOMMENDATIONS.md", "Database_Migration_Recommendations.docx"),
]


def set_cell_shading(cell, fill: str) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tc_pr.append(shd)
    shd.set(qn("w:fill"), fill)


def set_cell_margins(cell, top=90, start=100, bottom=90, end=100) -> None:
    tc = cell._tc
    tc_pr = tc.get_or_add_tcPr()
    margins = tc_pr.first_child_found_in("w:tcMar")
    if margins is None:
        margins = OxmlElement("w:tcMar")
        tc_pr.append(margins)
    for m, v in (("top", top), ("start", start), ("bottom", bottom), ("end", end)):
        node = margins.find(qn(f"w:{m}"))
        if node is None:
            node = OxmlElement(f"w:{m}")
            margins.append(node)
        node.set(qn("w:w"), str(v))
        node.set(qn("w:type"), "dxa")


def set_repeat_table_header(row) -> None:
    tr_pr = row._tr.get_or_add_trPr()
    tbl_header = OxmlElement("w:tblHeader")
    tbl_header.set(qn("w:val"), "true")
    tr_pr.append(tbl_header)


def set_row_cant_split(row) -> None:
    tr_pr = row._tr.get_or_add_trPr()
    cant_split = OxmlElement("w:cantSplit")
    tr_pr.append(cant_split)


def add_hyperlink(paragraph, text: str, target: str, color=TEAL) -> None:
    part = paragraph.part
    rel_id = part.relate_to(
        target,
        "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink",
        is_external=True,
    )
    hyperlink = OxmlElement("w:hyperlink")
    hyperlink.set(qn("r:id"), rel_id)
    run = OxmlElement("w:r")
    rpr = OxmlElement("w:rPr")
    c = OxmlElement("w:color")
    c.set(qn("w:val"), color)
    rpr.append(c)
    u = OxmlElement("w:u")
    u.set(qn("w:val"), "single")
    rpr.append(u)
    fonts = OxmlElement("w:rFonts")
    fonts.set(qn("w:ascii"), "Arial")
    fonts.set(qn("w:hAnsi"), "Arial")
    rpr.append(fonts)
    run.append(rpr)
    t = OxmlElement("w:t")
    t.text = text
    run.append(t)
    hyperlink.append(run)
    paragraph._p.append(hyperlink)


INLINE_RE = re.compile(r"(\[[^\]]+\]\([^)]+\)|\*\*.+?\*\*|`[^`]+`|(?<!\*)\*[^*]+\*)")


def apply_run_font(run, *, size=10.5, color=INK, bold=None, italic=None, name="Arial"):
    run.font.name = name
    run._element.get_or_add_rPr().rFonts.set(qn("w:ascii"), name)
    run._element.get_or_add_rPr().rFonts.set(qn("w:hAnsi"), name)
    run.font.size = Pt(size)
    run.font.color.rgb = RGBColor.from_string(color)
    if bold is not None:
        run.bold = bold
    if italic is not None:
        run.italic = italic


def markdown_target(target: str, source_path: Path | None, master=False) -> str | None:
    if target.startswith("http://") or target.startswith("https://") or target.startswith("mailto:"):
        return target
    if master and target.startswith("WORD:"):
        return (OUT_DIR / unquote(target[5:])).resolve().as_uri()
    if source_path:
        raw_path, _, fragment = target.partition("#")
        local = (source_path.parent / unquote(raw_path)).resolve()
        uri = local.as_uri()
        return uri + (f"#{fragment}" if fragment else "")
    return None


def add_inline(paragraph, text: str, source_path: Path | None = None, master=False, base_size=10.5):
    pos = 0
    for match in INLINE_RE.finditer(text):
        if match.start() > pos:
            run = paragraph.add_run(text[pos:match.start()])
            apply_run_font(run, size=base_size)
        token = match.group(0)
        if token.startswith("["):
            m = re.match(r"\[([^\]]+)\]\(([^)]+)\)", token)
            label, target = m.group(1), m.group(2)
            url = markdown_target(target, source_path, master)
            if url:
                add_hyperlink(paragraph, label, url)
            else:
                run = paragraph.add_run(label)
                apply_run_font(run, size=base_size, color=TEAL, underline=True)
        elif token.startswith("**"):
            run = paragraph.add_run(token[2:-2])
            apply_run_font(run, size=base_size, bold=True)
        elif token.startswith("`"):
            run = paragraph.add_run(token[1:-1])
            apply_run_font(run, size=9.0, color=NAVY, name="Consolas")
        else:
            run = paragraph.add_run(token[1:-1])
            apply_run_font(run, size=base_size, italic=True)
        pos = match.end()
    if pos < len(text):
        run = paragraph.add_run(text[pos:])
        apply_run_font(run, size=base_size)


def add_page_field(paragraph, instruction: str):
    run = paragraph.add_run()
    apply_run_font(run, size=9, color=MUTED)
    begin = OxmlElement("w:fldChar")
    begin.set(qn("w:fldCharType"), "begin")
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = f" {instruction} "
    separate = OxmlElement("w:fldChar")
    separate.set(qn("w:fldCharType"), "separate")
    display = OxmlElement("w:t")
    display.text = "1"
    end = OxmlElement("w:fldChar")
    end.set(qn("w:fldCharType"), "end")
    for node in (begin, instr, separate, display, end):
        run._r.append(node)


def add_toc_field(paragraph):
    run = paragraph.add_run()
    begin = OxmlElement("w:fldChar")
    begin.set(qn("w:fldCharType"), "begin")
    begin.set(qn("w:dirty"), "true")
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = ' TOC \\o "1-2" \\h \\z \\u '
    separate = OxmlElement("w:fldChar")
    separate.set(qn("w:fldCharType"), "separate")
    t = OxmlElement("w:t")
    t.text = "Open in Word and update the table to display section names and page numbers."
    end = OxmlElement("w:fldChar")
    end.set(qn("w:fldCharType"), "end")
    for node in (begin, instr, separate, t, end):
        run._r.append(node)


def set_document_settings(doc):
    for section in doc.sections:
        section.page_width = Inches(8.27)
        section.page_height = Inches(11.69)
        section.top_margin = Inches(0.72)
        section.bottom_margin = Inches(0.72)
        section.left_margin = Inches(0.78)
        section.right_margin = Inches(0.78)
        section.header_distance = Inches(0.32)
        section.footer_distance = Inches(0.34)
        section.different_first_page_header_footer = True

    styles = doc.styles
    normal = styles["Normal"]
    normal.font.name = "Arial"
    normal._element.rPr.rFonts.set(qn("w:ascii"), "Arial")
    normal._element.rPr.rFonts.set(qn("w:hAnsi"), "Arial")
    normal.font.size = Pt(10.5)
    normal.font.color.rgb = RGBColor.from_string(INK)
    normal.paragraph_format.space_after = Pt(6)
    normal.paragraph_format.line_spacing = 1.12

    for stylename, size, color in (("Title", 27, NAVY), ("Heading 1", 17, NAVY), ("Heading 2", 13, TEAL), ("Heading 3", 11, NAVY)):
        style = styles[stylename]
        style.font.name = "Arial"
        style._element.rPr.rFonts.set(qn("w:ascii"), "Arial")
        style._element.rPr.rFonts.set(qn("w:hAnsi"), "Arial")
        style.font.size = Pt(size)
        style.font.color.rgb = RGBColor.from_string(color)
        style.font.bold = True
        style.paragraph_format.space_before = Pt(12 if stylename != "Title" else 0)
        style.paragraph_format.space_after = Pt(6)
        style.paragraph_format.keep_with_next = True

    for style_name in ("List Bullet", "List Number"):
        style = styles[style_name]
        style.font.name = "Arial"
        style._element.rPr.rFonts.set(qn("w:ascii"), "Arial")
        style.font.size = Pt(10.5)
        style.paragraph_format.space_after = Pt(3)

    hdr = doc.sections[0].header.paragraphs[0]
    hdr.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    run = hdr.add_run("ALUMNI PORTAL  |  SECURITY ASSESSMENT")
    apply_run_font(run, size=8, color=MUTED, bold=True)

    footer = doc.sections[0].footer.paragraphs[0]
    footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = footer.add_run("Alumni Portal Security Documentation  |  Page ")
    apply_run_font(run, size=8.5, color=MUTED)
    add_page_field(footer, "PAGE")

    settings = doc.settings._element
    update = settings.find(qn("w:updateFields"))
    if update is None:
        update = OxmlElement("w:updateFields")
        settings.append(update)
    update.set(qn("w:val"), "true")


def add_cover(doc, title: str, subtitle: str, source_name: str):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(54)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run("ALUMNI PORTAL")
    apply_run_font(run, size=12, color=TEAL, bold=True)

    p = doc.add_paragraph(style="Title")
    p.paragraph_format.space_before = Pt(92)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run(title)
    apply_run_font(run, size=28, color=NAVY, bold=True)

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run(subtitle)
    apply_run_font(run, size=14, color=MUTED)

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(55)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run("Application Security and PostgreSQL Assessment")
    apply_run_font(run, size=11.5, color=INK, bold=True)

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(80)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    for label, value in (("Prepared", PREPARED), ("Assessment evidence dated", ASSESSMENT_DATE), ("Version", "1.0")):
        r = p.add_run(f"{label}: {value}\n")
        apply_run_font(r, size=10, color=MUTED)
    if source_name:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run(f"Source report: {source_name}")
        apply_run_font(run, size=9, color=MUTED)
    doc.add_page_break()


def clear_paragraph(p):
    for child in list(p._p):
        if child.tag != qn("w:pPr"):
            p._p.remove(child)


def parse_table_row(line: str):
    cells = line.strip().strip("|").split("|")
    return [cell.strip().replace("\\|", "|") for cell in cells]


def is_table_separator(line: str):
    cells = parse_table_row(line)
    return bool(cells) and all(re.fullmatch(r":?-{3,}:?", cell.replace(" ", "")) for cell in cells)


def add_markdown_table(doc, rows, caption, source_path=None, master=False, table_counter=1):
    if not rows:
        return table_counter
    max_cols = max(len(row) for row in rows)
    rows = [row + [""] * (max_cols - len(row)) for row in rows]
    cap = doc.add_paragraph()
    cap.paragraph_format.keep_with_next = True
    cap.paragraph_format.space_before = Pt(5)
    cap.paragraph_format.space_after = Pt(3)
    run = cap.add_run(f"Table {table_counter}. {caption or 'Source report data'}")
    apply_run_font(run, size=9.5, color=NAVY, bold=True)

    table = doc.add_table(rows=len(rows), cols=max_cols)
    table.style = "Table Grid"
    table.autofit = True
    table.alignment = 1
    for ri, row in enumerate(rows):
        for ci, value in enumerate(row):
            cell = table.cell(ri, ci)
            cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
            set_cell_margins(cell)
            p = cell.paragraphs[0]
            clear_paragraph(p)
            p.paragraph_format.space_after = Pt(1)
            p.paragraph_format.line_spacing = 1.0
            add_inline(p, value, source_path, master, base_size=8.6 if max_cols >= 4 else 9.0)
            for run in p.runs:
                if ri == 0:
                    run.bold = True
                    run.font.color.rgb = RGBColor.from_string(WHITE)
            if ri == 0:
                set_cell_shading(cell, NAVY)
            elif ri % 2 == 0:
                set_cell_shading(cell, LIGHT)
        set_row_cant_split(table.rows[ri])
    set_repeat_table_header(table.rows[0])
    doc.add_paragraph().paragraph_format.space_after = Pt(1)
    return table_counter + 1


def set_keep(paragraph):
    paragraph.paragraph_format.widow_control = True


def draw_diagram(kind: str) -> BytesIO:
    width, height = 1600, 460
    img = Image.new("RGB", (width, height), "white")
    draw = ImageDraw.Draw(img)
    font_path = r"C:\Windows\Fonts\arial.ttf"
    bold_path = r"C:\Windows\Fonts\arialbd.ttf"
    font = ImageFont.truetype(font_path, 29)
    small = ImageFont.truetype(font_path, 22)
    bold = ImageFont.truetype(bold_path, 31)

    if kind == "architecture":
        boxes = [
            (35, 92, 475, 300, "Browser interface", "Pages, forms, cookie client"),
            (580, 92, 1020, 300, "Next.js application", "UI and API routes; auth checks"),
            (1125, 92, 1565, 300, "PostgreSQL", "Users, profiles, events, records"),
        ]
        for x1, y1, x2, y2, title, detail in boxes:
            draw.rounded_rectangle((x1, y1, x2, y2), radius=20, fill=f"#{PALE}", outline=f"#{NAVY}", width=4)
            draw.text((x1 + 22, y1 + 44), title, font=bold, fill=f"#{NAVY}")
            draw.text((x1 + 22, y1 + 112), detail, font=font, fill=f"#{INK}")
        for x1, x2 in ((475, 580), (1020, 1125)):
            y = 196
            draw.line((x1 + 8, y, x2 - 12, y), fill=f"#{TEAL}", width=6)
            draw.polygon([(x2 - 12, y), (x2 - 32, y - 13), (x2 - 32, y + 13)], fill=f"#{TEAL}")
        draw.text((480, 334), "Cookie-authenticated requests", font=small, fill=f"#{MUTED}")
        draw.text((1055, 334), "Parameterized SQL via pg", font=small, fill=f"#{MUTED}")
        draw.text((310, 395), "Uploads pass through an administrator-guarded API and are stored under public/uploads.", font=small, fill=f"#{MUTED}")
    elif kind == "auth":
        labels = [
            (20, "Email + password", "Submitted to login API"),
            (415, "Password check", "bcrypt comparison"),
            (810, "Signed session", "HMAC, HttpOnly, expiry"),
            (1205, "Protected route", "Signature + DB role check"),
        ]
        for x, title, detail in labels:
            draw.rounded_rectangle((x, 115, x + 360, 310), radius=18, fill=f"#{PALE}", outline=f"#{NAVY}", width=4)
            draw.text((x + 20, 155), title, font=bold, fill=f"#{NAVY}")
            draw.text((x + 20, 222), detail, font=font, fill=f"#{INK}")
        for x in (380, 775, 1170):
            draw.line((x, 212, x + 30, 212), fill=f"#{TEAL}", width=6)
            draw.polygon([(x + 30, 212), (x + 10, 199), (x + 10, 225)], fill=f"#{TEAL}")
        draw.text((285, 368), "A signed cookie proves it was issued by the application; the database provides current account state and role.", font=small, fill=f"#{MUTED}")
    else:
        labels = ["Inventory", "Assess", "Remediate", "Retest", "Report residuals"]
        box_w = 270
        gap = 42
        x = 20
        for i, label in enumerate(labels):
            draw.rounded_rectangle((x, 140, x + box_w, 285), radius=18, fill=f"#{PALE}", outline=f"#{NAVY}", width=4)
            draw.text((x + 20, 192), label, font=bold, fill=f"#{NAVY}")
            if i < len(labels) - 1:
                ax = x + box_w
                draw.line((ax + 4, 212, ax + gap - 10, 212), fill=f"#{TEAL}", width=6)
                draw.polygon([(ax + gap - 10, 212), (ax + gap - 28, 199), (ax + gap - 28, 225)], fill=f"#{TEAL}")
            x += box_w + gap
        draw.text((260, 350), "Local evidence and blockers are recorded separately from production verification.", font=small, fill=f"#{MUTED}")

    buf = BytesIO()
    img.save(buf, format="PNG", dpi=(180, 180))
    buf.seek(0)
    return buf


def add_figure(doc, kind: str, caption: str, number: int):
    image = draw_diagram(kind)
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(5)
    p.paragraph_format.space_after = Pt(3)
    shape = p.add_run().add_picture(image, width=Inches(6.75))
    shape._inline.docPr.set("descr", caption)
    cap = doc.add_paragraph()
    cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    cap.paragraph_format.keep_with_next = True
    run = cap.add_run(f"Figure {number}. {caption}")
    apply_run_font(run, size=9, color=MUTED, italic=True)


def add_cover_to_docx(title, subtitle, source_name, body, output_path, source_path=None, master=False):
    doc = Document()
    set_document_settings(doc)
    doc.core_properties.title = title
    doc.core_properties.subject = "Alumni Portal application and database security assessment"
    doc.core_properties.author = "Alumni Portal Security Assessment"
    doc.core_properties.keywords = "Alumni Portal, application security, PostgreSQL, assessment"
    add_cover(doc, title, subtitle, source_name)

    lines = body.splitlines()
    i = 0
    table_count = 1
    figure_count = 1
    last_heading = "Source report data"
    first_h1_skipped = False
    counters = {"headings": 0, "tables": 0, "code_blocks": 0, "paragraphs": 0}

    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        if not stripped or stripped in ("---", "***", "___"):
            i += 1
            continue

        if master and stripped == "[[TOC]]":
            p = doc.add_paragraph()
            add_toc_field(p)
            doc.add_page_break()
            i += 1
            continue

        fig_match = re.fullmatch(r"\[\[DIAGRAM:(architecture|auth|workflow)\]\]", stripped)
        if master and fig_match:
            caption = {"architecture": "Source-derived application architecture", "auth": "Authentication and authorization flow after remediation", "workflow": "Assessment and remediation workflow"}[fig_match.group(1)]
            add_figure(doc, fig_match.group(1), caption, figure_count)
            figure_count += 1
            i += 1
            continue

        if stripped.startswith("```") or stripped.startswith("~~~"):
            fence = stripped[:3]
            code_lines = []
            i += 1
            while i < len(lines) and not lines[i].strip().startswith(fence):
                code_lines.append(lines[i])
                i += 1
            i += 1
            p = doc.add_paragraph()
            p.paragraph_format.left_indent = Inches(0.18)
            p.paragraph_format.right_indent = Inches(0.12)
            p.paragraph_format.space_before = Pt(3)
            p.paragraph_format.space_after = Pt(8)
            p.paragraph_format.keep_together = True
            pPr = p._p.get_or_add_pPr()
            shd = OxmlElement("w:shd")
            shd.set(qn("w:fill"), LIGHT)
            pPr.append(shd)
            run = p.add_run("\n".join(code_lines))
            apply_run_font(run, size=8.5, color=NAVY, name="Consolas")
            counters["code_blocks"] += 1
            continue

        heading = re.match(r"^(#{1,6})\s+(.+?)\s*#*\s*$", stripped)
        if heading:
            hashes, text = heading.group(1), heading.group(2)
            if len(hashes) == 1 and not first_h1_skipped:
                first_h1_skipped = True
                i += 1
                continue
            level = min(max(len(hashes) - 1, 1), 3)
            p = doc.add_paragraph(style=f"Heading {level}")
            add_inline(p, text, source_path, master, base_size={1: 17, 2: 13, 3: 11}[level])
            last_heading = re.sub(r"\*\*|`|\*", "", text)
            counters["headings"] += 1
            i += 1
            continue

        if stripped.startswith("|") and i + 1 < len(lines) and lines[i + 1].strip().startswith("|"):
            table_lines = [stripped]
            i += 1
            if i < len(lines) and is_table_separator(lines[i].strip()):
                i += 1
            while i < len(lines) and lines[i].strip().startswith("|"):
                table_lines.append(lines[i].strip())
                i += 1
            rows = [parse_table_row(x) for x in table_lines]
            table_count = add_markdown_table(doc, rows, last_heading, source_path, master, table_count)
            counters["tables"] += 1
            continue

        if stripped.startswith(">"):
            p = doc.add_paragraph()
            p.paragraph_format.left_indent = Inches(0.28)
            p.paragraph_format.right_indent = Inches(0.12)
            p.paragraph_format.space_before = Pt(4)
            p.paragraph_format.space_after = Pt(7)
            add_inline(p, stripped.lstrip("> "), source_path, master)
            for run in p.runs:
                run.italic = True
            counters["paragraphs"] += 1
            i += 1
            continue

        bullet = re.match(r"^(\s*)([-*+])\s+(.*)$", line)
        numbered = re.match(r"^(\s*)\d+[.)]\s+(.*)$", line)
        if bullet or numbered:
            matched = bullet or numbered
            indent = len(matched.group(1).replace("\t", "    ")) // 2
            text = matched.group(3) if bullet else matched.group(2)
            checkbox = re.match(r"\[([ xX])\]\s*(.*)", text)
            if checkbox:
                text = ("☒ " if checkbox.group(1).strip() else "☐ ") + checkbox.group(2)
            style = "List Bullet" if bullet else "List Number"
            p = doc.add_paragraph(style=style)
            p.paragraph_format.left_indent = Inches(0.28 + indent * 0.22)
            p.paragraph_format.first_line_indent = Inches(-0.14)
            add_inline(p, text, source_path, master)
            counters["paragraphs"] += 1
            i += 1
            continue

        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(6)
        set_keep(p)
        add_inline(p, stripped, source_path, master)
        counters["paragraphs"] += 1
        i += 1

    output_path.parent.mkdir(parents=True, exist_ok=True)
    doc.save(output_path)
    # Reopen every generated file so malformed OOXML/container output fails early.
    reopened = Document(output_path)
    extracted = "\n".join(p.text for p in reopened.paragraphs)
    extracted += "\n" + "\n".join(cell.text for table in reopened.tables for row in table.rows for cell in row.cells)
    return {"path": str(output_path), "bytes": output_path.stat().st_size, "body_text_chars": len(extracted), **counters}


MASTER = r'''# Project Information

| Item | Details |
|---|---|
| Project | Alumni Portal |
| Assessment focus | Application security, functional regression, and PostgreSQL schema security |
| Workspace assessed | `D:\Alumni_Portal1` |
| Evidence date in source reports | 17 November 2026 |
| Documentation package prepared | 18 November 2026 |
| Assessment target | Local source and local development server; no production environment |
| Overall disposition | Production readiness has not been established |

## Executive Summary

This report brings together the local application security review, remediation, functional checks, and static PostgreSQL schema assessment for the Alumni Portal. The work improved several important controls, including server-verified sessions, administrator authorization, privacy filtering, request limits, and upload validation. Local security and browser tests passed, but database-backed and deployment behavior could not be fully checked.

The application review recorded 11 findings: 3 are **FIXED AND VERIFIED**, and 8 are **PARTIALLY MITIGATED**. The database review recorded 8 findings: 2 are **FIXED AND VERIFIED** by static SQL validation, 2 are **PARTIALLY MITIGATED**, 1 is **NOT FIXED**, and 3 are **NOT VERIFIED**. Static SQL checks do not prove that the schema runs on the target PostgreSQL version or works against existing data.

Security tests passed 6/6, browser functional checks passed 20/20, and the safe API validation subset passed 6/6. The full read-only API suite passed 6 tests and failed 7 database-dependent checks with HTTP 500 because PostgreSQL was not configured. The TypeScript check passed and the production build compiled when lint was skipped. The normal lint gate reports 111 errors and 56 warnings.

No production database, credentials, or external systems were accessed. No SQL was executed. The app and database therefore **must not be described as production-secure or production-ready** based on this assessment alone.

## Introduction

The Alumni Portal includes public pages, member registration and directory features, events, gallery and news content, an administrator interface, and PostgreSQL-backed API routes. The assessment focused on whether a user could impersonate an administrator, access or change data beyond their role, expose private member information, misuse uploads, or create integrity problems in the database design.

## Project Objectives

- Review the authentication and authorization boundaries used by the application.
- Protect administrative write operations and the file upload API.
- Reduce false verification states and unnecessary public exposure of member data.
- Test important public pages and API validation behavior after remediation.
- Review database constraints, relationships, defaults, views, functions, triggers, and indexes.
- Record what was verified locally and what remains dependent on database or deployment access.

## Project Scope

The review covered application source and the SQL/schema documentation found in `D:\Alumni_Portal1\security-reports\`. The primary schema was `D:\Alumni_Portal1\Main Database.sql`. Application checks ran against a local Next.js server on `127.0.0.1:3101`.

The scope did not include production services, production data, credentials, deployment proxy configuration, external systems, or execution of SQL against a database. No database runtime was available. The database review was static. Existing uncommitted project work was preserved.

## Role and Responsibilities

The assessment activities documented here included reviewing source routes and schema definitions, implementing targeted application security changes in the existing workspace, adding a separate hardened schema copy with limited additive checks and indexes, running local tests, reviewing test failures, and preparing the reports. The documentation distinguishes tool-run results from static source review and from database behaviors that remain unverified.

## Technology Stack and Tools

| Area | Observed technology or tool |
|---|---|
| Web application | Next.js 15 App Router, React 19, TypeScript |
| Database access | PostgreSQL through the `pg` package |
| Password verification | `bcryptjs` |
| Local tests | Playwright browser and API suites; TypeScript and ESLint checks |
| Dependency check | Offline `npm audit` using available local metadata |
| Database review | Static SQL and application-query inspection; no SQL client available |
| Static security scanner | Semgrep unavailable; not installed |

## Security Testing Methodology

The review followed a five-stage workflow: inventory the existing code and SQL, identify trust and data-integrity risks, make targeted changes that preserve current contracts, run local regression checks, and record residual risks. Playwright requests tested forged identity claims and unauthenticated writes. Browser checks confirmed key routes still rendered. Database changes were compared statically rather than executed.

[[DIAGRAM:workflow]]

The evidence in this report is limited to the local workspace and command outputs recorded in the supporting reports. A passing negative authorization test verifies rejection of a forged request; it does not prove a successful administrator operation against a real database.

## Application Architecture Overview

The source shows browser pages communicating with Next.js API routes. API routes use shared authentication and database helpers, and database queries use PostgreSQL through `pg`. The upload route writes approved files under the project’s public upload directory. The diagram summarizes the source-derived path; it is not a production network diagram.

[[DIAGRAM:architecture]]

The intended authentication flow now checks the password with bcrypt and issues a signed, time-limited HttpOnly cookie. Protected requests verify the signature and read the current active account and role from PostgreSQL. An HttpOnly cookie is browser-managed and not readable by ordinary page JavaScript; an HMAC signature lets the server detect tampering. The valid-login and database-role path was not integration-tested because no database was configured.

[[DIAGRAM:auth]]

## Application Security Assessment

The most serious original issue was trusting client-provided role or identity claims. Application changes now use signed sessions, check current database role for privileged operations, add origin checks, and deny forged header, bearer, malformed-cookie, and tampered-cookie requests. Administrative event, news, gallery, profile, and upload writes are protected. Public alumni submissions remain available as pending requests.

Registration now requires a 10-character minimum, within bcrypt’s 72-byte input limit. New accounts and alumni records remain unverified until review. Public directory responses and browser cache paths remove selected sensitive fields. Rate limiting is process-local, and uploaded image signatures are checked without decoding or re-encoding the full image.

## Vulnerability Identification and Classification

### Application findings

| ID | Severity | Finding | Final status |
|---|---|---|---|
| SEC-01 | Critical | Forged administrator authorization | FIXED AND VERIFIED for forged claims; positive DB-backed admin flow remains an integration test |
| SEC-02 | High | Unprotected administrative writes | PARTIALLY MITIGATED |
| SEC-03 | High | Client-only authentication state | PARTIALLY MITIGATED |
| SEC-04 | High | False account/profile verification | PARTIALLY MITIGATED; real email/SMS verification is absent |
| SEC-05 | High | Seeded administrator credential | PARTIALLY MITIGATED; existing databases were not inspected |
| SEC-06 | Medium | Public profile data exposure | PARTIALLY MITIGATED; DB-backed serialized output was not tested |
| SEC-07 | Medium | Caller-supplied email used as identity | FIXED AND VERIFIED for unauthenticated identity requests |
| SEC-08 | Medium | Login/registration abuse and enumeration | PARTIALLY MITIGATED; limits are process-local |
| SEC-09 | Medium | Unsafe upload validation | PARTIALLY MITIGATED; content decoding remains |
| SEC-10 | Low | Internal error disclosure | FIXED AND VERIFIED in reviewed API response/logging paths |
| SEC-11 | Informational | Missing browser security headers | PARTIALLY MITIGATED; deployed TLS and full CSP remain unverified |

### Database findings

| ID | Severity | Finding | Final status |
|---|---|---|---|
| DB-01 | Medium | Verification requests may be ownerless or have negative attempts | FIXED AND VERIFIED by static SQL checks |
| DB-02 | High | Initiative deletion cascades into donation history | PARTIALLY MITIGATED; proposal only |
| DB-03 | Medium | Consent defaults are true; event API also writes true unconditionally | NOT FIXED |
| DB-04 | High, conditional | Directory view includes PII and unverified profiles | NOT VERIFIED; grants are unknown |
| DB-05 | High, deployment-dependent | No least-privilege roles or grants in project SQL | NOT VERIFIED |
| DB-06 | Medium | Linked member/user email equality is not enforced | PARTIALLY MITIGATED by current registration path |
| DB-07 | Medium | Donor and audit fields can hold sensitive personal data | NOT VERIFIED; data and privileges unavailable |
| DB-08 | Low | Several foreign-key columns lacked indexes | FIXED AND VERIFIED by static SQL checks |

Severity describes potential impact, not a measured production exploit. Conditional and unverified findings are explicitly labeled as such in the database register.

## Security Remediation Activities

Application changes added HMAC-signed expiring sessions, HttpOnly/SameSite cookies, fresh role checks, logout expiration, origin checks, protected admin mutations, safer registration state, public-data redaction, rate limits, bounded upload checks, generic API errors, production configuration checks, and browser headers. A disabled placeholder replaced the active seeded administrator in the schema source; no existing database was changed.

The separate hardened SQL copy adds a verification-request owner check, a nonnegative attempt check, and five indexes supporting foreign-key maintenance. It preserves the source’s table and column names, views, triggers, seed data, and other relationships. The original SQL file was not modified during the database assessment.

## Functional Testing and Results

| Suite | Result | What it covered |
|---|---:|---|
| Browser functional routes | 20 passed | Main, login, register, invite, members, events, gallery, news, departments, contact and donation pages; basic form/search affordances |
| Safe API validation subset | 6 passed | Missing credentials, invalid email, weak password, no-session user lookup, and no-session upload |
| Security regression suite | 6 passed | Forged identity/session claims, protected writes, origin, logout cookie, headers, public routes and password feedback |
| Full read-only API suite | 6 passed, 7 failed | Seven DB-dependent health/list/department endpoints returned HTTP 500 without PostgreSQL |

No writes to a database were attempted. The API failures are recorded, not hidden; they identify the missing database environment and do not confirm correct database-backed behavior.

## Automated Testing Results

| Check | Result | Qualification |
|---|---|---|
| `npx tsc --noEmit` | Pass | No TypeScript diagnostics on final sequential run |
| `npx next build --no-lint` | Pass | Production compile, types, 29 static pages and route traces; lint explicitly skipped |
| Normal build / full ESLint | Fail | 111 errors and 56 warnings; normal build stops at the lint gate |
| Targeted ESLint | Pass | Auth, session, rate-limit, logout, security specs/config and headers files |
| `npm audit --offline --json` | 0 cached advisories | 440 dependencies counted; no current registry refresh |
| Semgrep | Not run | Tool unavailable; no installation performed |
| CodeQL | Not run | Workflow not dispatched to an external service |

## PostgreSQL Database Schema Assessment

The static inventory found 18 tables, 16 foreign keys, 3 views, 3 trigger functions, 13 triggers, and 33 original indexes. All tables have primary keys in the script. Project SQL defines no database roles, grants/revocations, RLS policies, or `SECURITY DEFINER` routines, so deployment permissions cannot be inferred.

The member directory view includes email, phone, user ID, and unverified records. Application API code applies filters and redaction, but a database role with `SELECT` on the view could bypass those API controls. Effective grants were unavailable. Donation deletion behavior, consent defaults, linked profile identity, and personal-data retention are covered in the database register and migration recommendations.

## Database Security Improvements

The hardened schema statically rejects ownerless verification requests and negative retry counts. Five indexes were added for `member_skills.skill_id`, `events.created_by`, `gallery_items.uploaded_by`, `news_articles.created_by`, and `contact_inquiries.resolved_by`. Object counts and all unchanged schema text were compared. This is a source-level validation only; no SQL parser, PostgreSQL runtime, catalog, existing data, or query plan was available.

## Before-and-After Remediation Evidence

| Area | Before | After / evidence |
|---|---|---|
| Administrator identity | Client-controlled headers, bearer strings, and cookie text could be trusted | Forged claims and tampered sessions are rejected in local Playwright tests; current DB role required by implementation |
| Session | Browser storage was treated as identity | Signed, expiring HttpOnly cookie and session-required identity API; positive database login remains unverified |
| Admin writes | Public mutation paths were insufficiently guarded | Forged POST/PUT/PATCH/DELETE cases return 403; legitimate DB-backed admin flow awaits integration test |
| Verification | Account/profile states could be marked verified without proof | Registration creates pending/unverified records; actual email/SMS delivery is absent |
| Public directory | Sensitive contact/demographic data was included in app responses/cache | Code suppresses selected fields; real DB-backed output awaits testing |
| Upload | Public upload and metadata-only trust | Admin guard and extension/MIME/size/signature checks; unauthorized upload returned 403; no decode/re-encode |
| Verification requests | Null owner and negative attempts allowed | Hardened schema has checks; static comparison passed |
| Foreign-key maintenance | Five referenced columns unindexed | Five indexes added in separate hardened copy; static count 33 to 38 |
| Donation history | Campaign deletion cascades into donations | No destructive change; migration proposal calls for restrict/soft-delete review |

## Final Retesting Results

Application security suite: 6/6 passed. Browser functional suite: 20/20 passed. Safe API subset: 6/6 passed. Full API: 6 passed and 7 database-dependent failures. TypeScript and targeted lint passed. Production compilation passed with lint disabled; the standard build remains blocked by full lint errors. Database static checks passed for the two implemented corrections, but no SQL ran against PostgreSQL.

## Remaining Risks and Limitations

- No database-backed login, valid admin action, registration insert, privacy payload, or CRUD behavior was tested.
- Existing deployed administrator credentials and actual grants/ownership are unknown.
- Registration uses admin approval; there is no email/SMS verification provider.
- Rate limits are per process and require shared storage for multiple instances; proxy IP handling must be configured.
- Upload signatures do not prove complete image decoding safety.
- Database views and PII controls depend on deployment roles/grants not present in the SQL source.
- Donation history can be removed by initiative cascade; consent recording needs an application change.
- Semgrep, current online dependency advisory data, and hosted CodeQL findings were not obtained.

## Production Readiness Assessment

**Not ready for production sign-off based on this evidence.** Before deployment, configure `AUTH_SECRET`, a least-privilege PostgreSQL runtime role and reviewed grants, verify/rotate existing administrator credentials, test against a disposable non-production PostgreSQL instance, resolve the lint gate, validate proxy/rate-limit behavior, and check HTTPS/HSTS and CSP in the deployment. Review migration proposals for consent, donation retention, views, identity consistency, and sensitive-data retention.

## Learning Outcomes

This assessment provides examples of how browser-provided identity differs from server-verified identity, how to test authorization boundaries, why negative test results must be reported, and how database constraints and indexes support data integrity and operations. It also demonstrates the limits of static review when actual grants, data, and database behavior are unavailable.

## Conclusion

The local remediation improved important security controls and passed the available authentication-denial, browser, API validation, and static SQL checks. Several production-sensitive paths remain unverified, and the full API and lint results contain failures that are explicitly documented. A non-production PostgreSQL integration pass and deployment configuration review are required before a production readiness decision.

## References and Supporting Documentation

The detailed source reports remain preserved in `D:\Alumni_Portal1\security-reports\`. The corresponding editable Word documents are linked below.

| Supporting report | Word document |
|---|---|
| Application security audit | [Application Security Audit Report](WORD:Application_Security_Audit_Report.docx) |
| Application vulnerability register | [Vulnerability Register](WORD:Vulnerability_Register.docx) |
| Application remediation log | [Security Remediation Report](WORD:Security_Remediation_Report.docx) |
| Security retesting | [Security Retesting Report](WORD:Security_Retesting_Report.docx) |
| Functional test results | [Functional Testing Report](WORD:Functional_Testing_Report.docx) |
| Deployment checklist | [Deployment Readiness Report](WORD:Deployment_Readiness_Report.docx) |
| Database schema review | [Database Security Assessment](WORD:Database_Security_Assessment.docx) |
| Database vulnerability register | [Database Vulnerability Register](WORD:Database_Vulnerability_Register.docx) |
| Database remediation log | [Database Remediation Report](WORD:Database_Remediation_Report.docx) |
| Database retesting | [Database Retesting Report](WORD:Database_Retesting_Report.docx) |
| Database migration recommendations | [Database Migration Recommendations](WORD:Database_Migration_Recommendations.docx) |

The separate hardened SQL artifact is `D:\Alumni_Portal1\security-reports\database-remediation\Main_Database_hardened.sql`. It is for review and is not an executed migration.
'''


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    results = []
    for md_name, docx_name in REPORTS:
        source = SOURCE_DIR / md_name
        if not source.exists():
            raise FileNotFoundError(source)
        text = source.read_text(encoding="utf-8")
        title_match = re.search(r"(?m)^#\s+(.+?)\s*$", text)
        title = title_match.group(1) if title_match else source.stem.replace("_", " ").title()
        result = add_cover_to_docx(
            title=title,
            subtitle="Supporting Security Assessment Report",
            source_name=md_name,
            body=text,
            output_path=OUT_DIR / docx_name,
            source_path=source,
        )
        result["source"] = md_name
        results.append(result)

    master_path = OUT_DIR / "Alumni_Portal_Security_Assessment_Final_Report.docx"
    master_result = add_cover_to_docx(
        title="Alumni Portal Security Assessment Final Report",
        subtitle="Application and PostgreSQL Review, Remediation, and Retesting",
        source_name="Master report with linked supporting documents",
        body=MASTER,
        output_path=master_path,
        source_path=None,
        master=True,
    )
    master_result["source"] = "Generated master report"
    results.append(master_result)

    print(f"Created {len(results)} DOCX files in {OUT_DIR}")
    for result in results:
        print(f"{result['source']} -> {Path(result['path']).name}; {result['bytes']} bytes; {result['headings']} headings; {result['tables']} tables; {result['code_blocks']} code blocks; {result['body_text_chars']} text chars")


if __name__ == "__main__":
    main()
