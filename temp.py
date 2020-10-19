import os

mydir = os.getcwd()

html_main = []
with open(os.path.join(mydir, 'online.html'), 'r') as fin:
    for line in fin:
        html_main.append(line)

os.chdir('..')

html_sec = []
with open('online.html', 'r') as fin:
    for line in fin:
        html_sec.append(line)

rows_main = []
for n, line in enumerate(html_main):
    if line.strip().startswith('<td class="columnb3'):
        rows_main.append(html_main[n+1])

rows_sec = []
for n, line in enumerate(html_sec):
    if line.strip().startswith('<td class="columnb3'):
        rows_sec.append(html_sec[n+1])

for event in rows_sec:
    if event not in rows_main:
        print(event)
