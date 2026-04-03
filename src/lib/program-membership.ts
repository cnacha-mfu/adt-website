/** Maps staff ID → program IDs they belong to (sourced from adt.mfu.ac.th/faculty) */
export const programMembership: Record<string, string[]> = {
  // ── Computer Engineering (B.Eng.) ──────────────────────────────────────────
  'surapol-vorapatratorn':           ['computer-engineering-beng'],
  'paweena-suebsombut':              ['computer-engineering-beng'],
  'shanmugam-nandagopalan':          ['computer-engineering-beng'],
  'khwunta-kirimasthong':            ['computer-engineering-beng'],
  'pattaramon-vuttipittayamongkol':  ['computer-engineering-beng'],
  'narong-chaiwut':                  ['computer-engineering-beng'],
  'chayapol-kamyod':                 ['computer-engineering-beng'],
  'mahamah-sebakor':                 ['computer-engineering-beng'],

  // ── Digital & Communication Engineering (B.Eng.) ──────────────────────────
  'suppakarn-chansareewittaya':      ['digital-engineering'],
  'kemachart-kemavuthanon':          ['digital-engineering'],
  'sirikan-chucherd':                ['digital-engineering'],
  'titiya-chomngern':                ['digital-engineering'],
  'teeravisit-laohapensaeng':        ['digital-engineering'],

  // ── Software Engineering (B.Eng.) ─────────────────────────────────────────
  'nacha-chondamrongkul':            ['software-engineering'],
  'prasara-jakkaew':                 ['software-engineering'],
  'wacharawan-intayoad':             ['software-engineering'],
  'nang-hsu-mon-pyae':               ['software-engineering'],
  'sujitra-arwatchananukul':         ['software-engineering'],
  'vittayasak-rujivorakul':          ['software-engineering'],
  'tew-hongthong':                   ['software-engineering'],

  // ── Digital Technology for Business Innovation (B.Sc.) ────────────────────
  'nikorn-rongbutsri':               ['digital-business'],
  'soontarin-nupap':                 ['digital-business'],
  'patcharaporn-panwong':            ['digital-business'],
  'teanjit-sutthaluang':             ['digital-business'],
  'nilubon-kurubanjerdjit':          ['digital-business'],
  'waralak-chongdarakul':            ['digital-business'],
  'charoenchai-wongwatkit':          ['digital-business'],

  // ── Multimedia Technology & Animation (B.Sc.) ─────────────────────────────
  'nontawat-thongsibsong':           ['multimedia'],
  'yootthapong-tongpaeng':           ['multimedia'],
  'karn-soponronnarit':              ['multimedia'],
  'pruet-putjorn':                   ['multimedia'],
  'thanpahtt-chaichombhoo':          ['multimedia'],
  'banphot-nobaew':                  ['multimedia'],
  'ratchanon-nobnop':                ['multimedia'],

  // ── Digital Transformation Technology (M.Sc.) ─────────────────────────────
  'surapong-uttama':                 ['digital-transformation-msc'],
  'worasak-rueangsirarak':           ['digital-transformation-msc'],
  'santichai-wicha':                 ['digital-transformation-msc'],

  // ── Computer Engineering (M.Eng. / Ph.D.) ─────────────────────────────────
  'thongchai-yooyatiwong':           ['computer-engineering-meng', 'computer-engineering-phd'],
  'roungsan-chaisricharoen':         ['computer-engineering-meng', 'computer-engineering-phd'],
  'punnarumol-temdee':               ['computer-engineering-meng', 'computer-engineering-phd'],
  'nattapol-aunsri':                 ['computer-engineering-meng', 'computer-engineering-phd'],
};

export interface ProgramMeta {
  id: string;
  label: string;
  labelTH: string;
  color: string;
  short: string;
}

export const programList: ProgramMeta[] = [
  { id: 'computer-engineering-beng',  label: 'Computer Eng.',      labelTH: 'วิศวกรรมคอมพิวเตอร์',            color: '#EF4444', short: 'CE'  },
  { id: 'digital-engineering',        label: 'Digital Eng.',       labelTH: 'วิศวกรรมดิจิทัล',               color: '#9B111E', short: 'DCE' },
  { id: 'software-engineering',       label: 'Software Eng.',      labelTH: 'วิศวกรรมซอฟต์แวร์',             color: '#22C55E', short: 'SE'  },
  { id: 'digital-business',          label: 'Digital Business',    labelTH: 'เทคโนโลยีดิจิทัลธุรกิจ',        color: '#8B5CF6', short: 'DTB' },
  { id: 'multimedia',                 label: 'Multimedia',         labelTH: 'มัลติมีเดีย',                    color: '#F97316', short: 'MTA' },
  { id: 'digital-transformation-msc', label: 'Digital Transform.', labelTH: 'การแปลงเป็นดิจิทัล',            color: '#0CC8D4', short: 'DTT' },
  { id: 'computer-engineering-meng',  label: 'CE (Grad)',          labelTH: 'วิศวกรรมคอมพิวเตอร์ (บัณฑิต)', color: '#F59E0B', short: 'CEG' },
];
