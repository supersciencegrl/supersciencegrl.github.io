from datetime import date, datetime
import re

from bs4 import BeautifulSoup, Tag
from lxml import etree

class ValidationError(Exception):
    """ Raised when the Conference Database cannot be validated. """
    pass

def parse_date(text: str) -> date | None:
    """Return datetime.date for valid 'DD MMM YYYY' or None for em dash; raise on invalid."""
    s = text.strip()
    if s == EM_DASH:
        return None
    
    if not DATE_RE.match(s):
        raise ValidationError(f"Invalid date format: '{s}' "
                              "(expected DD MMM YYYY or \"&mdash;\")"
                              )
    try:
        date = datetime.strptime(s, DATE_FORMAT).date()
    except ValueError as error:
        raise ValidationError(f"Not a real date: '{s}' ({error})")
    
    return date

def validate_classes(tr: Tag) -> None:
    """Ensure class includes 'body' and all other classes are from _classes."""
    these_classes = tr.get("class") or []
    invalid_classes = set(these_classes) - _classes
    if invalid_classes:
        raise ValidationError(f"Unknown classes on <tr>: {sorted(invalid_classes)}")

def validate_html_source(html: str): 
    """ Checks for HTML validation eg: tags properly closed"""
    parser = etree.HTMLParser(recover=False)
    try: 
        etree.fromstring(html.encode("utf-8"), parser=parser)
    except etree.XMLSyntaxError: 
        # e.error_log contains detailed messages (line/column) return False, [str(err) for err in e.error_log] 
        # If no exception, still check error_log in case of soft warnings 
        errors = [str(err) for err in parser.error_log 
                  if 'ERR_ENTITYREF_SEMICOL_MISSING' not in str(err)
                  ]
        if errors:
            raise ValidationError(('\n').join(errors))

def validate_tag_structure(tr: Tag):
    """Basic structural checks: tr contains only td children; td and a properly closed."""
    # BeautifulSoup ensures tags are closed in the parsed tree. We still check expected structure
    tds = tr.find_all("td", recursive=False)
    if not len(tds):
        raise ValidationError("<tr class='body'> must contain <td> cells.")
    # Ensure only td direct children (allow whitespace)
    for child in tr.children:
        if isinstance(child, Tag) and child.name != "td":
            raise ValidationError(f"<tr> contains non-td child: <{child.name}>")

    # Check each td has proper closure in parsed tree (presence suffices) and anchor in column1
    # Column1: td.column1 > a.table-link
    col1 = tr.find("td", class_="column1")
    if not col1:
        raise ValidationError("Missing <td class='column1'>.")
    link = col1.find("a", class_="table-link")
    if not link or not link.get("href"):
        raise ValidationError("column1 must contain <a class='table-link' href='...'>.")
    # Ensure link is properly closed by verifying it has either text or nested elements
    if not (link.text and link.text.strip()):
        raise ValidationError("Anchor in column1 must have non-empty text.")

    # Ensure other expected columns exist
    for cname in ("column2", "column3", "column4"):
        if not tr.find("td", class_=cname):
            raise ValidationError(f"Missing <td class='{cname}'>.")

def extract_row(tr: Tag) -> dict[str, str | None]:
    """Return a dict with parsed fields and raise ValidationError on any row-level issue."""
    validate_classes(tr)
    validate_tag_structure(tr)

    # Extract text content
    col2 = tr.find("td", class_="column2")
    col3 = tr.find("td", class_="column3")

    # Dates can be wrapped in span.no-wrap; get text regardless
    start_text = col2.get_text(strip=False)
    end_text = col3.get_text(strip=False)

    start_date = parse_date(start_text)
    if start_date is None:
        raise ValidationError("Start date (column2) cannot be \"&mdash;\".")
    end_date = parse_date(end_text) # None is allowed

    # Return record; use tuple for ordering key
    return {
        "tr": tr,
        "title": tr.find("td", class_="column1").get_text(strip=True),
        "start_date": start_date,
        "end_date": end_date,
    }

def validate_document(html: str):
    """
    Validate all <tr class='body'> rows and document-wide ordering:
    - tag structure
    - classes whitelist
    - date formats
    - ordering by start_date, then end_date (None before real dates)
    Returns list of row dicts if valid. Raises ValidationError with details otherwise.
    """
    # Check global ordering
    def sort_key(rec):
        # None end_date should come first; represent None by (0, None), real date by (1, date)
        null_flag = 0 if rec["end_date"] is None else 1
        return (rec["start_date"], null_flag, rec["end_date"] or datetime.max.date())
    
    validate_html_source(html) # Validates raw HTML eg: for unclosed tags

    soup = BeautifulSoup(html, "html.parser")
    rows = soup.find_all("tr", class_="body")
    if not rows:
        raise ValidationError("No <tr class='body'> rows found.")

    records = []
    errors = []
    for i, tr in enumerate(rows, start = 1):
        try:
            rec = extract_row(tr)
            rec["index"] = i
            records.append(rec)
        except ValidationError as error:
            errors.append(f"Row {i}: {error}")

    if errors:
        # Collate all row-level errors
        raise ValidationError("Row validation failed:\n" + "\n".join(errors))

    sorted_records = sorted(records, key=sort_key)
    # Compare original sequence to expected sorted sequence
    if [r["tr"] for r in records] != [r["tr"] for r in sorted_records]:
        # Find first out-of-order index for a helpful message
        for i, (a, b) in enumerate(zip(records, sorted_records), start = 1):
            if a["tr"] is not b["tr"]:
                raise ValidationError(
                    f"Ordering violation at row {i}: "
                    f"expected '{b['title']}' (start {b['start_date']}, "
                    f"end {'—' if b['end_date'] is None else b['end_date']}) "
                    f"before '{a['title']}'."
                )

    return records

DATE_FORMAT = "%d %b %Y"
EM_DASH = "—" # rendered em-dash after BeautifulSoup decoding of "&mdash;"

DATE_RE = re.compile(r"^\d{2}\s+[A-Z][a-z]{2}\s+\d{4}$") # eg: 02 Jan 2026

topics = {"all", 
          "anal", "automation", "business", "careers", "catalysis", "chembio", "comp", 
          "diversity", "edu", "env", "form", "history", "inorg", "mat", "medchem", "pharm", 
          "phys", "process", "policy", "safety", "synthesis"
          }
locations = {"Global", "Online",
             "WEur", "EEur", "NEur",
             "UK", "Scotland", "Wales", "NI", "NEng", "SEng", "Midlands", "London",
             "NA", "WUSA", "CUSA", "SUSA", "EUSA",
             "SA", "Africa", "Asia", "Aus"
             }
_classes = {'body'}.union({f"c{t}" for t in topics}, 
                          {f"l{l}" for l in locations}
                          ) # Set of all allowable classes for <tr>

TEST_HTML = """<table>
    <tr class="body cchembio cpharm cform cprocess cmedchem lEUSA">
        <td class="column1"><a class="table-link" href="https://rna-drugdiscovery.com/" target="_blank" rel="noopener">
            RNA-Targeted Drug Discovery &amp; Development Symposium</a></td>
        <td class="column2"><span class="no-wrap">02 Jan 2026</span></td>
        <td class="column3"><span class="no-wrap">04 Jan 2026</span></td>
        <td class="column4">Boston, MA, USA</td>
        <td class="column5"></td>
        <td class="column6"></td>
    </tr>
    </table>"""

# Example usage:
if __name__ == "__main__":
    # Load HTML from file or request; here we assume a string variable `html`
    # with the whole document.
    # html = open("conferences.html", "r", encoding="utf-8").read()
    with open("../conferences.html", 'r') as fin:
        html = fin.read()

    try:
        recs = validate_document(html)
        print(f"Validation passed for {len(recs)} rows.")
    except ValidationError as error:
        print("Validation failed:")
        print(error)