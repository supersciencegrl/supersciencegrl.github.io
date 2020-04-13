import glob
import time

allics = glob.glob('**.ics')

def replace():
    starttime = time.time()
    
    for f in allics:
        fintext = []
        with open(f, 'r') as fin:
            for line in fin:
                fintext.append(line)

        for n, line in enumerate(fintext):
            fintext[n] = line.replace('&amp;', '&').replace('&ndash;', '–')

        with open(f, 'w') as fout:
            fout.writelines(fintext)

    endtime = time.time()
    return endtime-starttime
