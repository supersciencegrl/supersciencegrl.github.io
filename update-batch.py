import glob

def checksublist(mylist, snippet):
    ''' Checks where the html snippet exists in the readlines '''
    
    listlength = len(mylist)
    snippetlength = len(snippet)
    idxlist = [i for i in range(listlength-snippetlength+1) if snippet == mylist[i:i+snippetlength]]

    return idxlist

def inputToHtml(myinput):
    ''' Formats the inputs into an html list with newlines at the end of each line '''
    
    mylist = myinput.split('\\n')
    editedlist = [i+'\n' for i in mylist]

    return editedlist

def run(pages, oldhtml, newhtml):
    ''' Converts the old to the new html in all webpages and provides a printed report '''
    ''' Note: BeautifulSoup etc does not maintain indentation '''
    
    pageschanged = 0
    pagesnotchanged = []
    for page in pages:
        with open(page, 'r+', encoding='utf8') as fin:
            html = fin.readlines()

            idxlist = checksublist(html, oldhtml)
            for idx in idxlist[::-1]:
                html[idx:idx+oldlength] = newhtml
            if idxlist:
                print(f'{page}:\t{len(idxlist)} instances of old html replaced.')
                pageschanged += 1
            else:
                pagesnotchanged.append(page)

            fin.seek(0)
            fin.writelines(html)
            fin.truncate() # Allows files to be shortened without leaving lines at the bottom

    print(f'\n{pageschanged} pages changed.')
    pagesnotchanged_string = ('\n').join(pagesnotchanged)
    print(f'Pages not changed ({len(pagesnotchanged)}):\n', pagesnotchanged_string)

pages = glob.glob('**/*.html', recursive=True)
exclusions = ['googlec9a765a08c18ee51.html', 'pinterest-fc74e.html']
for exc in exclusions:
    idx = pages.index(exc)
    _ = pages.pop(idx)

print('WARNING: Recommend git push before editing for easy reversion to original.\n')
oldhtml = ''
while not oldhtml:
    oldhtml = input('Old html (copy tabs as tabs without changing; replace newlines with \'\\n\'): ')
oldhtml = inputToHtml(oldhtml)

newhtml = ''
while not newhtml:
    newhtml = input('New html (copy tabs as tabs without changing; replace newlines with \'\\n\'): ')
newhtml = inputToHtml(newhtml)

# Example html
#oldhtml = ['\t<meta property="og:image" content="http://www.supersciencegrl.co.uk/SuperScienceGrl.png">\n',
#           '\t<meta property="og:image:alt" content="Nessa Carson website: a chemistry repository">\n',
#           '\t<meta property="og:image:width" content="892px">\n',
#           '\t<meta property="og:image:height" content="593px">\n']
#newhtml = ['\t<meta property="og:image" content="http://www.supersciencegrl.co.uk/SuperScienceGrl2.png">\n',
#           '\t<meta property="og:image:alt" content="Nessa Carson website: a chemistry repository">\n',
#           '\t<meta property="og:image:width" content="1080px">\n',
#           '\t<meta property="og:image:height" content="749px">\n']

oldlength = len(oldhtml)
newlength = len(newhtml)

run(pages, oldhtml, newhtml)
