from __future__ import annotations

import re
from pathlib import Path
from urllib.parse import quote

from docx import Document
from docx.enum.section import WD_ORIENT
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor


ROOT = Path(r"D:\Alumni_Portal1")
SOURCE_DIR = ROOT / "security-reports"
OUTPUT_DIR = SOURCE_DIR / "professional-documents" / "form-validation"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

NAVY = "17365D"
BLUE = "2F75B5"
PALE_BLUE = "D9EAF7"
PALE_ALT = "F3F7FA"
GRID = "9FBAD0"
DARK = "202A35"
MUTED = "5B6570"
FONT = "Arial"


def set_run_font(run, name=FONT, size=None, bold=None, color=None, italic=None):
    run.font.name = name
    run._element.get_or_add_rPr().rFonts.set(qn("w:ascii"), name)
    run._element.get_or_add_rPr().rFonts.set(qn("w:hAnsi"), name)
    run._element.get_or_add_rPr().rFonts.set(qn("w:eastAsia"), name)
    if size is not None:
        run.font.size = Pt(size)
    if bold is not None:
        run.bold = bold
    if color:
        run.font.color.rgb = RGBColor.from_string(color)
    if italic is not None:
        run.italic = italic


def set_cell_shading(cell, fill):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tc_pr.append(shd)
    shd.set(qn("w:fill"), fill)
    shd.set(qn("w:val"), "clear")


def set_cell_margins(cell, top=75, start=85, bottom=75, end=85):
    tc = cell._tc
    tc_pr = tc.get_or_add_tcPr()
    tc_mar = tc_pr.first_child_found_in("w:tcMar")
    if tc_mar is None:
        tc_mar = OxmlElement("w:tcMar")
        tc_pr.append(tc_mar)
    for m, v in (("top", top), ("start", start), ("bottom", bottom), ("end", end)):
        node = tc_mar.find(qn(f"w:{m}"))
        if node is None:
            node = OxmlElement(f"w:{m}")
            tc_mar.append(node)
        node.set(qn("w:w"), str(v))
        node.set(qn("w:type"), "dxa")


def set_table_borders(table):
    tbl_pr = table._tbl.tblPr
    borders = tbl_pr.first_child_found_in("w:tblBorders")
    if borders is None:
        borders = OxmlElement("w:tblBorders")
        tbl_pr.append(borders)
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        tag = f"w:{edge}"
        element = borders.find(qn(tag))
        if element is None:
            element = OxmlElement(tag)
            borders.append(element)
        element.set(qn("w:val"), "single")
        element.set(qn("w:sz"), "5")
        element.set(qn("w:space"), "0")
        element.set(qn("w:color"), GRID)


def repeat_table_header(row):
    tr_pr = row._tr.get_or_add_trPr()
    tbl_header = OxmlElement("w:tblHeader")
    tbl_header.set(qn("w:val"), "true")
    tr_pr.append(tbl_header)


def prevent_row_split(row):
    tr_pr = row._tr.get_or_add_trPr()
    tr_pr.append(OxmlElement("w:cantSplit"))


def add_field(paragraph, instruction):
    run = OxmlElement("w:r")
    begin = OxmlElement("w:fldChar")
    begin.set(qn("w:fldCharType"), "begin")
    run.append(begin)
    paragraph._p.append(run)

    instr_run = OxmlElement("w:r")
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = f" {instruction} "
    instr_run.append(instr)
    paragraph._p.append(instr_run)

    separate_run = OxmlElement("w:r")
    separate = OxmlElement("w:fldChar")
    separate.set(qn("w:fldCharType"), "separate")
    separate_run.append(separate)
    paragraph._p.append(separate_run)

    text_run = OxmlElement("w:r")
    text = OxmlElement("w:t")
    text.text = "1"
    text_run.append(text)
    paragraph._p.append(text_run)

    end_run = OxmlElement("w:r")
    end = OxmlElement("w:fldChar")
    end.set(qn("w:fldCharType"), "end")
    end_run.append(end)
    paragraph._p.append(end_run)


def add_hyperlink(paragraph, label, href):
    relationship_id = paragraph.part.relate_to(
        href,
        "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink",
        is_external=True,
    )
    hyperlink = OxmlElement("w:hyperlink")
    hyperlink.set(qn("r:id"), relationship_id)
    run = OxmlElement("w:r")
    properties = OxmlElement("w:rPr")
    color = OxmlElement("w:color")
    color.set(qn("w:val"), BLUE)
    properties.append(color)
    underline = OxmlElement("w:u")
    underline.set(qn("w:val"), "single")
    properties.append(underline)
    fonts = OxmlElement("w:rFonts")
    fonts.set(qn("w:ascii"), FONT)
    fonts.set(qn("w:hAnsi"), FONT)
    properties.append(fonts)
    run.append(properties)
    text = OxmlElement("w:t")
    text.text = label
    run.append(text)
    hyperlink.append(run)
    paragraph._p.append(hyperlink)


INLINE_TOKEN = re.compile(
    r"(`[^`]+`|\*\*.+?\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))"
)


def add_inline(paragraph, text, source_path, table=False):
    for token in INLINE_TOKEN.split(text):
        if not token:
            continue
        if token.startswith("`") and token.endswith("`"):
            run = paragraph.add_run(token[1:-1])
            set_run_font(run, "Consolas", 8.0 if table else 9.3, color="7A3E00")
        elif token.startswith("**") and token.endswith("**"):
            run = paragraph.add_run(token[2:-2])
            set_run_font(run, size=8.2 if table else 11, bold=True, color=DARK)
        elif token.startswith("*") and token.endswith("*"):
            run = paragraph.add_run(token[1:-1])
            set_run_font(run, size=8.2 if table else 11, italic=True, color=DARK)
        elif token.startswith("[") and "](" in token:
            match = re.fullmatch(r"\[([^\]]+)\]\(([^)]+)\)", token)
            if not match:
                run = paragraph.add_run(token)
                set_run_font(run, size=8.2 if table else 11, color=DARK)
                continue
            label, target = match.groups()
            if target.startswith(("http://", "https://", "mailto:")):
                href = target
            else:
                target_path, _, fragment = target.partition("#")
                resolved = (source_path.parent / target_path).resolve()
                href = "file:///" + quote(str(resolved).replace("\\", "/"), safe=":/")
                if fragment:
                    href += "#" + quote(fragment, safe="")
            add_hyperlink(paragraph, label, href)
        else:
            run = paragraph.add_run(token)
            set_run_font(run, size=8.2 if table else 11, color=DARK)


def split_table_row(line):
    line = line.strip()
    if line.startswith("|"):
        line = line[1:]
    if line.endswith("|"):
        line = line[:-1]

    cells = []
    current = []
    in_code = False
    index = 0
    while index < len(line):
        char = line[index]
        if char == "\\" and index + 1 < len(line) and line[index + 1] == "|":
            current.append("|")
            index += 2
            continue
        if char == "`":
            in_code = not in_code
            current.append(char)
        elif char == "|" and not in_code:
            cells.append("".join(current).strip())
            current = []
        else:
            current.append(char)
        index += 1
    cells.append("".join(current).strip())
    return cells


def is_table_separator(line):
    cells = split_table_row(line)
    return bool(cells) and all(re.fullmatch(r":?-{3,}:?", c.replace(" ", "")) for c in cells)


def add_page_number_footer(section):
    footer = section.footer
    p = footer.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(4)
    run = p.add_run("Page ")
    set_run_font(run, size=9, color=MUTED)
    add_field(p, "PAGE")


def apply_document_styles(doc):
    styles = doc.styles
    normal = styles["Normal"]
    normal.font.name = FONT
    normal._element.rPr.rFonts.set(qn("w:ascii"), FONT)
    normal._element.rPr.rFonts.set(qn("w:hAnsi"), FONT)
    normal.font.size = Pt(11)
    normal.font.color.rgb = RGBColor.from_string(DARK)
    normal.paragraph_format.space_after = Pt(6)
    normal.paragraph_format.line_spacing = 1.12

    for style_name, size, color, before, after in (
        ("Heading 1", 17, NAVY, 17, 7),
        ("Heading 2", 13, BLUE, 12, 5),
        ("Heading 3", 11.5, NAVY, 9, 4),
    ):
        style = styles[style_name]
        style.font.name = FONT
        style._element.rPr.rFonts.set(qn("w:ascii"), FONT)
        style._element.rPr.rFonts.set(qn("w:hAnsi"), FONT)
        style.font.size = Pt(size)
        style.font.bold = True
        style.font.color.rgb = RGBColor.from_string(color)
        style.paragraph_format.space_before = Pt(before)
        style.paragraph_format.space_after = Pt(after)
        style.paragraph_format.keep_with_next = True

    title = styles["Title"]
    title.font.name = FONT
    title._element.rPr.rFonts.set(qn("w:ascii"), FONT)
    title._element.rPr.rFonts.set(qn("w:hAnsi"), FONT)
    title.font.size = Pt(27)
    title.font.bold = True
    title.font.color.rgb = RGBColor.from_string(NAVY)
    title.paragraph_format.space_after = Pt(10)


def configure_section(section):
    section.orientation = WD_ORIENT.LANDSCAPE
    section.page_width = Inches(11.69)
    section.page_height = Inches(8.27)
    section.top_margin = Inches(0.62)
    section.bottom_margin = Inches(0.62)
    section.left_margin = Inches(0.62)
    section.right_margin = Inches(0.62)
    section.header_distance = Inches(0.28)
    section.footer_distance = Inches(0.28)

    header = section.header
    p = header.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_after = Pt(2)
    run = p.add_run("Alumni Portal – Form Validation Documentation")
    set_run_font(run, size=9, bold=True, color=NAVY)
    add_page_number_footer(section)


def add_cover(doc, title_text, doc_type, date_text):
    for _ in range(4):
        doc.add_paragraph().paragraph_format.space_after = Pt(10)
    title = doc.add_paragraph(style="Title")
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title.paragraph_format.space_after = Pt(18)
    r = title.add_run(title_text)
    set_run_font(r, size=28, bold=True, color=NAVY)

    subtitle = doc.add_paragraph()
    subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
    subtitle.paragraph_format.space_after = Pt(40)
    r = subtitle.add_run("Alumni Portal")
    set_run_font(r, size=19, bold=True, color=BLUE)

    for label, value in (
        ("Document type", doc_type),
        ("Preparation date", date_text),
    ):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_after = Pt(9)
        r = p.add_run(f"{label}: ")
        set_run_font(r, size=12, bold=True, color=NAVY)
        r = p.add_run(value)
        set_run_font(r, size=12, color=DARK)
    doc.add_page_break()


def extract_headings(lines):
    headings = []
    for line in lines:
        match = re.match(r"^(#{1,3})\s+(.+?)\s*#*\s*$", line)
        if match:
            level = len(match.group(1))
            text = re.sub(r"\s+#+\s*$", "", match.group(2)).strip()
            if not (level == 1 and text.startswith("Form Validation")):
                headings.append((level, text))
    return headings


def add_contents(doc, headings):
    h = doc.add_paragraph("Contents", style="Heading 1")
    h.paragraph_format.space_before = Pt(0)
    for level, text in headings:
        if level > 2:
            continue
        p = doc.add_paragraph()
        p.paragraph_format.left_indent = Inches(0.22 if level == 2 else 0)
        p.paragraph_format.space_after = Pt(3 if level == 1 else 1.5)
        p.paragraph_format.keep_together = True
        run = p.add_run(text)
        set_run_font(run, size=10 if level == 1 else 9.2, bold=(level == 1), color=NAVY if level == 1 else MUTED)
    doc.add_page_break()


def add_table(doc, rows, source_path):
    if not rows:
        return
    column_count = max(len(row) for row in rows)
    normalized = [row + [""] * (column_count - len(row)) for row in rows]
    table = doc.add_table(rows=1, cols=column_count)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    table.style = "Table Grid"
    set_table_borders(table)

    available = 10.45
    if column_count == 7:
        fractions = [0.075, 0.145, 0.155, 0.215, 0.175, 0.085, 0.15]
    elif column_count == 4:
        fractions = [0.18, 0.28, 0.27, 0.26]
    elif column_count == 3:
        fractions = [0.27, 0.31, 0.41]
    else:
        fractions = [1 / column_count] * column_count
    widths = [available * f for f in fractions]

    for row_index, values in enumerate(normalized):
        row = table.rows[0] if row_index == 0 else table.add_row()
        prevent_row_split(row)
        for col_index, value in enumerate(values):
            cell = row.cells[col_index]
            cell.width = Inches(widths[col_index])
            cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER if row_index == 0 else WD_CELL_VERTICAL_ALIGNMENT.TOP
            set_cell_margins(cell)
            if row_index == 0:
                set_cell_shading(cell, NAVY)
            elif row_index % 2 == 0:
                set_cell_shading(cell, PALE_ALT)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.line_spacing = 1.0
            add_inline(p, value, source_path, table=True)
            for run in p.runs:
                if row_index == 0:
                    set_run_font(run, "Consolas" if run.font.name == "Consolas" else FONT, 8.0, bold=True, color="FFFFFF")
                else:
                    name = "Consolas" if run.font.name == "Consolas" else FONT
                    set_run_font(run, name, 8.1)
    repeat_table_header(table.rows[0])
    doc.add_paragraph().paragraph_format.space_after = Pt(2)


def add_markdown_body(doc, source_path, lines):
    i = 0
    paragraph_buffer = []
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        if not stripped:
            if paragraph_buffer:
                p = doc.add_paragraph()
                add_inline(p, " ".join(s.strip() for s in paragraph_buffer), source_path)
                paragraph_buffer = []
            i += 1
            continue

        heading_match = re.match(r"^(#{1,3})\s+(.+?)\s*#*\s*$", stripped)
        if heading_match:
            if paragraph_buffer:
                p = doc.add_paragraph()
                add_inline(p, " ".join(s.strip() for s in paragraph_buffer), source_path)
                paragraph_buffer = []
            level = len(heading_match.group(1))
            heading_text = re.sub(r"\s+#+\s*$", "", heading_match.group(2)).strip()
            p = doc.add_paragraph(style=f"Heading {level}")
            add_inline(p, heading_text, source_path)
            i += 1
            continue

        if stripped.startswith("|") and i + 1 < len(lines) and is_table_separator(lines[i + 1]):
            if paragraph_buffer:
                p = doc.add_paragraph()
                add_inline(p, " ".join(s.strip() for s in paragraph_buffer), source_path)
                paragraph_buffer = []
            table_rows = [split_table_row(stripped)]
            i += 2
            while i < len(lines) and lines[i].strip().startswith("|"):
                table_rows.append(split_table_row(lines[i]))
                i += 1
            add_table(doc, table_rows, source_path)
            continue

        bullet = re.match(r"^(\s*)[-*+]\s+(.*)$", line)
        numbered = re.match(r"^(\s*)(\d+)\.\s+(.*)$", line)
        if bullet or numbered:
            if paragraph_buffer:
                p = doc.add_paragraph()
                add_inline(p, " ".join(s.strip() for s in paragraph_buffer), source_path)
                paragraph_buffer = []
            if bullet:
                indent, text = bullet.groups()
                p = doc.add_paragraph(style="List Bullet 2" if len(indent.expandtabs(4)) >= 2 else "List Bullet")
            else:
                indent, number, text = numbered.groups()
                p = doc.add_paragraph(style="List Number 2" if len(indent.expandtabs(4)) >= 2 else "List Number")
            p.paragraph_format.space_after = Pt(3)
            add_inline(p, text, source_path)
            i += 1
            continue

        if stripped in ("---", "***", "___"):
            if paragraph_buffer:
                p = doc.add_paragraph()
                add_inline(p, " ".join(s.strip() for s in paragraph_buffer), source_path)
                paragraph_buffer = []
            i += 1
            continue

        paragraph_buffer.append(line)
        i += 1

    if paragraph_buffer:
        p = doc.add_paragraph()
        add_inline(p, " ".join(s.strip() for s in paragraph_buffer), source_path)


def create_doc(source_filename, output_filename, doc_type, cover_title, date_text):
    source_path = SOURCE_DIR / source_filename
    source = source_path.read_text(encoding="utf-8")
    lines = source.splitlines()
    doc = Document()
    apply_document_styles(doc)
    for section in doc.sections:
        configure_section(section)

    doc.core_properties.title = cover_title
    doc.core_properties.subject = doc_type
    doc.core_properties.author = ""
    doc.core_properties.keywords = "Alumni Portal, form validation, quality assurance"

    add_cover(doc, cover_title, doc_type, date_text)
    add_contents(doc, extract_headings(lines))
    add_markdown_body(doc, source_path, lines)

    settings = doc.settings.element
    update_fields = settings.find(qn("w:updateFields"))
    if update_fields is None:
        update_fields = OxmlElement("w:updateFields")
        settings.append(update_fields)
    update_fields.set(qn("w:val"), "true")

    output_path = OUTPUT_DIR / output_filename
    if output_path.exists():
        raise FileExistsError(f"Refusing to overwrite existing output: {output_path}")
    doc.save(output_path)
    return output_path


if __name__ == "__main__":
    report = create_doc(
        "FORM_VALIDATION_TEST_REPORT.md",
        "Form_Validation_Test_Report.docx",
        "Form Validation and Quality Assurance Report",
        "Alumni Portal Form Validation and QA Report",
        "18 November 2026",
    )
    cases = create_doc(
        "FORM_VALIDATION_TEST_CASES.md",
        "Form_Validation_Test_Cases.docx",
        "Form Validation Test Case Register",
        "Form Validation Test Case Register",
        "18 November 2026",
    )
    print(report)
    print(cases)
