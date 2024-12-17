// GIMP palette format for PICO8 secret palette
//  https://lospec.com/palette-list/pico-8-secret-palette
let gpl = ` 0	0	0	000000
29	43	83	1d2b53
126	37	83	7e2553
0	135	81	008751
171	82	54	ab5236
95	87	79	5f574f
194	195	199	c2c3c7
255	241	232	fff1e8
255	0	77	ff004d
255	163	0	ffa300
255	236	39	ffec27
0	228	54	00e436
41	173	255	29adff
131	118	156	83769c
255	119	168	ff77a8
255	204	170	ffccaa
41	24	20	291814
17	29	53	111d35
66	33	54	422136
18	83	89	125359
116	47	41	742f29
73	51	59	49333b
162	136	121	a28879
243	239	125	f3ef7d
190	18	80	be1250
255	108	36	ff6c24
168	231	46	a8e72e
0	181	67	00b543
6	90	181	065ab5
117	70	101	754665
255	110	89	ff6e59
255	157	129	ff9d81`;

let cols = [
  'black',
  'navy',
  'plum',
  'forest',
  'poop',
  'gunmetal',
  'gray',
  'white',
  'red',
  'orange',
  'yellow',
  'grass',
  'sky',
  'smoke',
  'pink',
  'flesh',
];

const palette = { };

gpl.split('\n').forEach((row, i) => {
  let parts = row.split('\t');
  let [ r, g, b, hex ] = parts;
  let name = cols[i];
  if (i > 15) {
    name = cols[i - 16] + '2';
  }
  palette[name] = {
    r: parseInt(r, 10) / 255,
    g: parseInt(g, 10) / 255,
    b: parseInt(b, 10) / 255,
    hex: '#'+hex,
  };
  let p = palette[name];
  palette[name].col = new Color(p.r,p.g,p.b,1);
  palette[name].mk = (o = 1) => {
    return new Color(p.r,p.g,p.b,o);
  }
})


export default palette;
