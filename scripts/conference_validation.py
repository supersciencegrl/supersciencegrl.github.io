from datetime import date, datetime
from pathlib import Path
import re
from typing import TypedDict

from bs4 import BeautifulSoup, Tag
from lxml import etree

class ValidationError(Exception):
    """ Raised when the Conference Database cannot be validated. """
    pass

class RowRecord(TypedDict, total = False): # Type for records
    tr: Tag
    title: str
    start_date: date
    end_date: date | None
    index: int

def parse_date(text: str) -> date | None:
    """
    Parse a date string in 'DD MMM YYYY' format or an em dash.

    This function trims whitespace from the input, accepts an em dash (—) as a
    null end date, and validates real dates using the provided format string.
    On invalid formats or impossible dates (e.g., 31 Feb 2026), it raises a
    ValidationError.

    Args:
        text: The date text to parse. Expected format is 'DD MMM YYYY' (e.g.,
            '25 Mar 2005') or an em dash represented as '—'.

    Returns:
        date: If the input is a valid date string, or 
        None: if the input is an em dash.

    Raises:
        ValidationError: If the input is not in the expected format or does not
            represent a real calendar date.
    """
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
    """
    Validate that a table row (<tr>) has only permitted CSS classes.

    The function checks that the element's class list exists and that every
    class applied to the <tr> is included in the allowed set _classes. If any
    class is not permitted, a ValidationError is raised. It is assumed that
    'body' is included in _classes; if 'body' must be present explicitly,
    add a separate check.

    Args:
        tr: A BeautifulSoup Tag representing the <tr> element to validate.

    Raises:
        ValidationError: If the <tr> contains any class not present in the
            allowed set _classes.
    """
    these_classes = tr.get("class") or []
    invalid_classes = set(these_classes) - _classes
    if invalid_classes:
        raise ValidationError(f"Unknown classes on <tr>: {sorted(invalid_classes)}")

def validate_html_source(html: str) -> None: 
    """
    Validate raw HTML source for structural correctness and report errors.

    This function parses the provided HTML string using lxml's HTMLParser with
    recovery disabled, so malformed markup (e.g., unclosed tags, invalid nesting)
    triggers parser errors. It filters out entity reference errors related
    to missing semicolons (e.g., unescaped '&' in attribute values), because it's basically 
    a pain with regards to perfectly valid url parameters, and raises a ValidationError 
    only if other issues remain.

    Args:
        html: The raw HTML content as a string.

    Raises:
        ValidationError: If lxml reports any structural errors other than the
            suppressed 'ERR_ENTITYREF_SEMICOL_MISSING' cases. The exception
            message aggregates one error per line from the parser's error log.
    """
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

def validate_tag_structure(tr: Tag) -> None:
    """
    Validate the structural integrity of a <tr> element representing a row.

    This function enforces expected table structure for conference rows:
    - The <tr> must contain only <td> elements as direct children (whitespace allowed).
    - The first cell (td.column1) must include an <a class="table-link" href="..."> with
      non-empty link text.
    - Required columns (td.column2, td.column3, td.column4) must be present.

    Args:
        tr: A BeautifulSoup Tag corresponding to the <tr> element under validation.

    Raises:
        ValidationError: If the row violates any structural rule, including:
            - No <td> children under <tr>.
            - Presence of non-<td> direct child elements.
            - Missing td.column1 or missing/empty anchor link within it.
            - Missing any of td.column2, td.column3, or td.column4.
    """
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
    """
    Extract and validate a conference row (<tr>) into a structured record.

    This function validates class membership and structural requirements for the
    provided <tr> element, then parses start and end dates from the appropriate
    cells. It returns a dictionary with the original tag, title text, and parsed
    dates suitable for downstream ordering checks.

    Args:
        tr: A BeautifulSoup Tag representing the <tr class="body"> table row to
            extract and validate.

    Returns:
        dict[str, str | None], containing key-value:
            - "tr": The original BeautifulSoup Tag for the row.
            - "title": The conference title text from td.column1.
            - "start_date": The parsed start date (datetime.date).
            - "end_date": The parsed end date (datetime.date or None if em dash).

    Raises:
        ValidationError: If classes are invalid, structure is incorrect, the start
            date is missing or an em dash, or any date fails format/value validation.
    """
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

def sort_key(record: dict[str, date | None]) -> tuple[date, int, date | None]:
    """
    Build a tuple key for ordering conference records by start and end dates.

    The sort key orders rows primarily by start_date, and secondarily by end_date
    with None (em dash) treated as earlier than any real end date. This ensures
    rows with unspecified end dates come before rows with specified dates when
    start dates are equal.

    Args:
        record (dict[str, date | None]): A record dict produced by extract_row, 
            containing "start_date" (date) and "end_date" (date or None).

    Returns:
        A tuple containing: 
        - date: The start date
        - int: 0 when the end date is None; 1 otherwise
        - date: The end date or a dummy date value for when end date is None. 
    """
    # When sorted, None end_date should come before others with the same start_date
    null_flag = 0 if record["end_date"] is None else 1
    return (record["start_date"], null_flag, record["end_date"] or datetime.max.date())

def validate_document(html: str) -> list[RowRecord]:
    """
    Validate the entire HTML document for conference rows and ordering consistency.

    This function validates raw HTML structure, extracts all <tr class="body"> rows,
    performs per-row validations (classes, structure, date formats), and verifies
    that rows are ordered by start_date, then by end_date with None (em-dash) treated
    as earlier than any real end date. It aggregates row-level errors and reports
    ordering violations with contextual details.

    Args:
        html: The full HTML document as a string.

    Returns:
        list[RowRecord]]: Validated row records (dicts) containing the parsed data and
            references to their original Tag elements.

    Raises:
        ValidationError: If no <tr class="body"> rows are found, if any row fails
            validation (classes, structure, date parsing), or if the document-wide
            ordering does not match the expected sort order.
    """
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
            indented_html = ('\n').join(f'\t{line} ' for line in str(tr).splitlines())
            errors.append(f"Record {i}: {error}\n{indented_html}")

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
    if Path('conferences.html').exists():
        conf_file = Path('conferences.html') # Run through GitHub Actions
    else:
        conf_file = Path('../conferences.html') # Run locally
    
    with open(conf_file, 'r') as fin:
        html = fin.read()

    try:
        records = validate_document(html)
        print(f"Validation passed for {len(records)} rows.")
    except ValidationError as error:
        print("Validation failed:")
        print(error)
        raise