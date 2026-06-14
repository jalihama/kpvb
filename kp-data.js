/* ============================================================
   KP-ATLAS · CONTENT  —  this is the file you edit.
   ------------------------------------------------------------
   ADD A RESOURCE → copy one line in ITEMS, edit the fields, save.
   Then: Commit → Push in GitHub Desktop. Refresh the page.
     type:  "pdf" | "html" | "video" | "audio" | "image" | "link"
     file:  a path inside the repo ("files/…") OR a full https:// link
     size:  optional short label shown on the row, e.g. "1 S."
     system / topic: must match a name in CATEGORIES below
                     (an unknown topic shows under its system in "Sonstiges")
   ============================================================ */

/* Optional. Set to e.g. "2026-09-15" to show a live countdown.
   Leave blank ("") or set a past date to hide it gracefully.        */
const EXAM_DATE = "";

const ITEMS = [
  // — Kardiologie & Angiologie —
  { title:"EKG-Kurs für die Kenntnisprüfung", system:"Kardiologie & Angiologie", topic:"EKG", type:"html", file:"files/ekg-kurs.html", size:"Kurs" },
  { title:"Vorhofflimmern — Klinische Referenz & Therapie", system:"Kardiologie & Angiologie", topic:"Vorhofflimmern", type:"html", file:"files/vorhofflimmern.html", size:"1 S." },
  { title:"VHF — Pathophysiologie", system:"Kardiologie & Angiologie", topic:"Vorhofflimmern", type:"html", file:"files/vhf-patho.html", size:"1 S." },
  { title:"TVT — Diagnostikalgorithmus", system:"Kardiologie & Angiologie", topic:"Phlebothrombose", type:"html", file:"files/tvt-diagnostik.html", size:"1 S." },
  { title:"TVT — Therapiealgorithmus", system:"Kardiologie & Angiologie", topic:"Phlebothrombose", type:"html", file:"files/tvt-therapie.html", size:"1 S." },
  { title:"Kardiale Pharmakologie — KP-Referenz", system:"Kardiologie & Angiologie", topic:"Kardiale Pharmakologie", type:"html", file:"files/kardio-pharma.html", size:"interaktiv" },
  { title:"Kardiale Pharmakologie — Inotropie/Chronotropie", system:"Kardiologie & Angiologie", topic:"Kardiale Pharmakologie", type:"html", file:"files/cardiac-pharma-table.html", size:"Tabelle" },
  { title:"SVT — AVNRT vs AVRT", system:"Kardiologie & Angiologie", topic:"Supraventrikuläre Tachykardien", type:"html", file:"files/svt-avrt-avnrt.html", size:"interaktiv" },
  { title:"Antikoagulation bei Kardioversion", system:"Kardiologie & Angiologie", topic:"Orale Antikoagulanzien", type:"html", file:"files/antikoagulation-kardioversion.html", size:"1 S." },

  // — Pneumologie —
  { title:"Asthma bronchiale — Klassifikation", system:"Pneumologie", topic:"Asthma bronchiale", type:"image", file:"files/asthma-klassifikation.svg", size:"1 S." },
  { title:"Lungenembolie — Therapie", system:"Pneumologie", topic:"Lungenembolie", type:"image", file:"files/lungenembolie-therapie.svg", size:"1 S." },

  // — Gastroenterologie —
  { title:"Akute Pankreatitis — Diagnose & Klinik", system:"Gastroenterologie", topic:"Akute Pankreatitis", type:"html", file:"files/pankreatitis-1-diagnose.html", size:"1 S." },
  { title:"Akute Pankreatitis — Therapiealgorithmus", system:"Gastroenterologie", topic:"Akute Pankreatitis", type:"html", file:"files/pankreatitis-2-therapie.html", size:"1 S." },
  { title:"Akute Pankreatitis — Komplikationen & Prognose", system:"Gastroenterologie", topic:"Akute Pankreatitis", type:"html", file:"files/pankreatitis-3-komplikationen.html", size:"1 S." },
  { title:"Aszites — Diagnostikalgorithmus", system:"Gastroenterologie", topic:"Aszites", type:"html", file:"files/aszites-diagnostik.html", size:"1 S." },
  { title:"Leberenzyme — Interpretation", system:"Gastroenterologie", topic:"Leberenzyme", type:"html", file:"files/leberenzyme.html", size:"1 S." },
  { title:"Alkoholische Leberzirrhose — Diagnostik", system:"Gastroenterologie", topic:"Leberzirrhose", type:"image", file:"files/alkohol-leberzirrhose-diagnostik.svg", size:"1 S." },
  { title:"Portokavale Anastomosen", system:"Gastroenterologie", topic:"Portale Hypertension", type:"html", file:"files/portocaval-anastomosen.html", size:"Schema" },

  // — Hämatologie & Onkologie —
  { title:"Akute Leukämien — Symptomatik (Mindmap)", system:"Hämatologie & Onkologie", topic:"Akute Leukämie", type:"html", file:"files/al-symptomatik.html", size:"1 S." },
  { title:"Lungenkarzinom — Klinische Übersicht", system:"Hämatologie & Onkologie", topic:"Lungenkarzinom", type:"html", file:"files/lungenkarzinom.html", size:"1 S." },
  { title:"Lungenkarzinom — Staging (TNM/UICC)", system:"Hämatologie & Onkologie", topic:"Lungenkarzinom", type:"html", file:"files/lungenkarzinom-staging.html", size:"1 S." },
  { title:"Chemotherapie — Übersicht", system:"Hämatologie & Onkologie", topic:"Chemotherapie", type:"html", file:"files/chemotherapie-uebersicht.html", size:"1 S." },
  { title:"Kolorektales Karzinom — Therapiealgorithmus", system:"Hämatologie & Onkologie", topic:"Kolorektales Karzinom", type:"html", file:"files/krk-therapie.html", size:"1 S." },
  { title:"Mammakarzinom — Therapiealgorithmus", system:"Hämatologie & Onkologie", topic:"Mammakarzinom", type:"html", file:"files/mammakarzinom-therapie.html", size:"1 S." },
  { title:"Hämatologische Neoplasien — DGHO-Browser", system:"Hämatologie & Onkologie", topic:"Hämatologische Neoplasien (DGHO)", type:"html", file:"files/haemat-neoplasien.html", size:"interaktiv" },
  { title:"Organomegalie bei Leukämie", system:"Hämatologie & Onkologie", topic:"Akute Leukämie", type:"pdf", file:"files/leukemia-organomegaly.pdf", size:"PDF" },

  // — Nephrologie —
  { title:"Hyponatriämie Untersuchungen", system:"Nephrologie", topic:"Elektrolytstörungen Natrium", type:"image", file:"files/hyponatriaemie-logik.svg", size:"1 S." },
  { title:"Hypernatriämie Untersuchungen", system:"Nephrologie", topic:"Elektrolytstörungen Natrium", type:"image", file:"files/urinuntersuchung_hypernatriaemie.svg", size:"1 S." },
  { title:"BGA-Interpreter", system:"Nephrologie", topic:"Säure-Basen-Haushalt", type:"html", file:"files/bga-tool.html" },
  { title:"ANV — Ätiologie-Mindmap", system:"Nephrologie", topic:"Akute Nierenfunktionseinschränkung", type:"html", file:"files/anv-mindmap.html", size:"interaktiv" },
  { title:"Akutes Nierenversagen — Lernzusammenfassung", system:"Nephrologie", topic:"Akute Nierenfunktionseinschränkung", type:"html", file:"files/aki-zusammenfassung.html", size:"Zusammenf." },

  // — Endokrinologie —
  { title:"Orale Antidiabetika & GLP-1-RA", system:"Endokrinologie", topic:"Diabetes mellitus", type:"html", file:"files/antidiabetika.html", size:"1 S." },
  { title:"Insulintherapie — Übersicht", system:"Endokrinologie", topic:"Diabetes mellitus", type:"html", file:"files/insuline.html", size:"1 S." },
  { title:"Antidiabetika nach Wirkort — Master", system:"Endokrinologie", topic:"Diabetes mellitus", type:"html", file:"files/antidiabetika-organ.html", size:"1 S." },
  { title:"Osteoporose — Übersicht", system:"Endokrinologie", topic:"Osteoporose", type:"html", file:"files/osteoporose.html", size:"1 S." },
  { title:"Hyperparathyreoidismus — Übersicht", system:"Endokrinologie", topic:"Hyperparathyreoidismus", type:"html", file:"files/hyperparathyreoidismus.html", size:"1 S." },
  { title:"APS & MEN — One-Pager", system:"Endokrinologie", topic:"Allgemeine Endokrinologie", type:"html", file:"files/aps-men.html", size:"1 S." },
  { title:"Metabolisches Syndrom — Lernzettel", system:"Endokrinologie", topic:"Metabolisches Syndrom", type:"pdf", file:"files/metabolisches-syndrom.pdf", size:"PDF" },

  // — Infektiologie —
  { title:"Infektiologie — KP-Übersicht", system:"Infektiologie", topic:"Allgemeine Infektiologie", type:"html", file:"files/infektiologie-uebersicht.html", size:"Übersicht" },
  { title:"Antibiotika — Übersicht für die KP", system:"Infektiologie", topic:"Antibiotika", type:"html", file:"files/antibiotika-uebersicht.html", size:"interaktiv" },
  { title:"Opportunistische Infektionen nach CD4", system:"Infektiologie", topic:"HIV-Infektion", type:"html", file:"files/opportunistische-infektionen.html", size:"1 S." },
  { title:"Opportunistische Infektionen — Filterbar", system:"Infektiologie", topic:"HIV-Infektion", type:"html", file:"files/opportunistische-infektionen-detail.html", size:"interaktiv" },

  // — Notfallmedizin —
  { title:"DKA — Therapieverlauf & Details", system:"Notfallmedizin", topic:"Hyperglykämisches Koma", type:"html", file:"files/dka-timeline.html", size:"Timeline + Details" },
  { title:"HHS — Therapieverlauf & Details", system:"Notfallmedizin", topic:"Hyperglykämisches Koma", type:"html", file:"files/hhs-timeline.html", size:"Timeline + Details" },
  { title:"DKA vs. HHS — Vergleich", system:"Notfallmedizin", topic:"Hyperglykämisches Koma", type:"html", file:"files/dka-hhs-vergleich.html", size:"1 S." },
  { title:"Akute Intoxikation Artikel", system:"Notfallmedizin", topic:"Akute Intoxikationen", type:"html", file:"files/akuttoxikologie-kp.html", size:"1 S." },

  // — Untersuchung —
  { title:"Gerinnungsdiagnostik — Kaskade & Laborparameter", system:"Untersuchung", topic:"Labor", type:"html", file:"files/gerinnungsdiagnostik.html", size:"1 S." },
  { title:"Gerrinung: Trainer", system:"Untersuchung", topic:"Labor", type:"html", file:"files/gerinnung-trainer.html", size:"1 S." },
  { title:"Blutbild: Trainer", system:"Untersuchung", topic:"Labor", type:"html", file:"files/blutbild-trainer.html", size:"1 S." },
  { title:"BGA: Trainer", system:"Untersuchung", topic:"Labor", type:"html", file:"files/bga-trainer.html", size:"1 S." },
  { title:"Hämostase & Koagulation — Übersicht", system:"Untersuchung", topic:"Labor", type:"html", file:"files/haemostase-onepager.html", size:"1 S." },

  // — Chirurgie —
  { title:"Stoma — KP-Kompaktzusammenfassung", system:"Chirurgie", topic:"Darmchirurgie", type:"html", file:"files/stoma-kp.html", size:"1 S." },

  // — Orthopädie & Unfallchirurgie —
  { title:"Klinische Zeichen & Tests in der Orthopädie", system:"Orthopädie & Unfallchirurgie", topic:"Orthopädische Untersuchungszeichen", type:"image", file:"files/ortho-tests.svg", size:"Poster" },

  // — Pharmakologie & Basismedikation —
  { title:"Insulin stationär — Kitteltaschenkarte", system:"Pharmakologie & Basismedikation", topic:"Stationäre Behandlung bei Diabetes mellitus", type:"html", file:"files/insulin-kitteltaschenkarte.html", size:"Lernkarte" },
  { title:"Thromboseprophylaxe — Algorithmus", system:"Pharmakologie & Basismedikation", topic:"Thromboseprophylaxe (Ärztliches Wissen und Medikation)", type:"html", file:"files/thromboseprophylaxe.html", size:"1 S." },

  // — Klinische Übungen, Skills, Sonstiges —
  { title:"Lernkarten-Index — Innere & Chirurgie", system:"Klinische Übungen, Skills, Sonstiges", topic:"Lernkarten", type:"html", file:"files/lernkarten-index.html", size:"interaktiv" },
  // …add your lines here…
];

/* Reference vocabulary. Display order below = display order on the page. */
const CATEGORIES = {
  "Kardiologie & Angiologie": ["EKG", "Sick-Sinus-Syndrom", "Vorhofflimmern", "Akutes Koronarsyndrom", "Koronare Herzkrankheit", "Herzinsuffizienz", "Myokardinfarkt", "Herzschrittmacher", "Kammerflattern und -flimmern", "Ventrikuläre Tachykardie", "Lungenembolie", "Phlebothrombose", "Herzkatheteruntersuchung", "Orale Antikoagulanzien", "AV-Block", "Herzklappenerkrankungen", "Infektiöse Endokarditis", "Atherosklerose und kardiovaskuläre Prävention", "Dyslipidämien", "Myokarditis", "Periphere arterielle Verschlusskrankheit", "Rheumatisches Fieber"],
  "Pneumologie": ["Asthma bronchiale", "Chronisch-obstruktive Lungenerkrankung", "Lungenembolie", "Pneumothorax", "Ambulant erworbene Pneumonie", "Pneumonie", "Pleuraerguss", "Tuberkulose", "Asbestose und Mesotheliom", "COVID-19", "COVID-19 im Kindes- und Jugendalter", "COVID-19-Impfstoffe", "Exogen-allergische Alveolitis", "Interstitielle Lungenparenchymerkrankungen", "Pulmonale Hypertonie", "Sarkoidose", "Zystische Fibrose"],
  "Gastroenterologie": ["Gastrointestinale Blutung", "Akute Pankreatitis", "Aszites", "Leberzirrhose", "Portale Hypertension", "Cholelithiasis, Cholezystitis und Cholangitis", "Gastroduodenale Ulkuskrankheit", "Chronische Gastritis", "Chronische Pankreatitis", "Divertikulose, Divertikelkrankheit und Divertikulitis", "Magenkarzinom", "Pankreaskarzinom", "Reizdarmsyndrom", "Zöliakie", "Colitis ulcerosa", "Gastroösophageale Refluxkrankheit", "Morbus Crohn"],
  "Nephrologie": ["Grundlagen nephrologischer Krankheitsbilder", "Mikroskopische Urinuntersuchung", "Nierenwerte Labor", "Akute Nierenfunktionseinschränkung", "Chronische Nierenkrankheit", "Diagnostik von Erkrankungen der Niere und der ableitenden Harnwege", "Elektrolytstörungen Kalium", "Elektrolytstörungen Natrium", "Säure-Basen-Haushalt", "Nierenersatzverfahren", "Elektrolytstörungen Calcium", "Hyperparathyreoidismus", "Hereditäre Typ-IV-Kollagen-Erkrankungen (Alport-Syndrom)", "IgA-Nephropathie", "Nierentransplantation", "Polyzystische Nierenerkrankung", "Pyelonephritis"],
  "Endokrinologie": ["Hashimoto-Thyreoiditis", "Hyperthyreose", "Struma", "Diabetes mellitus", "Adrenogenitales Syndrom", "Cushing-Syndrom", "Osteoporose", "Nebennierenrindeninsuffizienz", "Hyperparathyreoidismus", "Phäochromozytom", "Primärer Hyperaldosteronismus", "Hypothyreose", "Schilddrüsenkarzinom", "Allgemeine Endokrinologie", "Hypophysenvorderlappeninsuffizienz", "Karzinoid-Syndrom", "Metabolisches Syndrom", "Prolaktinom", "Vasopressin-assoziierte Erkrankungen (Diabetes insipidus)"],
  "Hämatologie & Onkologie": ["Akute Leukämie", "Chronische lymphatische Leukämie", "Chronische myeloische Leukämie", "Eisenmangel", "Non-Hodgkin-Lymphome", "Vitamin-B12-Mangel", "Anämie", "Hodgkin-Lymphom", "Lungenkarzinom", "Mammakarzinom", "Prostatakarzinom", "Kolorektales Karzinom", "Hämolytische Anämie", "Myelodysplastische Syndrome", "Maligne Hodentumoren", "Malignes Melanom", "Multiples Myelom", "Sichelzellkrankheit", "Thalassämie"],
  "Infektiologie": ["Antibiotika", "Sepsis", "Allgemeine Infektiologie", "Fieber und Entzündungsreaktionen", "HIV-Infektion", "Hepatitis B und HBV-Infektion", "Hepatitis C und HCV-Infektion", "Herpesvirus-Infektionen", "Impfempfehlungen der STIKO", "Impfungen allgemein", "Infektiöse Mononukleose", "Influenza", "Typhus, Paratyphus", "Nosokomiale Pneumonie", "Meningitis", "Bakterielle Durchfallerkrankungen", "Denguefieber", "Emerging Infectious Diseases", "FSME-Virus-Infektion", "Giardiasis", "Leishmaniose", "Lyme-Borreliose", "Malaria", "Norovirus-Infektion", "Nosokomiale Infektionen", "Schistosomiasis"],
  "Rheumatologie": ["Arthrose", "Rheumatoide Arthritis", "Axiale Spondylarthritis", "Granulomatose mit Polyangiitis", "Hyperurikämie und Gicht", "Lupus erythematodes", "Polymyalgia rheumatica", "Reaktive Arthritis", "Riesenzellarteriitis", "Vaskulitiden"],
  "Leitsymptome": ["Dyspnoe", "Schock", "Ödeme", "Akutes Abdomen", "Gastrointestinale Blutung", "Kopfschmerzen", "Schwindel", "Synkope", "Husten", "Lymphknotenschwellung", "Ikterus und Cholestase", "Durchfall", "Obstipation", "Rückenschmerzen", "Thoraxschmerz"],
  "Notfallmedizin": ["Notfallmanagement - Grundlegende Prinzipien", "Reanimation - AMBOSS-SOP", "Schock", "Vorgehen bei Schock", "Hyperglykämisches Koma", "Hypoglykämie", "Anaphylaxie - AMBOSS-SOP", "Grundlagen der Reanimation", "Polytrauma", "Präklinische Traumaversorgung", "Schockraummanagement", "Vigilanzminderung - AMBOSS-SOP", "Ärztliche Rechtskunde", "Akute Intoxikationen", "Akute Intoxikationen - AMBOSS-SOP", "Perikarderguss und Perikardtamponade", "Status epilepticus - AMBOSS-SOP", "Transfusion von Erythrozytenkonzentraten - AMBOSS-SOP", "Vorgehen bei fremdaggressivem Verhalten - AMBOSS-SOP"],
  "Chirurgie": ["Mesenteriale Ischämie", "Appendizitis", "Hernien", "Ileus", "Leistenhernie", "Milzruptur", "Peritonitis", "Zwerchfellhernie", "Schilddrüsenchirurgie", "Akute Wunden und Wundverschluss", "Bakterielle Infektionen von Haut und Weichgewebe", "Chronische Wunden und Wundbehandlung", "Darmchirurgie", "Hepatozelluläres Karzinom", "Hämorrhoiden und Hämorrhoidalleiden", "Kolonpolypen", "Perioperatives Management", "Ösophaguskarzinom", "Pneumothorax", "Akuter arterieller Extremitätenverschluss", "Aortenaneurysma", "Aneurysma", "Aortendissektion", "Thoraxtrauma"],
  "Orthopädie & Unfallchirurgie": ["Bakterielle Arthritis", "Gonarthrose", "Koxarthrose", "Bandverletzungen des Knies", "Orthopädische Untersuchungszeichen", "Schultergelenkluxation", "Orthopädische Untersuchung des Knies", "Orthopädische Untersuchung der Hüfte und des Iliosakralgelenkes", "Orthopädische Untersuchung der Schulter", "Orthopädische Untersuchung der Wirbelsäule", "Bandscheibenprolaps", "Allgemeine Frakturlehre", "Beckenringfrakturen", "Claviculafraktur", "Distale Radiusfraktur", "Femurschaft- und distale Femurfrakturen", "Frakturen im Kindesalter", "Kompartmentsyndrom", "Konservative Verfahren in der Frakturversorgung", "Luxation des Akromioklavikulargelenks", "Proximale Femurfrakturen", "Schaftfrakturen des Unterarmes", "Sprunggelenksfraktur", "Wirbelsäulenverletzungen", "Operative Verfahren der Unfallchirurgie/Orthopädie"],
  "Stationsalltag & Untersuchung": ["Praxistipp EKG-Befundung", "Pulsoxymetrie und Blutgasanalyse", "Lungenfunktionsuntersuchung", "Urindiagnostik", "Befundung eines Röntgen-Thorax", "Rechner und Scores für den klinischen Alltag", "Ablauf einer allgemeinen körperlichen Aufnahmeuntersuchung", "Anamnese", "Auskultationskurs Herz", "Befunde und Techniken der internistischen und chirurgischen Untersuchung", "Patientenvorstellung", "Neurologische Untersuchung", "Soziale Sicherung", "Ökonomische Aspekte von Gesundheit und Krankheit", "Blickdiagnosen an Haut, Hautanhangsgebilden und Schleimhäuten", "Blickdiagnosen und wegweisende Befunde bei der klinischen Untersuchung", "Symptomkarten", "Anlage eines Blasenkatheters", "Anlage eines peripheren Venenverweilkatheters", "Blutkulturen", "Händedesinfektion Antisepsis", "Magensonde und Künstliche Ernährung", "Transfusionen", "Venöse Blutentnahme"],
  "Untersuchung": ["Labor"],
  "Pharmakologie & Basismedikation": ["Stationäre Behandlung bei Diabetes mellitus", "Grundlagen der Schmerztherapie", "Thromboseprophylaxe (Ärztliches Wissen und Medikation)"],
  "Recht, Entlassung & Palliativmedizin": ["Arzneimittelrezept", "Verfassen eines Arztbriefes", "Behinderung und Einschränkung der Arbeitsfähigkeit", "Prävention", "Rehabilitation", "Ökonomische Aspekte von Gesundheit und Krankheit", "Ausfüllen des Totenscheins", "Breaking Bad News", "Palliativmedizin"],
  "Klinische Übungen & Skills": ["Medication-list walk-through", "Diabetic-foot examination", "Mixed package: EKG + CBC + BGA/electrolytes", "Timed Aufnahmebrief / Epikrise", "Jugular venous pressure / hepatojugular reflux", "Compression sonography basics", "Separate Wells pathways: TVT and PE", "Brief neurological screen", "Selected ulcer and skin image set", "Immune thrombocytopenia (ITP)", "Tension pneumothorax + chest-drain check", "Steroid counselling and tapering", "Resistant hypertension: secondary-cause matrix", "Safe signs of death / Todesart / patient wishes", "SBP and hepatorenal syndrome", "Femoral and radial access basics"],
  "Klinische Übungen, Skills, Sonstiges": ["Labor"],
};
