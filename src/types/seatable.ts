export interface Course extends BaseRow {
  '0000': string;  // Kurs-ID
  'LVxv': string;  // Name
  '6lhR': string;  // Kurzbeschreibung
  'Ev4v': string[];  // Kursbild
  'Rfrz': string;  // Level ID
  Kapitel: Chapter[];
}

export interface Chapter extends BaseRow {
  '0000': string;  // KapitelID
  'zrXG': string;  // Name
  '0Gbu': number;  // Nummer
  Lektionen: Lesson[];
}

export interface Lesson extends BaseRow {
  '0000': string;  // LektionID
  '920y': string;  // Name
  'yt6Q': number;  // Nummer
  'pg3S': { text: string };  // Kurzbeschreibung
  'y1X4': { text: string };  // Inhalt
  'azCf': number;  // DauerInMin
  'm9wb': string[];  // Bild
  '2lEO': string;  // Level ID
  'UijR': string;  // Kosten ID
}

interface Link {
  _id: string;
  table1_id: string;
  table2_id: string;
  table1_table2_map: { [key: string]: string[] };
  table2_table1_map: { [key: string]: string[] };
}

export interface SeatableResponse {
  links: Link[];
  tables: {
    _id: string;
    name: string;
    rows: (Course | Chapter | Lesson)[];
  }[];
}