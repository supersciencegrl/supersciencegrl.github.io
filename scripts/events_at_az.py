from pathlib import Path

from bs4 import BeautifulSoup
import pandas as pd
import pyperclip

import conference_validation

def find_events_with_az_class(html: str) -> pd.DataFrame:
    """
    Find all events in the given HTML that have the class 'az'.
    
    Args:
        html (str): The HTML content to search through.
        
    Returns:
        list: A list of events with the class 'az'.
    """   
    soup = BeautifulSoup(html, 'html.parser')
    rows = soup.find_all('tr', class_='az')

    events_at_az = []
    for i, tr in enumerate(rows):
        try:
            rec = conference_validation.extract_row(tr, all_cols = True)
            rec['index'] = i
            events_at_az.append(rec)
        except conference_validation.ValidationError as error:
            indented_html = ('\n').join(f'\t{line} ' for line in str(tr).splitlines())
            print(f"Error processing Record {i}: {error}\n{indented_html}")

    df = pd.DataFrame(events_at_az).drop(columns=['tr'], errors='ignore')

    return df

def results_by_location(df: pd.DataFrame, 
                        location: str, 
                        copy_result: bool = True
                        ) -> str:
    filtered_df = df[df['location'].str.contains(location, na=False)]
    if filtered_df.empty:
        return ''

    results = []
    for row in filtered_df.itertuples(index=False):
        title = row.title
        link = row.link
        
        start_date = row.start_date.strftime('%d %b %Y')
        end_date = row.end_date.strftime('%d %b %Y') if row.end_date else None
        dates = f'{start_date}–{end_date}' if end_date else start_date
        online = ' (hybrid)' if 'online' in row.location.lower() else ''

        # Create listing for each event
        result = f'{title}\n{dates}{online}\n{link}'
        results.append(result)

    final_result = f'### {location} ###\n' + ('\n\n').join(results)
    if copy_result:
        pyperclip.copy(final_result)

    return final_result

def all_az_locations(df: pd.DataFrame, copy_result: bool = True) -> list[str]:
    all_results = []
    for location in az_locations:
        result = results_by_location(df, location, copy_result=False)
        all_results.append(result)
    
    if copy_result:
        pyperclip.copy(f'{header}\n\n' + 
                       '\n\n\n'.join((r for r in all_results if r))
                       )
    return all_results

az_locations = ['Boston', 'Cambridge', 'Gothenburg', 'Macclesfield']
header = "These Pharm Sci-relevant events are coming up at our home sites. Please don't rely on these updates or expect them to be complete; it's up to you to keep up with conferences of interest. I'd welcome corrections or additions if you see them. "

# Example usage:
if __name__ == "__main__":
    if Path('conferences.html').exists():
        conf_file = Path('conferences.html') # Run through GitHub Actions
    else:
        conf_file = Path('../conferences.html') # Run locally
    
    with open(conf_file, 'r') as fin:
        html = fin.read()

    # Validate the html structure
    # conference_validation.validate_html_source(html)

    results = all_az_locations(df, copy_result = True)
    (print(r) for r in results)