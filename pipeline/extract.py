"""
LawFlash AI — Smart Legal Material Extractor & Cleaner
Version 1.0 | 2026

Extracts raw text from PDF/TXT legal materials for Nigerian Law School Bar Finals.
Strips out:
- Front matter (Preface, Dedication, Acknowledgments, Table of Contents, Title pages, Copyright)
- Back matter (Index, Appendices, Bibliography, Table of Cases/Statutes)
- Author credits, note-writer names, lecturer intros ("Compiled by...", "Notes by...", "LL.B 2023")
- Noise (Page numbers, running headers/footers, phone numbers, social handles)

Usage:
    python pipeline/extract.py --input path/to/material.pdf --course "Criminal Litigation" --output_dir pipeline/output
"""

import os
import re
import sys
import argparse
from typing import List, Dict

try:
    import pdfplumber
except ImportError:
    pdfplumber = None

try:
    from pypdf import PdfReader
except ImportError:
    PdfReader = None


# Patterns for noise, author credits, and front/back matter to strip
NOISE_PATTERNS = [
    # Author / Note-writer / Tutor credits
    r'(?i)^\s*(compiled|prepared|written|edited|typed|summarized|formatted)\s+by\b.*$',
    r'(?i)^\s*notes?\s+by\b.*$',
    r'(?i)^\s*lecture(s|\s+notes)?\s+by\b.*$',
    r'(?i)^\s*property\s+of\b.*$',
    r'(?i)^\s*(ll\.?b|b\.?l)\s+class\s+of\s+\d{4}.*$',
    r'(?i)^\s*contact\s*:?\s*(\+?234|0)\d{10}.*$',
    r'(?i)^\s*whatsapp\s*:?\s*(\+?234|0)\d{10}.*$',
    r'(?i)^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\s*$',  # Emails
    
    # Headers / Footers / Watermarks
    r'(?i)^\s*page\s+\d+\s*(of\s+\d+)?\s*$',
    r'(?i)^\s*\d+\s*\|\s*P\s*a\s*g\s*e\s*$',
    r'(?i)^\s*all\s+rights\s+reserved.*$',
    r'(?i)^\s*copyright\s*©?.*$',
    r'(?i)^\s*downloaded\s+from.*$',
    
    # Conversational lecturer intros
    r'(?i)^\s*in\s+today\'?s?\s+(class|lecture|session),?\s*(dr\.|prof\.|mr\.|mrs\.|justice).*$',
    r'(?i)^\s*welcome\s+to\s+this\s+chapter.*$'
]

FRONT_MATTER_KEYWORDS = [
    'table of contents', 'contents', 'preface', 'dedication', 'acknowledgment', 
    'acknowledgements', 'forward', 'foreword', 'about the author', 'disclaimer',
    'table of cases', 'table of statutes', 'table of statutory instruments',
    'abbreviations', 'citation guide'
]


def is_front_or_back_matter_heading(line: str) -> bool:
    """Checks if a line indicates front matter or back matter sections to skip."""
    cleaned = line.strip().lower()
    # Check if line matches exact front matter titles
    for kw in FRONT_MATTER_KEYWORDS:
        if cleaned == kw or cleaned.startswith(f"{kw}:") or cleaned.startswith(f"page {kw}"):
            return True
    return False


def clean_line(line: str) -> str:
    """Cleans an individual line of text and strips noise patterns."""
    trimmed = line.strip()
    if not trimmed:
        return ""
    
    # Strip matches against noise patterns
    for pattern in NOISE_PATTERNS:
        if re.match(pattern, trimmed):
            return ""
            
    return trimmed


def clean_text_content(text: str) -> str:
    """Processes full text content, removing noise and author/note-taker credits."""
    lines = text.split('\n')
    cleaned_lines = []
    in_front_matter_block = False
    
    for line in lines:
        cleaned = clean_line(line)
        if not cleaned:
            continue
            
        # Skip lines in a recognized front matter block
        if is_front_or_back_matter_heading(cleaned):
            in_front_matter_block = True
            continue
            
        # Detect if we hit a real chapter heading (e.g. CHAPTER 1, TOPIC 1, PRE-TRIAL ISSUES)
        if re.match(r'(?i)^\s*(chapter|topic|module|unit|part)\s+\d+', cleaned):
            in_front_matter_block = False
            
        if in_front_matter_block:
            continue
            
        cleaned_lines.append(cleaned)
        
    return '\n'.join(cleaned_lines)


def extract_from_pdf_pdfplumber(pdf_path: str) -> str:
    """Extracts text using pdfplumber for accurate layout and table extraction."""
    extracted = []
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages):
            text = page.extract_text(layout=False)
            if text:
                cleaned_page = clean_text_content(text)
                if cleaned_page.strip():
                    extracted.append(f"\n--- [PAGE {i+1}] ---\n" + cleaned_page)
    return '\n'.join(extracted)


def extract_from_pdf_pypdf(pdf_path: str) -> str:
    """Fallback PDF text extraction using pypdf."""
    extracted = []
    reader = PdfReader(pdf_path)
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        if text:
            cleaned_page = clean_text_content(text)
            if cleaned_page.strip():
                extracted.append(f"\n--- [PAGE {i+1}] ---\n" + cleaned_page)
    return '\n'.join(extracted)


def extract_legal_material(file_path: str, course_name: str, output_dir: str) -> str:
    """Main extraction coordinator for legal study materials."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
        
    print(f"📖 Processing: {file_path} for Course: {course_name}")
    
    ext = os.path.splitext(file_path)[1].lower()
    raw_text = ""
    
    if ext == '.pdf':
        if pdfplumber:
            print("   Using pdfplumber engine...")
            raw_text = extract_from_pdf_pdfplumber(file_path)
        elif PdfReader:
            print("   Using pypdf engine (fallback)...")
            raw_text = extract_from_pdf_pypdf(file_path)
        else:
            raise ImportError("Please install pdfplumber or pypdf to extract PDF files.")
    elif ext in ['.txt', '.md']:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            raw_text = clean_text_content(f.read())
    else:
        raise ValueError(f"Unsupported file format: {ext}")
        
    # Final pass cleaning
    final_text = clean_text_content(raw_text)
    
    # Save output
    os.makedirs(output_dir, exist_ok=True)
    base_name = os.path.splitext(os.path.basename(file_path))[0]
    out_file = os.path.join(output_dir, f"{base_name}_cleaned.txt")
    
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(f"COURSE: {course_name}\n")
        f.write("=========================================\n\n")
        f.write(final_text)
        
    print(f"✅ Extracted & Cleaned! Saved to: {out_file}")
    return out_file


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="LawFlash AI - Smart Legal Material Extractor")
    parser.add_argument("--input", required=True, help="Path to input PDF or TXT file")
    parser.add_argument("--course", required=True, help="Course name (e.g. Criminal Litigation)")
    parser.add_argument("--output_dir", default="pipeline/output", help="Directory to save clean text")
    
    args = parser.parse_args()
    extract_legal_material(args.input, args.course, args.output_dir)
