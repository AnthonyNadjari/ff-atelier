import sharp from 'sharp';
const out = 'C:/Users/nadja/AppData/Local/Temp/claude/C--Users-nadja/0ce9463d-4571-4c92-8fc1-02fbfc4412eb/scratchpad/crops/';
const cuts = [
  [0, 1000, 'a'],
  [900, 2200, 'b'],
  [2200, 3600, 'c'],
  [2900, 3400, 'seam1'],
  [4900, 5600, 'seam2'],
];
for (const [top, bottom, name] of cuts) {
  await sharp('captures/anna-vidal-desktop.png').extract({ left: 0, top, width: 1400, height: bottom - top }).toFile(out + 'desk-' + name + '.png');
}
console.log('done');
