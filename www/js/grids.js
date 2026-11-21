/*
 * Grilles d'évaluation — promotion au grade de Professeur (CUN, Algérie)
 * Data-driven configuration. Every rule of the official documents is encoded here.
 *
 * Item input types:
 *   count     : points = unit × n (capped by `cap`)
 *   weighted  : journal articles, n split by author position (1st 100 %, 2nd 50 %, 3rd+ 25 %),
 *               or 100 % for all when the discipline uses alphabetical order
 *   fixed     : a yes/no item worth `unit` points once
 *   points    : the user enters the points directly (no unit given by the grid), capped by `cap`
 *   choice    : one option among several (best responsibility only)
 * Optional `bonus`: { unit, cap, limitToCount, label } extra points per qualifying unit,
 *   counted outside the item cap unless the bonus has its own cap.
 */
(function () {
  const L = (fr, en, ar) => ({ fr, en, ar });

  const ENGLISH_BONUS = (unit, what, cap) => ({
    unit, cap, limitToCount: true,
    label: L(`dont en anglais (+${unit} pts chacun)`, `of which in English (+${unit} pts each)`, `منها باللغة الإنجليزية (+${unit} ن لكل واحد)`),
    what
  });

  /* ------------------------------------------------------------------ */
  /*  2026 — 54e session CUN                                              */
  /* ------------------------------------------------------------------ */
  const G2026 = {
    id: '2026',
    title: L('Grille 2026 — 54ᵉ session de la CUN', 'Grid 2026 — 54th CUN session', 'شبكة 2026 — الدورة 54 للجنة الجامعية الوطنية'),
    subtitle: L('Conditions et grille d’évaluation en vigueur (54ᵉ session).',
      'Conditions and evaluation grid in force (54th session).',
      'الشروط وشبكة التقييم السارية المفعول (الدورة 54).'),
    thresholds: { pedagogy: 80, research: { ST: 230, SHS: 120 } },
    admin: L('Justifier de cinq (5) années d’exercice effectif en qualité de maître de conférences classe « A » à la date de clôture du dépôt des candidatures.',
      'Five (5) years of effective service as Maître de conférences class “A” at the closing date for applications.',
      'إثبات خمس (5) سنوات من الممارسة الفعلية برتبة أستاذ محاضر قسم «أ» عند تاريخ غلق إيداع الترشحات.'),
    admissibility: {
      ST: [{
        label: L('Variante unique', 'Single variant', 'صيغة وحيدة'),
        groups: [
          {
            label: L('Publications', 'Publications', 'المنشورات'),
            options: [
              L('1 publication de rang « A+ » (auteur principal ou 2ᵉ position)', '1 publication in an “A+” journal (principal author or 2nd position)', 'منشور واحد في مجلة من صنف «A+» (مؤلف رئيسي أو في المرتبة الثانية)'),
              L('1 publication de rang « A » + 2 publications de rang « B » (auteur principal ou 2ᵉ position)', '1 “A” publication + 2 “B” publications (principal author or 2nd position)', 'منشور واحد من صنف «A» + منشوران من صنف «B» (مؤلف رئيسي أو في المرتبة الثانية)')
            ]
          },
          {
            label: L('Encadrement', 'Supervision', 'التأطير'),
            options: [
              L('Encadrement ou co-encadrement d’une thèse de doctorat soutenue', 'Supervision or co-supervision of 1 defended doctoral thesis', 'تأطير أو المشاركة في تأطير أطروحة دكتوراه واحدة نوقشت'),
              L('Encadrement de 2 magisters soutenus', 'Supervision of 2 defended magister theses', 'تأطير مذكرتي ماجستير نوقشتا'),
              L('Encadrement de 4 masters', 'Supervision of 4 master dissertations', 'تأطير 4 مذكرات ماستر')
            ]
          }
        ]
      }],
      SHS: [{
        label: L('Variante unique', 'Single variant', 'صيغة وحيدة'),
        groups: [
          {
            label: L('Publications', 'Publications', 'المنشورات'),
            options: [
              L('1 publication de rang « A » (auteur principal ou 2ᵉ position)', '1 “A” publication (principal author or 2nd position)', 'منشور واحد من صنف «A» (مؤلف رئيسي أو في المرتبة الثانية)'),
              L('1 publication de rang « B » + 1 publication de rang « C » (auteur principal ou 2ᵉ position)', '1 “B” publication + 1 “C” publication (principal author or 2nd position)', 'منشور من صنف «B» + منشور من صنف «C» (مؤلف رئيسي أو في المرتبة الثانية)'),
              L('2 publications de rang « C » (auteur principal)', '2 “C” publications (principal author)', 'منشوران من صنف «C» (مؤلف رئيسي)')
            ]
          },
          {
            label: L('Encadrement', 'Supervision', 'التأطير'),
            options: [
              L('Encadrement ou co-encadrement d’une thèse de doctorat soutenue', 'Supervision or co-supervision of 1 defended doctoral thesis', 'تأطير أو المشاركة في تأطير أطروحة دكتوراه واحدة نوقشت'),
              L('Encadrement de 2 magisters soutenus', 'Supervision of 2 defended magister theses', 'تأطير مذكرتي ماجستير نوقشتا'),
              L('Encadrement de 4 masters', 'Supervision of 4 master dissertations', 'تأطير 4 مذكرات ماستر')
            ]
          }
        ]
      }]
    },
    sections: [
      {
        id: 'pedagogy', kind: 'pedagogy',
        title: L('1. Pédagogie', '1. Teaching', '1. البيداغوجيا'),
        groups: [
          {
            title: L('1-1 Les enseignements', '1-1 Teaching', '1-1 التدريس'),
            items: [
              { id: 'cours', type: 'count', unit: 6, cap: 60, unitLabel: 'sem',
                label: L('Enseignement de cours', 'Lectures (cours)', 'تدريس المحاضرات'),
                bonus: ENGLISH_BONUS(10) },
              { id: 'td', type: 'count', unit: 1.5, cap: 15, unitLabel: 'sem',
                label: L('Enseignement de travaux dirigés (TD)', 'Tutorial classes (TD)', 'تدريس الأعمال الموجهة') },
              { id: 'tp', type: 'count', unit: 1.5, cap: 15, unitLabel: 'sem',
                label: L('Encadrement de travaux pratiques (TP)', 'Practical work (TP)', 'تأطير الأعمال التطبيقية') },
              { id: 'enligne', type: 'count', unit: 30, unitLabel: 'subject',
                label: L('Matière en ligne (cours, TD ou TP) scénarisée, enseignée en ligne et validée', 'Online subject (lecture, TD or TP), scripted, taught online and validated', 'مقياس عبر الخط (محاضرة، أعمال موجهة أو تطبيقية) مُسيْنَر ومُدرَّس عن بعد ومصادق عليه'),
                bonus: ENGLISH_BONUS(10) }
            ]
          },
          {
            title: L('1-2 Les activités pédagogiques', '1-2 Pedagogical activities', '1-2 النشاطات البيداغوجية'),
            items: [
              { id: 'polycopie', type: 'count', unit: 12, unitLabel: 'item',
                label: L('Polycopié de cours validé par les instances scientifiques et mis en ligne', 'Course handout (polycopié) validated and published online', 'مطبوعة دروس مصادق عليها من الهيئات العلمية ومنشورة على الخط'),
                bonus: ENGLISH_BONUS(10) },
              { id: 'ouvragePeda', type: 'count', unit: 30, unitLabel: 'item',
                label: L('Ouvrage(s) pédagogique(s) édité(s)', 'Published pedagogical book(s)', 'كتاب (كتب) بيداغوجية منشورة'),
                bonus: ENGLISH_BONUS(10) },
              { id: 'tutorat', type: 'count', unit: 3, cap: 15, unitLabel: 'year',
                label: L('Tutorat attesté par le chef de département', 'Tutoring certified by the head of department', 'المرافقة البيداغوجية (Tutorat) بشهادة رئيس القسم') },
              { id: 'stagiaires', type: 'count', unit: 6, cap: 30, unitLabel: 'year',
                label: L('Suivi des étudiants stagiaires en entreprise', 'Follow-up of student interns in companies', 'متابعة الطلبة المتربصين في المؤسسات') },
              { id: 'projetTutore', type: 'fixed', unit: 5,
                label: L('Réalisation de projet tutoré (relation Université-Entreprise)', 'Tutored project (University–Industry relation)', 'إنجاز مشروع مؤطَّر في إطار علاقة الجامعة بالمؤسسة') },
              { id: 'animation', type: 'fixed', unit: 5,
                label: L('Animation des équipes pédagogiques (séminaire, atelier, responsabilité pédagogique, présidence CP…)', 'Leading teaching teams (seminar, workshop, programme responsibility, chairing a pedagogical committee…)', 'تنشيط الفرق البيداغوجية (ملتقى، ورشة، مسؤولية بيداغوجية، رئاسة لجنة بيداغوجية…)') },
              { id: 'master', type: 'count', unit: 2, cap: 20, unitLabel: 'item',
                label: L('Encadrement de mémoire de master, d’ingénieur ou équivalent', 'Supervision of master / engineering dissertations', 'تأطير مذكرات الماستر أو المهندس أو ما يعادلها') },
              { id: 'masterStartup', type: 'count', unit: 15, cap: 45, unitLabel: 'item',
                label: L('Encadrement de mémoire lié au diplôme-startup (label projet innovant ou startup)', 'Supervision of “diploma–startup” dissertations (innovative project or startup label)', 'تأطير مذكرات في إطار شهادة - مؤسسة ناشئة (وسم مشروع مبتكر أو مؤسسة ناشئة)') },
              { id: 'anglaisEnLigne', type: 'count', unit: 6, cap: 30, unitLabel: 'year',
                label: L('Mise en place des contenus et dispositifs en ligne d’apprentissage de l’anglais (CNEAD, CIEL)', 'Developing online English-learning content and platforms (CNEAD, CIEL)', 'المشاركة في إعداد محتويات وأجهزة تعلّم اللغة الإنجليزية عبر الخط (CNEAD، CIEL)') }
            ]
          }
        ]
      },
      {
        id: 'research', kind: 'research',
        title: L('2. Activités de recherche', '2. Research activities', '2. نشاطات البحث'),
        groups: [
          {
            title: L('Publications', 'Publications', 'المنشورات'),
            items: [
              { id: 'pubAplus', type: 'weighted', unit: 160, label: L('Publications de rang « A+ » et plus', '“A+” (and above) publications', 'منشورات من صنف «A+» فما فوق') },
              { id: 'pubA', type: 'weighted', unit: 80, label: L('Publications de rang « A »', '“A” publications', 'منشورات من صنف «A»') },
              { id: 'pubB', type: 'weighted', unit: 40, label: L('Publications de rang « B »', '“B” publications', 'منشورات من صنف «B»') },
              { id: 'pubC', type: 'weighted', unit: 20, cap: 40, label: L('Publications de rang « C »', '“C” publications', 'منشورات من صنف «C»'),
                bonus: ENGLISH_BONUS(10) },
              { id: 'ouvrageSci', type: 'count', unit: 40, unitLabel: 'item',
                label: L('Ouvrage(s) scientifique(s) dans la spécialité', 'Scientific book(s) in the speciality', 'كتاب (كتب) علمية في التخصص'),
                bonus: ENGLISH_BONUS(20) },
              { id: 'chapitre', type: 'count', unit: 10, unitLabel: 'item',
                label: L('Chapitre dans un ouvrage scientifique', 'Chapter in a scientific book', 'فصل في كتاب علمي'),
                bonus: ENGLISH_BONUS(5) },
              { id: 'commInt', type: 'count', unit: 20, cap: 40, unitLabel: 'item',
                label: L('Communications internationales', 'International conference papers', 'مداخلات دولية'),
                bonus: { unit: 5, limitToCount: true, label: L('dont proceedings indexés WoS / Scopus (+5 pts chacune)', 'of which proceedings indexed in WoS / Scopus (+5 pts each)', 'منها بأعمال مفهرسة في WoS / Scopus (+5 ن لكل واحدة)') } },
              { id: 'commNat', type: 'count', unit: 10, cap: 20, unitLabel: 'item',
                label: L('Communications nationales', 'National conference papers', 'مداخلات وطنية') }
            ]
          },
          {
            title: L('Brevets', 'Patents', 'براءات الاختراع'),
            note: L('Un même brevet ne peut être compté qu’une seule fois (même s’il est enregistré à l’INAPI puis à l’OMPI).', 'A given patent can be counted only once (even if registered with INAPI and then WIPO).', 'لا تُحتسب براءة الاختراع نفسها إلا مرة واحدة (حتى وإن سُجّلت لدى INAPI ثم لدى OMPI).'),
            items: [
              { id: 'brevetOmpiExp', type: 'count', unit: 80, unitLabel: 'item', label: L('Brevet PCT (OMPI) exploité', 'Exploited PCT patent (WIPO)', 'براءة اختراع PCT (OMPI) مستغلة') },
              { id: 'brevetOmpiEnr', type: 'count', unit: 60, unitLabel: 'item', label: L('Brevet PCT (OMPI) enregistré', 'Registered PCT patent (WIPO)', 'براءة اختراع PCT (OMPI) مسجلة') },
              { id: 'brevetInapi', type: 'count', unit: 55, unitLabel: 'item', label: L('Brevet INAPI', 'INAPI patent', 'براءة اختراع INAPI') }
            ]
          },
          {
            title: L('Formation doctorale et encadrement', 'Doctoral training and supervision', 'التكوين في الدكتوراه والتأطير'),
            items: [
              { id: 'formDoct', type: 'fixed', unit: 15,
                label: L('Participation à la formation doctorale (séminaires…) attestée', 'Participation in doctoral training (seminars…), certified', 'المشاركة في التكوين في الدكتوراه (ملتقيات…) بشهادة') },
              { id: 'doctorat', type: 'count', unit: 40, unitLabel: 'item',
                label: L('Encadrement de doctorat soutenu', 'Supervision of defended doctorates', 'تأطير أطروحات دكتوراه نوقشت'),
                bonus: ENGLISH_BONUS(10) },
              { id: 'coDoctorat', type: 'count', unit: 15, unitLabel: 'item',
                label: L('Co-encadrement de doctorat soutenu', 'Co-supervision of defended doctorates', 'المشاركة في تأطير أطروحات دكتوراه نوقشت'),
                bonus: ENGLISH_BONUS(10) },
              { id: 'magister', type: 'count', unit: 10, unitLabel: 'item',
                label: L('Encadrement de magister soutenu', 'Supervision of defended magister theses', 'تأطير مذكرات ماجستير نوقشت') }
            ]
          },
          {
            title: L('Autres activités scientifiques', 'Other scientific activities', 'نشاطات علمية أخرى'),
            items: [
              { id: 'orgManif', type: 'count', unit: 5, cap: 10, unitLabel: 'part',
                label: L('Organisation de manifestations scientifiques', 'Organising scientific events', 'المشاركة في تنظيم تظاهرات علمية') },
              { id: 'expertise', type: 'count', unit: 5, cap: 10, unitLabel: 'part',
                label: L('Activité scientifique (expertise…)', 'Scientific activity (expert reviews…)', 'النشاط العلمي (خبرة…)') },
              { id: 'coopInt', type: 'count', unit: 5, cap: 10, unitLabel: 'part',
                label: L('Projets de coopération internationale', 'International cooperation projects', 'مشاريع التعاون الدولي') },
              { id: 'projRech', type: 'count', unit: 5, cap: 10, unitLabel: 'part',
                label: L('Activités de recherche (PRFU, PNR, laboratoire…)', 'Research activities (PRFU, PNR, laboratory…)', 'نشاطات البحث (PRFU، PNR، مخبر بحث…)'),
                bonus: { unit: 15, limitToCount: true, label: L('dont projets sécurité alimentaire / santé / énergie (+15 pts chacun)', 'of which food-security / health / energy projects (+15 pts each)', 'منها مشاريع الأمن الغذائي / الصحة / الأمن الطاقوي (+15 ن لكل مشروع)') } },
              { id: 'etud5', type: 'count', unit: 5, unitLabel: 'student',
                label: L('Formation des étudiants 5 étoiles', 'Training “5-star” students', 'المشاركة في تكوين طلبة 5 نجوم') },
              { id: 'bureauEtudes', type: 'points', cap: 10,
                label: L('Activités des bureaux d’études ou filiales d’établissement (attestées)', 'Consultancy offices or institutional subsidiaries (certified)', 'المشاركة في نشاطات مكاتب الدراسات أو فروع المؤسسة') },
              { id: 'startup', type: 'count', unit: 20, unitLabel: 'part',
                label: L('Création d’une startup labellisée ou d’un projet innovant', 'Creating a labelled startup or innovative project', 'المشاركة في إنشاء مؤسسة ناشئة موسومة أو مشروع مبتكر') },
              { id: 'communaute', type: 'count', unit: 5, cap: 10, unitLabel: 'part',
                label: L('Apport à la communauté universitaire (instances, montage de projets)', 'Contribution to the university community (bodies, project design)', 'الإسهام في الحياة الجامعية (الهيئات العلمية والبيداغوجية، إعداد المشاريع)') },
              { id: 'societe', type: 'count', unit: 5, cap: 10, unitLabel: 'part',
                label: L('Apport à la société (diffusion de la culture scientifique)', 'Contribution to society (science outreach)', 'الإسهام في المجتمع (نشر الثقافة العلمية)') }
            ]
          }
        ]
      }
    ],
    observations: [
      L('La publication est obligatoire : rang « A+ », « A » ou « B » pour les S&T ; « A », « B » ou « C » pour les SHS.', 'A publication is mandatory: “A+”, “A” or “B” for S&T; “A”, “B” or “C” for SHS.', 'النشر إلزامي: صنف «A+» أو «A» أو «B» لميادين العلوم والتكنولوجيا، وصنف «A» أو «B» أو «C» لميادين العلوم الإنسانية والاجتماعية.'),
      L('Les articles de classe « C » doivent être publiés dans des revues et des numéros différents.', '“C” articles must be in different journals and issues.', 'يجب أن تُنشر مقالات الصنف «C» في مجلات وأعداد مختلفة.'),
      L('Les publications dans des revues ou chez des éditeurs prédateurs, ou non reconnues par la DGRSDT, ne sont pas acceptées.', 'Publications in predatory journals/publishers, or not recognised by the DGRSDT, are not accepted.', 'لا تُقبل المنشورات في المجلات أو لدى الناشرين المفترسين أو غير المعترف بها من طرف المديرية العامة للبحث العلمي والتطوير التكنولوجي.'),
      L('Co-auteurs : 1ᵉʳ auteur 100 %, 2ᵉ auteur 50 %, 3ᵉ et au-delà 25 % (100 % pour tous dans les disciplines à ordre alphabétique).', 'Co-authors: 1st author 100 %, 2nd 50 %, 3rd and beyond 25 % (100 % for all in alphabetical-order disciplines).', 'ترتيب المؤلفين: المؤلف الأول 100%، الثاني 50%، الثالث فما فوق 25% (100% للجميع في التخصصات التي تعتمد الترتيب الأبجدي).')
    ]
  };

  /* ------------------------------------------------------------------ */
  /*  2028 — projet de grille (à partir de la session de novembre 2028)   */
  /* ------------------------------------------------------------------ */
  const SUPERVISION_2028 = {
    label: L('Encadrement', 'Supervision', 'التأطير'),
    options: [
      L('Encadrement ou co-encadrement d’une thèse de doctorat soutenue (depuis la première inscription)', 'Supervision or co-supervision of 1 defended doctoral thesis (from first enrolment)', 'تأطير أو المشاركة في تأطير أطروحة دكتوراه نوقشت (منذ التسجيل الأول)'),
      L('Encadrement de 2 mémoires Master-startup soutenus', 'Supervision of 2 defended Master–startup dissertations', 'تأطير مذكرتي ماستر - مؤسسة ناشئة نوقشتا'),
      L('Encadrement de 6 mémoires Master soutenus ou équivalent (écoles supérieures)', 'Supervision of 6 defended master dissertations or equivalent (higher schools)', 'تأطير 6 مذكرات ماستر نوقشت أو ما يعادلها (المدارس العليا)')
    ]
  };

  const G2028 = {
    id: '2028',
    title: L('Grille 2028 — projet (à partir de novembre 2028)', 'Grid 2028 — draft (from November 2028)', 'شبكة 2028 — مشروع (ابتداءً من نوفمبر 2028)'),
    subtitle: L('Projet de grille applicable à partir de la session de novembre 2028 (version du 16/06/2025).',
      'Draft grid applicable from the November 2028 session (version of 16/06/2025).',
      'مشروع الشبكة المطبق ابتداءً من دورة نوفمبر 2028 (نسخة 16/06/2025).'),
    thresholds: { pedagogy: 150, research: { ST: 250, SHS: 200 } },
    admin: L('Justifier de cinq (5) années d’exercice effectif en qualité de maître de conférences classe « A ».',
      'Five (5) years of effective service as Maître de conférences class “A”.',
      'إثبات خمس (5) سنوات من الممارسة الفعلية برتبة أستاذ محاضر قسم «أ».'),
    admissibility: {
      ST: [
        {
          label: L('Première variante', 'First variant', 'الصيغة الأولى'),
          groups: [
            {
              label: L('Publications', 'Publications', 'المنشورات'),
              options: [
                L('1 publication de rang « A+ » (auteur principal ou 2ᵉ position)', '1 “A+” publication (principal author or 2nd position)', 'منشور واحد من صنف «A+» (مؤلف رئيسي أو في المرتبة الثانية)'),
                L('2 publications de rang « A » (auteur principal dans l’une, au moins 2ᵉ position dans l’autre)', '2 “A” publications (principal author in one, at least 2nd position in the other)', 'منشوران من صنف «A» (مؤلف رئيسي في أحدهما وفي المرتبة الثانية على الأقل في الآخر)'),
                L('1 publication « A » (auteur principal) + 2 publications « B » (auteur principal dans l’une, au moins 2ᵉ dans l’autre)', '1 “A” publication (principal author) + 2 “B” publications (principal in one, at least 2nd in the other)', 'منشور من صنف «A» (مؤلف رئيسي) + منشوران من صنف «B» (مؤلف رئيسي في أحدهما وفي المرتبة الثانية على الأقل في الآخر)')
              ]
            },
            SUPERVISION_2028
          ]
        },
        {
          label: L('Deuxième variante', 'Second variant', 'الصيغة الثانية'),
          groups: [
            {
              label: L('Publication et brevet', 'Publication and patent', 'منشور وبراءة اختراع'),
              options: [
                L('1 publication « A » (auteur principal) + 1 brevet OMPI-PCT enregistré et publié', '1 “A” publication (principal author) + 1 registered and published WIPO-PCT patent', 'منشور من صنف «A» (مؤلف رئيسي) + براءة اختراع OMPI-PCT مسجلة ومنشورة'),
                L('1 publication « A » (auteur principal) + 2 brevets INAPI enregistrés et publiés', '1 “A” publication (principal author) + 2 registered and published INAPI patents', 'منشور من صنف «A» (مؤلف رئيسي) + براءتا اختراع INAPI مسجلتان ومنشورتان')
              ]
            },
            SUPERVISION_2028
          ]
        }
      ],
      SHS: [
        {
          label: L('Première variante', 'First variant', 'الصيغة الأولى'),
          groups: [
            {
              label: L('Publications', 'Publications', 'المنشورات'),
              options: [
                L('1 publication de rang « A+ » ou « A » (auteur principal ou 2ᵉ position)', '1 “A+” or “A” publication (principal author or 2nd position)', 'منشور واحد من صنف «A+» أو «A» (مؤلف رئيسي أو في المرتبة الثانية)'),
                L('2 publications dans deux revues « B » (auteur principal dans l’une, au moins 2ᵉ dans l’autre)', '2 publications in two “B” journals (principal in one, at least 2nd in the other)', 'منشوران في مجلتين من صنف «B» (مؤلف رئيسي في أحدهما وفي المرتبة الثانية على الأقل في الآخر)'),
                L('1 publication « B » (auteur principal) + 2 publications dans deux revues « C » (auteur principal)', '1 “B” publication (principal author) + 2 publications in two “C” journals (principal author)', 'منشور من صنف «B» (مؤلف رئيسي) + منشوران في مجلتين من صنف «C» (مؤلف رئيسي)')
              ]
            },
            SUPERVISION_2028
          ]
        },
        {
          label: L('Deuxième variante', 'Second variant', 'الصيغة الثانية'),
          groups: [
            {
              label: L('Brevet et publication', 'Patent and publication', 'براءة اختراع ومنشور'),
              options: [
                L('1 brevet INAPI enregistré et publié + 1 publication « B » (auteur principal)', '1 registered and published INAPI patent + 1 “B” publication (principal author)', 'براءة اختراع INAPI مسجلة ومنشورة + منشور من صنف «B» (مؤلف رئيسي)')
              ]
            },
            SUPERVISION_2028
          ]
        }
      ]
    },
    sections: [
      {
        id: 'pedagogy', kind: 'pedagogy',
        title: L('1. Pédagogie', '1. Teaching', '1. البيداغوجيا'),
        groups: [
          {
            title: L('1-1 Les enseignements', '1-1 Teaching', '1-1 التدريس'),
            items: [
              { id: 'cours', type: 'count', unit: 6, cap: 60, unitLabel: 'sem',
                label: L('Enseignement de cours', 'Lectures (cours)', 'تدريس المحاضرات'), bonus: ENGLISH_BONUS(5) },
              { id: 'atelier', type: 'count', unit: 4, cap: 40, unitLabel: 'sem',
                label: L('Cours sous forme d’atelier (graduation, selon l’offre de formation)', 'Workshop-format courses (undergraduate, per programme)', 'محاضرات في شكل ورشات (طور التدرج، حسب عروض التكوين)'), bonus: ENGLISH_BONUS(3) },
              { id: 'td', type: 'count', unit: 3, cap: 30, unitLabel: 'sem',
                label: L('Enseignement de travaux dirigés (TD)', 'Tutorial classes (TD)', 'تدريس الأعمال الموجهة'), bonus: ENGLISH_BONUS(2) },
              { id: 'tp', type: 'count', unit: 3, cap: 30, unitLabel: 'sem',
                label: L('Encadrement de travaux pratiques (TP)', 'Practical work (TP)', 'تأطير الأعمال التطبيقية'), bonus: ENGLISH_BONUS(2) },
              { id: 'enligne', type: 'count', unit: 5, cap: 20, unitLabel: 'subject',
                label: L('Matière en ligne (cours, TD ou TP) scénarisée, enseignée en ligne et validée', 'Online subject (lecture, TD or TP), scripted, taught online and validated', 'مقياس عبر الخط (محاضرة، أعمال موجهة أو تطبيقية) مُسيْنَر ومُدرَّس عن بعد ومصادق عليه'), bonus: ENGLISH_BONUS(5) }
            ]
          },
          {
            title: L('1-2 Les activités pédagogiques', '1-2 Pedagogical activities', '1-2 النشاطات البيداغوجية'),
            items: [
              { id: 'polycopie', type: 'count', unit: 12, cap: 24, unitLabel: 'item',
                label: L('Polycopié de cours validé par le conseil scientifique et mis en ligne', 'Course handout validated by the scientific council and published online', 'مطبوعة دروس مصادق عليها من المجلس العلمي ومنشورة على الخط'), bonus: ENGLISH_BONUS(8) },
              { id: 'ouvragePeda', type: 'count', unit: 30, cap: 30, unitLabel: 'item',
                label: L('Ouvrage pédagogique édité (ISBN, validé ; un seul au maximum)', 'Published pedagogical book (ISBN, validated; one at most)', 'كتاب بيداغوجي منشور (ردمك، مصادق عليه؛ كتاب واحد كحد أقصى)'), bonus: ENGLISH_BONUS(10, null, 10) },
              { id: 'stagiaires', type: 'count', unit: 6, cap: 18, unitLabel: 'year',
                label: L('Suivi des étudiants stagiaires en entreprise', 'Follow-up of student interns in companies', 'متابعة الطلبة المتربصين في المؤسسات') },
              { id: 'projetTutore', type: 'count', unit: 5, unitLabel: 'project',
                label: L('Projet tutoré (relation Université-Entreprise)', 'Tutored project (University–Industry relation)', 'مشروع مؤطَّر في إطار علاقة الجامعة بالمؤسسة') },
              { id: 'animation', type: 'fixed', unit: 5,
                label: L('Animation des équipes pédagogiques (séminaire, atelier, présidence de comité pédagogique…)', 'Leading teaching teams (seminar, workshop, chairing a pedagogical committee…)', 'تنشيط الفرق البيداغوجية (ملتقى، ورشة، رئاسة لجنة بيداغوجية…)') },
              { id: 'master', type: 'count', unit: 2, cap: 20, unitLabel: 'item',
                label: L('Encadrement de mémoire de master, d’ingénieur ou équivalent', 'Supervision of master / engineering dissertations', 'تأطير مذكرات الماستر أو المهندس أو ما يعادلها'), bonus: ENGLISH_BONUS(2) },
              { id: 'masterStartup', type: 'count', unit: 10, cap: 40, unitLabel: 'item',
                label: L('Encadrement de mémoire lié au diplôme-startup', 'Supervision of “diploma–startup” dissertations', 'تأطير مذكرات في إطار شهادة - مؤسسة ناشئة') },
              { id: 'contenusEnLigne', type: 'count', unit: 6, cap: 30, unitLabel: 'year',
                label: L('Mise en place de contenus pédagogiques et dispositifs en ligne (CNEAD, CIEL…)', 'Developing online pedagogical content and platforms (CNEAD, CIEL…)', 'المشاركة في إعداد محتويات بيداغوجية وأجهزة تعلّم عبر الخط (CNEAD، CIEL…)'),
                bonus: { unit: 2, cap: 10, limitToCount: false, label: L('contenus d’enseignement en anglais (+2 pts chacun, 10 pts max)', 'teaching contents in English (+2 pts each, 10 pts max)', 'محتويات تعليمية باللغة الإنجليزية (+2 ن لكل محتوى، 10 ن كحد أقصى)') } },
              { id: 'entrepreneuriat', type: 'fixed', unit: 5,
                label: L('Ateliers de formation à l’entrepreneuriat (validés par le CDE)', 'Entrepreneurship training workshops (validated by the CDE)', 'المشاركة في ورشات تكوينية لترقية روح المقاولاتية (مصادق عليها من مركز تطوير المقاولاتية)') },
              { id: 'etud5', type: 'count', unit: 5, unitLabel: 'student',
                label: L('Encadrement d’un étudiant cinq (5) étoiles', 'Supervising a “5-star” student', 'تأطير طالب خمس (5) نجوم') }
            ]
          }
        ]
      },
      {
        id: 'research', kind: 'research',
        title: L('2. Activités de recherche', '2. Research activities', '2. نشاطات البحث'),
        groups: [
          {
            title: L('Publications', 'Publications', 'المنشورات'),
            items: [
              { id: 'pubAplus', type: 'weighted', unit: 180, label: L('Publications de rang « A+ » et plus', '“A+” (and above) publications', 'منشورات من صنف «A+» فما فوق') },
              { id: 'pubA', type: 'weighted', unit: 100, label: L('Publications de rang « A »', '“A” publications', 'منشورات من صنف «A»') },
              { id: 'pubB', type: 'weighted', unit: 50, label: L('Publications de rang « B »', '“B” publications', 'منشورات من صنف «B»') },
              { id: 'pubC', type: 'weighted', unit: 25, cap: 50, label: L('Publications de rang « C »', '“C” publications', 'منشورات من صنف «C»') },
              { id: 'ouvrageIdx', type: 'count', unit: 40, unitLabel: 'item',
                label: L('Ouvrages scientifiques indexés WoS / Scopus', 'Scientific books indexed in WoS / Scopus', 'كتب علمية مفهرسة في WoS / Scopus'), bonus: ENGLISH_BONUS(20) },
              { id: 'ouvrageIsbn', type: 'count', unit: 30, cap: 60, unitLabel: 'item',
                label: L('Ouvrages scientifiques édités (ISBN, validés par le conseil scientifique)', 'Published scientific books (ISBN, validated by the scientific council)', 'كتب علمية منشورة لدى دور نشر (ردمك، مصادق عليها من المجلس العلمي)'), bonus: ENGLISH_BONUS(10) },
              { id: 'chapitre', type: 'count', unit: 10, unitLabel: 'item',
                label: L('Chapitre dans un ouvrage scientifique à comité de lecture', 'Chapter in a peer-reviewed scientific book', 'فصل في كتاب علمي محكَّم'), bonus: ENGLISH_BONUS(5) },
              { id: 'commInt', type: 'count', unit: 10, cap: 50, unitLabel: 'item',
                label: L('Communications internationales (auteur et intervenant principal)', 'International conference papers (main author and presenter)', 'مداخلات دولية (بصفة مؤلف ومتدخل رئيسي)'),
                bonus: { unit: 5, limitToCount: true, label: L('dont actes indexés WoS / Scopus (+5 pts chacune)', 'of which proceedings indexed in WoS / Scopus (+5 pts each)', 'منها بأعمال مفهرسة في WoS / Scopus (+5 ن لكل واحدة)') } },
              { id: 'commNat', type: 'count', unit: 5, cap: 25, unitLabel: 'item',
                label: L('Communications nationales (auteur et intervenant principal)', 'National conference papers (main author and presenter)', 'مداخلات وطنية (بصفة مؤلف ومتدخل رئيسي)') }
            ]
          },
          {
            title: L('Brevets', 'Patents', 'براءات الاختراع'),
            note: L('Un même brevet ne peut être compté qu’une seule fois et pour le même auteur.', 'A given patent can be counted only once and for the same author.', 'لا تُحتسب براءة الاختراع نفسها إلا مرة واحدة ولنفس المؤلف.'),
            items: [
              { id: 'brevetOmpiExp', type: 'count', unit: 80, unitLabel: 'item', label: L('Brevet PCT/OMPI exploité', 'Exploited PCT/WIPO patent', 'براءة اختراع PCT/OMPI مستغلة') },
              { id: 'brevetOmpiEnr', type: 'count', unit: 60, unitLabel: 'item', label: L('Brevet PCT/OMPI enregistré et publié', 'Registered and published PCT/WIPO patent', 'براءة اختراع PCT/OMPI مسجلة ومنشورة') },
              { id: 'brevetInapi', type: 'count', unit: 30, unitLabel: 'item', label: L('Brevet INAPI enregistré et publié', 'Registered and published INAPI patent', 'براءة اختراع INAPI مسجلة ومنشورة') }
            ]
          },
          {
            title: L('Encadrement doctoral', 'Doctoral supervision', 'التأطير في الدكتوراه'),
            items: [
              { id: 'doctorat', type: 'count', unit: 40, unitLabel: 'item',
                label: L('Encadrement de thèse de doctorat soutenue', 'Supervision of defended doctoral theses', 'تأطير أطروحات دكتوراه نوقشت'), bonus: ENGLISH_BONUS(10) },
              { id: 'coDoctorat', type: 'count', unit: 20, unitLabel: 'item',
                label: L('Co-encadrement de thèse de doctorat soutenue', 'Co-supervision of defended doctoral theses', 'المشاركة في تأطير أطروحات دكتوراه نوقشت'), bonus: ENGLISH_BONUS(10) },
              { id: 'magister', type: 'count', unit: 10, unitLabel: 'item',
                label: L('Encadrement de magister soutenu', 'Supervision of defended magister theses', 'تأطير مذكرات ماجستير نوقشت') }
            ]
          },
          {
            title: L('Organisation de colloques internationaux', 'Organising international conferences', 'تنظيم ملتقيات دولية'),
            note: L('L’organisation doit être validée par les services compétents de l’administration centrale du MESRS.', 'The organisation must be validated by the competent central services of the Ministry.', 'يجب أن يُصادق على التنظيم من طرف المصالح المختصة للإدارة المركزية لوزارة التعليم العالي والبحث العلمي.'),
            items: [
              { id: 'ciPres', type: 'count', unit: 15, cap: 30, unitLabel: 'item',
                label: L('Président du colloque', 'Conference chair', 'رئيس الملتقى'),
                bonus: { unit: 5, limitToCount: false, label: L('communications indexées WoS / Scopus (+5 pts chacune)', 'communications indexed in WoS / Scopus (+5 pts each)', 'مداخلات مفهرسة في WoS / Scopus (+5 ن لكل واحدة)') } },
              { id: 'ciPresSci', type: 'count', unit: 10, cap: 20, unitLabel: 'item',
                label: L('Président du comité scientifique', 'Chair of the scientific committee', 'رئيس اللجنة العلمية'),
                bonus: { unit: 3, limitToCount: false, label: L('communications indexées WoS / Scopus (+3 pts chacune)', 'communications indexed in WoS / Scopus (+3 pts each)', 'مداخلات مفهرسة في WoS / Scopus (+3 ن لكل واحدة)') } },
              { id: 'ciPresOrg', type: 'count', unit: 5, cap: 10, unitLabel: 'item',
                label: L('Président du comité d’organisation', 'Chair of the organising committee', 'رئيس لجنة التنظيم'),
                bonus: { unit: 2, limitToCount: false, label: L('communications indexées WoS / Scopus (+2 pts chacune)', 'communications indexed in WoS / Scopus (+2 pts each)', 'مداخلات مفهرسة في WoS / Scopus (+2 ن لكل واحدة)') } },
              { id: 'ciMembre', type: 'count', unit: 1, cap: 2, unitLabel: 'item',
                label: L('Membre du comité scientifique / d’organisation', 'Member of the scientific / organising committee', 'عضو اللجنة العلمية / لجنة التنظيم') }
            ]
          },
          {
            title: L('Organisation de colloques nationaux', 'Organising national conferences', 'تنظيم ملتقيات وطنية'),
            items: [
              { id: 'cnPres', type: 'count', unit: 10, cap: 20, unitLabel: 'item', label: L('Président du colloque', 'Conference chair', 'رئيس الملتقى') },
              { id: 'cnPresSci', type: 'count', unit: 5, cap: 10, unitLabel: 'item', label: L('Président du comité scientifique', 'Chair of the scientific committee', 'رئيس اللجنة العلمية') },
              { id: 'cnPresOrg', type: 'count', unit: 3, cap: 6, unitLabel: 'item', label: L('Président du comité d’organisation', 'Chair of the organising committee', 'رئيس لجنة التنظيم') },
              { id: 'cnMembre', type: 'count', unit: 1, cap: 2, unitLabel: 'item', label: L('Membre du comité scientifique / d’organisation', 'Member of the scientific / organising committee', 'عضو اللجنة العلمية / لجنة التنظيم') }
            ]
          },
          {
            title: L('Projets', 'Projects', 'المشاريع'),
            items: [
              { id: 'coopChef', type: 'count', unit: 30, unitLabel: 'project', label: L('Coopération internationale — chef de projet', 'International cooperation — project leader', 'التعاون الدولي — رئيس مشروع') },
              { id: 'coopMembre', type: 'count', unit: 15, unitLabel: 'project', label: L('Coopération internationale — membre du projet', 'International cooperation — project member', 'التعاون الدولي — عضو في مشروع') },
              { id: 'pnrChef', type: 'count', unit: 20, unitLabel: 'project', label: L('Projet de recherche (PNR) — chef de projet', 'Research project (PNR) — project leader', 'مشروع بحث (PNR) — رئيس مشروع'),
                bonus: { unit: 5, limitToCount: true, label: L('dont sécurité énergétique / sanitaire / alimentaire (+5 pts chacun)', 'of which energy / health / food security (+5 pts each)', 'منها في الأمن الطاقوي / الصحي / الغذائي (+5 ن لكل مشروع)') } },
              { id: 'pnrMembre', type: 'count', unit: 10, unitLabel: 'project', label: L('Projet de recherche (PNR) — membre du projet', 'Research project (PNR) — project member', 'مشروع بحث (PNR) — عضو في مشروع'),
                bonus: { unit: 5, limitToCount: true, label: L('dont sécurité énergétique / sanitaire / alimentaire (+5 pts chacun)', 'of which energy / health / food security (+5 pts each)', 'منها في الأمن الطاقوي / الصحي / الغذائي (+5 ن لكل مشروع)') } }
            ]
          },
          {
            title: L('Autres activités scientifiques', 'Other scientific activities', 'نشاطات علمية أخرى'),
            items: [
              { id: 'expertise', type: 'count', unit: 5, cap: 10, unitLabel: 'part',
                label: L('Activités scientifiques (expertise de revues, d’ouvrages, de projets ; jurys de doctorat)', 'Scientific activities (reviewing for journals, books, projects; doctoral juries)', 'النشاطات العلمية (خبرة في المجلات والمطبوعات والكتب والمشاريع؛ لجان مناقشة الدكتوراه)') },
              { id: 'bureauEtudes', type: 'points', cap: 10,
                label: L('Activités des bureaux d’études ou filiales économiques (validées)', 'Consultancy offices or economic subsidiaries (validated)', 'المشاركة في نشاطات مكاتب الدراسات أو الفروع الاقتصادية للمؤسسات') },
              { id: 'startup', type: 'count', unit: 20, unitLabel: 'part',
                label: L('Création d’une start-up ou d’un projet innovant', 'Creating a start-up or innovative project', 'المشاركة في إنشاء مؤسسة ناشئة أو مشروع مبتكر') },
              { id: 'societe', type: 'count', unit: 5, cap: 10, unitLabel: 'part',
                label: L('Contribution à la société (culture scientifique et technique)', 'Contribution to society (science and technology outreach)', 'الإسهام في المجتمع (نشر الثقافة العلمية والتقنية)') },
              { id: 'vieUniv', type: 'count', unit: 5, cap: 10, unitLabel: 'part',
                label: L('Contribution à la vie universitaire (organes, projets pédagogiques et de recherche)', 'Contribution to university life (bodies, teaching and research projects)', 'الإسهام في الحياة الجامعية (الهيئات العلمية والبيداغوجية، إنجاز المشاريع)') },
              { id: 'prix', type: 'fixed', unit: 30,
                label: L('Prix, distinctions honorifiques et récompenses dans la spécialité', 'Prizes, honours and awards in the speciality', 'الحصول على جوائز وأوسمة شرفية ومكافآت في التخصص') },
              { id: 'orgIntl', type: 'fixed', unit: 30,
                label: L('Membre d’organismes scientifiques internationaux', 'Member of international scientific bodies', 'عضو في هيئات علمية دولية') }
            ]
          }
        ]
      },
      {
        id: 'functions', kind: 'functions',
        title: L('3. Fonctions et responsabilités administratives', '3. Administrative functions and responsibilities', '3. الوظائف والمسؤوليات الإدارية'),
        groups: [
          {
            title: L('Seule la responsabilité la mieux notée est prise en compte', 'Only the highest-scored responsibility is counted', 'تُحتسب المسؤولية الأعلى تنقيطاً فقط'),
            items: [
              { id: 'fonction', type: 'choice',
                label: L('Poste occupé', 'Position held', 'المنصب المشغول'),
                options: [
                  { value: 0, label: L('Aucun', 'None', 'لا شيء') },
                  { value: 10, label: L('A. Poste nommé par décret (10 pts)', 'A. Position appointed by decree (10 pts)', 'أ. منصب بموجب مرسوم (10 ن)') },
                  { value: 6, label: L('B. Poste nommé par arrêté ministériel (6 pts)', 'B. Position appointed by ministerial order (6 pts)', 'ب. منصب بموجب قرار وزاري (6 ن)') },
                  { value: 3, label: L('C. Poste nommé par décision du responsable de l’établissement (3 pts)', 'C. Position appointed by decision of the head of institution (3 pts)', 'ج. منصب بموجب مقرر من مسؤول المؤسسة (3 ن)') }
                ] }
            ]
          }
        ]
      }
    ],
    observations: [
      L('La publication d’un article est obligatoire, dans une revue classée « A+ », « A », « B » ou « C » et dans la même filière du candidat.', 'Publishing an article is mandatory, in an “A+”, “A”, “B” or “C” journal and in the candidate’s own field.', 'نشر مقال إلزامي في مجلة مصنفة «A+» أو «A» أو «B» أو «C» وفي نفس شعبة المترشح.'),
      L('Les articles publiés dans des revues ou chez des éditeurs prédateurs, ou non reconnus par la DGRSDT, ne sont pas acceptés.', 'Articles in predatory journals/publishers, or not recognised by the DGRSDT, are not accepted.', 'لا تُقبل المقالات المنشورة في مجلات أو لدى ناشرين مفترسين أو غير معترف بها من طرف المديرية العامة للبحث العلمي والتطوير التكنولوجي.'),
      L('Co-auteurs : 1ᵉʳ auteur 100 %, 2ᵉ auteur 50 %, 3ᵉ et plus 25 % (100 % pour tous dans les disciplines à ordre alphabétique).', 'Co-authors: 1st author 100 %, 2nd 50 %, 3rd and beyond 25 % (100 % for all in alphabetical-order disciplines).', 'ترتيب المؤلفين: المؤلف الأول 100%، الثاني 50%، الثالث فما فوق 25% (100% للجميع في التخصصات التي تعتمد الترتيب الأبجدي).'),
      L('L’organisation de colloques internationaux doit être validée par l’administration centrale du MESRS.', 'International conferences must be validated by the Ministry’s central administration.', 'يجب أن يُصادق على تنظيم الملتقيات الدولية من طرف الإدارة المركزية للوزارة.')
    ]
  };

  window.GRIDS = { '2026': G2026, '2028': G2028 };
})();
