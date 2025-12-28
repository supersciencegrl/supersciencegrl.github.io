__author__ = "Nessa Carson"
__copyright__ = "Copyright 2022, 2025"
__version__ = "1.2"
__email__ = "methionine57@gmail.com"
__status__ = "Production"

from pathlib import Path

def edit_within_lines(oldtext: str, newtext: str):
    """
    Replaces all instances of `oldtext` with `newtext` in all HTML files in the current directory and subdirectories.

    Args:
    - oldtext (str): The old text to replace.
    - newtext (str): The new text to replace with.
    """
    for file in Path("..").rglob("*.html"):
        text = file.read_text(encoding="utf-8")
        text = text.replace(oldtext, newtext)
        file.write_text(text, encoding="utf-8")

def find_index_in_sublist(snippet: list[str], my_list: list[str]) -> list[int]:
    """
    Returns a list of indices where the `snippet` is found in `my_list`.

    Args:
    - snippet (list[str]): The substring to search for.
    - mylist (list[str]): The list to search in.

    Returns:
    - indices (list[int]): The list of indices where the `snippet` is found in `my_list`.
    """
    snippet_length = len(snippet)
    list_length = len(my_list)
    indices = [i for i in range(list_length-snippet_length+1) if snippet == my_list[i:i+snippet_length]]

    return indices

def format_as_html(my_input: str) -> list[str]:
    """
    Formats the input into an list of HTML lines, with newlines at the end of each line.

    Args:
    - my_input (str): The input string.

    Returns:
    - edited_list (list[str]): The formatted HTML list.
    """
    mylist = my_input.replace('\r', '').split('\\n')
    if len(mylist) == 1:
        mylist = mylist[0].split('\n')
    edited_list = [f'{i}\n' for i in mylist]

    return edited_list

def obtain_html_from_user() -> tuple[list[str], list[str]]:
    """
    This function prompts the user to input old and new HTML data. It then converts the input to HTML format.
    
    Returns:
    tuple[list[str], list[str]]: A tuple containing: 
        str: The old HTML data entered by the user.
        str: The new HTML data entered by the user.
    """
    print('WARNING: Recommend git push before editing for easy reversion to original.\n')
    
    oldhtml = ''
    while not oldhtml:
        oldhtml = input('Old html (copy tabs as tabs without changing; replace newlines with \'\\n\'): ')
    oldhtml = format_as_html(oldhtml)
    if oldhtml[-1] == '\n':
        oldhtml.pop()

    newhtml = ''
    while not newhtml:
        newhtml = input('New html (copy tabs as tabs without changing; replace newlines with \'\\n\'): ')
    newhtml = format_as_html(newhtml)
    if newhtml[-1] == '\n':
        newhtml.pop()

    return oldhtml, newhtml

def replace_html(pages: list[Path], oldhtml: list[str], newhtml: list[str]):
    """
    Replaces all instances of `oldhtml` with `newhtml` in the `pages` list of files.
    Prints a report of the changes made and the files that were not changed.

    Args:
    - pages (list[str]): A list of file paths to update.
    - oldhtml (list[str]): The old HTML code to replace.
    - newhtml (list[str]): The new HTML code to replace with.

    Note: BeautifulSoup is not used here, as it does not maintain indentation by default
    """
    pages_changed = 0
    pages_not_changed = []
    for page in pages:
        with open(page, 'r+', encoding='utf8') as fin:
            html = fin.readlines()

            idx_list = find_index_in_sublist(oldhtml, html)
            old_length = len(oldhtml)
            for idx in idx_list[::-1]:
                html[idx:idx+old_length] = newhtml
            if idx_list:
                print(f'{page}:\t{len(idx_list)} instances of old html replaced.')
                pages_changed += 1
            else:
                pages_not_changed.append(page)

            fin.seek(0)
            fin.writelines(html)
            fin.truncate() # Allows shorter file when overwriting

    print(f'\n{pages_changed} pages changed.')
    pages_not_changed_string = ('\n').join([str(p) for p in pages_not_changed])
    print(f'Pages not changed ({len(pages_not_changed)}):\n', pages_not_changed_string)

def run():
    # Obtain user inputs and replace all oldhtml with newhtml
    oldhtml, newhtml = obtain_html_from_user()
    result = input('\nProceed? (Y/N) ')
    if result.lower() in 'yestrue1':
        replace_html(pages, oldhtml, newhtml)
    else:
        print('Operation aborted.')

# Set list of desired pages to change
pages = list(Path('../').rglob('*.html'))
exclusions = ['..\\googlec9a765a08c18ee51.html', '..\\pinterest-fc74e.html']
for exc in exclusions:
    idx = pages.index(Path(exc))
    _ = pages.pop(idx)

run()