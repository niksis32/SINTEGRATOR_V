import { useMemo } from 'react';
import { usePreferences } from '../contexts/PreferencesContext.jsx';

const DATA_RU = {
  /** Маршруты как в макетах `page/stitch_sintegrator_*` */
  navRoutes: [
    { path: '/', label: 'Главная' },
    { path: '/services', label: 'Услуги' },
    { path: '/industries', label: 'Отрасли' },
    { path: '/cases', label: 'Кейсы' },
    { path: '/about', label: 'О компании' },
    { path: '/contacts', label: 'Контакты' },
  ],

  /** `page/stitch_sintegrator_Отрасли` — вводная секция */
  industriesIntro: {
    eyebrow: 'Industry Expertise',
    titleLine1: 'Отраслевая экспертиза',
    titleAccent: 'в холодном металле',
    lead: 'Мы проектируем цифровые экосистемы с точностью станков с ЧПУ. Интеграция как искусство промышленной архитектуры.',
  },

  /** `page/stitch_sintegrator_Главная` */
  homePage: {
  hero: {
    eyebrow: 'Industrial Synthesis',
    title: 'СИНТЕГРАТОР',
    lead: 'Создание монолитных ИТ-экосистем для промышленных гигантов. Мы преобразуем фрагментированные данные в архитектурное превосходство.',
    bgImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBTO82tqUnJzswrlMJ22IYHMxs6lulRkKZ4iQgQgaoIYYalLEK4OTskyECOzcgbYg2vXvr6tqFEeYK9Wlkm4wCCCDqyrVoooT9G3NMSXH7W9ZMk3H7g9VACSXUkCxB4CUYWsQmwfmcKUz1v9aoo390Chicr6yNmR1MgnUFdMqkruhrPuwQGoHcTNve5y-JoYf8J4wf_4F7BhDSAjJa-MaRcC2lmp6rj9J2dzwUGWn2q_BxN11R1te9S3sNRQZSxZA5GYU4t1nVo0c25',
    primaryCta: 'Обсудить проект',
    secondaryCta: 'Архитектура решения',
  },
  spheres: {
    title: 'Сферы влияния',
    lead: 'Масштабируемые решения для критически важных отраслей экономики, где надежность является единственным стандартом.',
    cards: [
      {
        tag: 'Industry 4.0',
        title: 'Manufacturing',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuC1GhMkPIfYco3VQCLrU2qJK-Q19KqxG9LviJgMIr6rSWUv18E-49bnrqKUc1LBfxHBQTMvWNbJ-dJXFTqraAFfWJFDhETdgZptYaxJdvNJyOuiOFcxkf4xBBPk_1NgancqChF6pCIfdtDFkArHfhGa5UrMaxUvtpfsjENj9bQWlgZP9yp6-XzpBDXclLImwXa_O196TRJOSXjdqcV3d0z6ds3i3Q5Bl94-fJkbwYL93u-FsPLOmhTAG8DW9ylkWeq1kFkgYEoC007Z',
        alt: 'Manufacturing',
      },
      {
        tag: 'Supply Chain',
        title: 'Logistics',
        image:
          '/img/logistics.png',
        alt: 'Logistics',
      },
      {
        tag: 'Enterprise',
        title: 'B2B Systems',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDXNNYTzomdq8mSrEHqqlrVMYqkDhMSV8zL1FMxVIgc3A7iqSQKW5iV3f88y2_1rn6HokRjDDvYRdB0X6GwV2R5cTvNml5QH3a41z0PMTPg34pbXvMp8OHoEJBwTjNGqLiqUK9c6sIcOW4B_B7TfJ5-K3f77EuKdkMuhONepBksWR-f8CbEovHqpZvSpZB3lMsArGfaRYOZBEZxZhViBeQoC4UENiOl9_NOH3v-lsT6ceQohMjQVm_c5Jc_lO1Hf08T0_obTKzAxVnU',
        alt: 'B2B Enterprise Dashboard',
      },
    ],
  },
  chaos: {
    title: 'Борьба с хаосом: Инженерный подход',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCmFWRm6AlG6ebCnjsivFHxTUX20aUCbLv5W6lWtsYxu3a7269mkkf4wgXIuTck8b8lVaQcICt3w3Q7ABXdCJ4yOBibneZ6I8OKZGpnY-sLl0tN9YwRPY-B5AIRDbBOTjlhfRbD2-BNm8Xys4R7px_BZeU5eTwnM9EKz95h5PJBYNzffY6aApLx1f1IBT1FRKKVn8ipfhjzGp_WODp8R69F82RBuwBqE2SS5tcwv-Acnqm6YfL-UDQhzOhLFZ4Z2wOtS7o2-Mxf0HqM',
    chips: [
      { label: 'Fragmentation', text: 'Data Silos eliminated through unified protocol.' },
      { label: 'Human Factor', text: '98% error reduction via machine oversight.' },
    ],
    steps: [
      {
        num: '01',
        title: 'Фрагментация ресурсов',
        text: 'Разрозненные ИТ-решения создают слепые зоны. Мы объединяем их в единую консолидированную структуру управления.',
      },
      {
        num: '02',
        title: 'Человеческий фактор',
        text: 'Автоматизация процессов исключает критические ошибки на уровне архитектуры данных, гарантируя точность 24/7.',
      },
    ],
  },
  serviceModules: {
    title: 'Сервисные модули',
    cards: [
      {
        title: 'CRM',
        body: 'Интеллектуальное управление взаимоотношениями с клиентами в B2B секторе.',
        image:
          '/img/crm.png',
      },
      {
        title: 'ERP',
        body: 'Планирование ресурсов предприятия с точностью до миллисекунд.',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBTO82tqUnJzswrlMJ22IYHMxs6lulRkKZ4iQgQgaoIYYalLEK4OTskyECOzcgbYg2vXvr6tqFEeYK9Wlkm4wCCCDqyrVoooT9G3NMSXH7W9ZMk3H7g9VACSXUkCxB4CUYWsQmwfmcKUz1v9aoo390Chicr6yNmR1MgnUFdMqkruhrPuwQGoHcTNve5y-JoYf8J4wf_4F7BhDSAjJa-MaRcC2lmp6rj9J2dzwUGWn2q_BxN11R1te9S3sNRQZSxZA5GYU4t1nVo0c25',
      },
      {
        title: 'Doc Flow',
        body: 'Безбумажное производство и юридически значимый документооборот.',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCmFWRm6AlG6ebCnjsivFHxTUX20aUCbLv5W6lWtsYxu3a7269mkkf4wgXIuTck8b8lVaQcICt3w3Q7ABXdCJ4yOBibneZ6I8OKZGpnY-sLl0tN9YwRPY-B5AIRDbBOTjlhfRbD2-BNm8Xys4R7px_BZeU5eTwnM9EKz95h5PJBYNzffY6aApLx1f1IBT1FRKKVn8ipfhjzGp_WODp8R69F82RBuwBqE2SS5tcwv-Acnqm6YfL-UDQhzOhLFZ4Z2wOtS7o2-Mxf0HqM',
      },
      {
        title: 'Unified API',
        body: 'Бесшовная интеграция внешних сервисов в корпоративное ядро.',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDXNNYTzomdq8mSrEHqqlrVMYqkDhMSV8zL1FMxVIgc3A7iqSQKW5iV3f88y2_1rn6HokRjDDvYRdB0X6GwV2R5cTvNml5QH3a41z0PMTPg34pbXvMp8OHoEJBwTjNGqLiqUK9c6sIcOW4B_B7TfJ5-K3f77EuKdkMuhONepBksWR-f8CbEovHqpZvSpZB3lMsArGfaRYOZBEZxZhViBeQoC4UENiOl9_NOH3v-lsT6ceQohMjQVm_c5Jc_lO1Hf08T0_obTKzAxVnU',
      },
    ],
  },
  keyOffer: {
    titleLine1: 'Строим на века.',
    titleAccent: 'Без компромиссов.',
    lead: 'Наши системы не просто решают текущие задачи — они создают фундамент, который не потребует замены через десятилетие. Это инженерная клятва качества.',
    cta: 'Приступить к проектированию',
    bgImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDCUzcUknO1b6QcJq9QGjArIm61Fx2QmR0s3Y9f7m4Cq7pxkKtHRl0vDAWu1JQAzmFUZLjLBMCPJuvJdg8EBVzsw1DLX0Eb67BA3kgDu-L2MGipG7ikqqjhY8FcCpaARcFHHLJvTC-D-cz0mgAiChJ1C5WH7BgIjfpLHZsmzH_A6pEjFX8W1sCyluoBPxQs3ZdT6kpWzXWV-E7nI9qkOL2JvqPaz3Pxln7dy9EzD_6LGDvUYjo25KqnMtT66rf9YdA-6Vl81HiD7Aan',
  },
  portfolio: {
    title: 'Реализованные системы',
    lead: 'Портфолио проектов национального масштаба и технологических прорывов.',
    items: [
      {
        sector: 'Металлургия',
        title: 'SteelCore Integration',
        body: 'Объединение 12 заводов в единую аналитическую панель с прогнозированием сбоев на базе ИИ.',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuA3KDp6iBoQSudfpTk_vt4svyjSA8Va8J5YJL5r9ptJOuPCTk3aa1wbcs26pei_m6SbbqBgE35EI16oJZ4HjyC1C4HWaBvSUd59O1BOLZ4LX5WjeUw7GEYkX3bwUdztYk2TUiR33bplinlGPQqBxig-LakuuRbXc8HonqH5KWslrmDN3UohyiyBeaxYeYM8dsBedSm5RW8yajkqM3pmb1f5aGDOFvyJjixhEtwyrvxfhqwLYZwwgQ_qgjfhm-XhklJ7lk4JnBX-In9R',
      },
      {
        sector: 'Финтех',
        title: 'Nexus Transaction Layer',
        body: 'Система межбанковских расчетов с пропускной способностью 1М транзакций в секунду.',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAiYdBSScJVXfpjUqssI7ZYzRXTRcGlVasJB40QJ1bspuQkOSrHjCrnW3R-O5kTUkJAmBan-4ywkepBNfITiMPIOqCcELiFnjyviERFfxQ5iR8YP2uNFLN5mfIE8IFL9xexCdnUncM9pSjvUOuBY1PtJunQG2RtRalP_wlynSjP__p2K_Smk_9-ShINJ03wo5IewISSS092WIUrypeciBOm1-VdDsWOFkWk5nuDgUr-fXJpMOXY2dY0supa9joi1h94oWFahcAGkZCN',
      },
      {
        sector: 'Логистика',
        title: 'Orbit Supply Chain',
        body: 'Автоматизация складской логистики с использованием роевого интеллекта и RFID-меток.',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBp5MA60asTXoYGg7Usa4GM6aG49T4qpQCAUwbwXEiQ148D98UkZL1t9O_4WgEXL2HGyTGa3SKE56-uRG_D_leFvcukSclknlekX9Gh4pfIlouKwqPpC3WyXRokJmxskWUFhXH7iMHLzRbPds-C7e3SyFdw5qCCdqltgc8j4RO1K52LydkoeDjX0XsWNh9luH1WjWRgAb1RzuUdWzIjjc64NNdB0LaRzYsblbw2OLtIZQOmDatxBmjAbIVaMdJcEwq7Ds1irlsPQOZb',
      },
    ],
  },
  protocol: {
    title: 'Протокол интеграции',
    steps: [
      { icon: 'search_insights', title: 'Аудит', text: 'Глубокое сканирование существующей инфраструктуры и выявление уязвимостей.' },
      { icon: 'architecture', title: 'Проект', text: 'Создание цифрового двойника будущей системы и расчет нагрузок.' },
      { icon: 'precision_manufacturing', title: 'Синтез', text: 'Активная фаза внедрения и стыковки программных интерфейсов.' },
      { icon: 'rocket_launch', title: 'Запуск', text: 'Масштабирование на все узлы предприятия и обучение персонала.' },
    ],
  },
  closing: {
    titleLine1: 'Ваш проект —',
    titleLine2: 'наша ответственность.',
    lead: 'Готовы обсудить архитектуру вашего следующего большого шага?',
    emailPlaceholder: 'Email предприятия',
    cta: 'Запросить аудит',
  },
  },

  industriesMeta: {
    title: 'ПРОТОКОЛ ОТРАСЛЕЙ',
    watermark: 'DOMAINS',
  },

  industryBlocks: {
  manufacturingImage:
    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBkZdtq2c5CyUtVf8897tyt9u9HUWy_nFUSKrsU-HIaeZjleoL1Ba6SdTCDRMc5cLOeLWf86nHCb1X0WkTOcrulc3A2xAISDLLos1zAQsdXOU0UFTlqMkKD_l_mF3Yp8CP7o-HH_aUyvcn3wsNldUNNeBvksyAD6EZhdj1gZUGScPAmHvF2Kq_ZXxfb55tkeqS7laeU3D2nRNqADGGBrF8jOy3E0AuV21e02DS33PYhIAUArWaPKF3gU_B1qUAMMZZTgpvwuFOee6hN')",
  logisticsImage:
    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDUyXhUpLr0spEHGpD78tIqpt56htyaQM6ErHMjXhmd2l0h5oFFOT8WogM0lYXcB8ooQOyEbLGB8cDGV0n7BeV7r0fSwd0dORbNJCUbTaV-QJkhOm-N8sUekELDoqN1Pfghe9Ivqlk9AotLKJTH1xdFJcZUtFFZlNkDbJeVSzmpfDtNwB94czfqdCDKG5Y3a-xksWMJtQlYLyIEBd3ZZ7jAj1WE-HvQJeDt2ykJ1Qq1WaW9VFa0Bl2IEdFO46Ajuv2_OInvhu00YFmY')",
  },

  methodologySteps: [
    ['01', 'Аудит инфраструктуры'],
    ['02', 'Проектирование ядра'],
    ['03', 'Бесшовная миграция'],
  ],

  methodologyIntro: {
    title: 'Методология внедрения',
    text: 'Наш подход базируется на «Архитектурной жесткости» — каждый модуль системы проходит 4 уровня тестирования под нагрузкой.',
    tags: ['Reliability First', 'Zero Downtime', 'Scale Ready'],
  },

  servicesHero: {
  eyebrow: 'Industrial Excellence',
  title: 'Бизнес-ценность',
  titleAccent: 'технологий',
  lead: 'Проектируем и внедряем отказоустойчивые цифровые экосистемы для крупного бизнеса. Переводим техническую сложность в операционную эффективность.',
  uptime: '99.9%',
  uptimeLabel: 'Uptime Service Level',
  heroImage:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC_ptym7yjuI0HY7_M9wjtpx5TROBCpZrelthPDIdFXLhTbQQ60wXXjw4Cadh_QICFx9bBNE2_KbBH754lZ999Fo2Z5Iu_9cM4iH61kRAl2MLkf7FpaBj32danvkz6wzi9GrllRTda3wlI4QNYjDCNg1SM5hzjmMeeuaUwfD92q9EKzu9jgd4bKtxlIMJqXBLiHSyIspubU0cka_32rg0BryH4wkL6stxqRLvA9fVkN6TH5_8SU1i_aftWYcQpupemwy7DD2xw20S-o',
  },

  servicesBento: [
  {
    span: 'large',
    variant: 'milled',
    icon: 'account_tree',
    index: '01 / Integration',
    title: 'Интеграция Bitrix24 и 1С ERP',
    body: 'Создаем бесшовный обмен данными между фронт-офисом и производством. Автоматизация сквозных бизнес-процессов от лида до отгрузки.',
    meta: [
      { label: 'Техстек', value: 'SOAP/REST, RabbitMQ, Enterprise Service Bus' },
      { label: 'Результат', value: 'Снижение издержек на ввод данных на 40%' },
    ],
    iconFilled: true,
  },
  {
    span: 'small',
    variant: 'inverse',
    icon: 'hub',
    title: 'CRM для сложных продаж',
    body: 'Разработка кастомных воронок для B2B с циклом сделки от 6 месяцев. Прогностическая аналитика и скоринг.',
    link: 'Explore Solution',
    iconFilled: false,
  },
  {
    span: 'small',
    variant: 'milled',
    icon: 'api',
    title: 'API-интеграции',
    body: 'Разработка высоконагруженных API-шлюзов для объединения разрозненных сервисов в единый контур.',
    chips: ['Microservices', 'Scalable'],
    iconFilled: false,
  },
  {
    span: 'large',
    variant: 'media',
    bgImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDqSIFXkZJcD52w8ThOh5vhuigkjPYlSwvVSgi4EKV4BHC1CImrffkB3EDYy_nwp4WqV4RAl_izhcmuCm1cDFPhcgGOGw_7qeAXwdJrIaYF07U2MO76-o9P34ePqcr5tGjfEStispBN-njsuBGMJTQkbFb_hngHjpIUmItGAS8tIJjX08_YuaJSBAtrqJQTaEnDaXPEjwH7O1O7NFCQRjsqylYzBj8mawAHzbkK8Qfl2XyNkpbFGxY1mkY15k9nhnnZPKH3lLx_o7bv',
    title: 'B2B Порталы',
    body: 'Личные кабинеты для дилеров и партнеров. Онлайн-заказы, складские остатки в реальном времени и документооборот.',
    stats: [
      { value: '24/7', label: 'Self-Service' },
      { value: '-30%', label: 'Manager Load' },
    ],
  },
  ],

  architectureBlueprint: {
  eyebrow: 'Blueprint',
  title: 'Архитектура решений',
  columns: [
    { icon: 'dns', title: 'Core Systems', text: 'ERP, Warehouse, Legacy Databases', highlight: false },
    {
      icon: 'sync_alt',
      title: 'Sintegrator Layer',
      text: 'Logic, Data Mapping, Security Gateways',
      highlight: true,
    },
    { icon: 'devices', title: 'Client Access', text: 'CRM, Mobile App, Partner Portal', highlight: false },
  ],
  },

  casesHero: {
  eyebrow: 'Case Portfolio',
  title: 'Проекты',
  accent: 'высокого',
  titleLine2: 'влияния',
  lead: 'Мы создаем цифровые монолиты — системы, которые переопределяют эффективность производственных и логистических цепочек. Каждый кейс — это прецизионная инженерная работа.',
  stats: [
    { value: '124+', label: 'Успешных интеграций' },
    { value: '40%', label: 'Средний рост KPI' },
  ],
  },

  caseIndustrial: {
  label: 'CASE #001 / INDUSTRIAL',
  title: 'Производственное предприятие: Цифровая вертикаль',
  body: 'Синхронизация ERP с цеховым уровнем (MES) в условиях 24/7. Внедрение шины данных на базе кастомного брокера сообщений.',
  image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB7DPeE1tBxoVJokWNkGrS_2FitfUuUzO8botOUWM3wqb8vASBXFmedZbODtnukz43XTW8Y69R6iLWCwhHAg4VF_sFbdqYaG_Zt6GC8gMcts0f3p1UxgiOAKle1VoxK1kb3HGuk4mBST4HarYZ5JKL2QYy9cGZoTDj-Gcwnfrq4lOJMe0ZiUJ8u0Iy5x93qFVaUfgr3NSgD9eeb6RmMM8O1E3XMVPGeI6F5Q4w1twm1DTt9Yoedj-EoHaYbdtyLg9Ol5ikXmfLsB5V9',
  metrics: [
    { value: '+28%', label: 'Скорость' },
    { value: '-15%', label: 'Брак' },
    { value: '9 мес', label: 'ROI' },
  ],
  },

  caseLogistics: {
  label: 'CASE #002 / LOGISTICS',
  title: 'Логистическая компания: Масштабируемая экосистема',
  body: 'Трансформация разрозненных складских терминалов в единый управляемый контур. Мы внедрили систему реального времени, которая оркестрирует сотни автономных узлов.',
  image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCIMpSY4RAEkHcWM7tK8khSBhKQ_94HOM67AH1MIpN8T0objnVIR67cC-XX1w_W_MjQ-sG5cjtvusryzarStGN4vymcB06hC9jNV3I2LFwZ2m_VV7xWO5G_v4Ou2R--bXrSd-BuBwsR6xzRJcWmLChCqSTmJGr6bP4cLeZGpEMDU6c6FsKVVOvoKJkvMWzcJvlfnzycUBxIZa8lCj1e873-ROJjZ2lJdT52eHlwV-TxP1_Iaqv5xqc9OhwZ_DfsaMd-PN88zJYfYmtz',
  stat: { value: '99.8%', label: 'WMS Inventory Accuracy' },
  legacyItems: ['Локальные базы данных', 'Задержка данных 4 часа'],
  synthItems: ['Cloud-Native кластер', 'Real-time аналитика'],
  },

  /** `page/stitch_sintegrator_Кейсы` — финальный CTA */
  casesFinalCta: {
  line1: 'Ваш проект —',
  accent: 'следующий',
  line2: 'в списке',
  body: 'Мы беремся за задачи, которые другие считают невозможными. Оставьте заявку на глубокий аудит вашей текущей архитектуры.',
  primaryLabel: 'Начать сотрудничество',
  secondaryLabel: 'Получить презентацию',
  image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAfgFLdfRGesawZQayI0xMnWGTEm4b9G91Rp4-7ssJQjgHojNq6886S3VMchlZ-VWYJGkaUVaIc7i7tUWRLGpI5MNFQe5sqssTG4n_qKmZHXHQi_fB8fCHPufrzAtRJao8947wUlo3gRRKNi9ra1nXbIuebAZ4ZdTH8nzeoqQknVdPb-FOyOOmW9g5mg8eU0niUFHnt_VddMlwmo6OtKfbg_p3_B1QpWZWh__MJOdtjGMOZsKDDtokflsXfFwna-td8vS4fSfou0leV',
  },

  testimonials: {
  eyebrow: 'Голоса индустрии',
  title: 'Репутация, подтвержденная кодом',
  items: [
    {
      quote:
        'Синтегратор не просто настроил обмен данными, они создали фундамент, на котором мы теперь строим всю стратегию развития производства на 5 лет вперед.',
      name: 'Александр В.',
      role: 'Технический директор, ПромСплав',
    },
    {
      quote:
        'Интеграция прошла без остановки операционных процессов. Команда проявила высочайший уровень планирования и экспертизы в сложных узлах.',
      name: 'Мария С.',
      role: 'COO, ГлобалЛогистик',
    },
    {
      quote:
        'Единственные партнеры, которые говорят на языке бизнеса и архитектуры одновременно. Результаты превзошли наши финансовые ожидания.',
      name: 'Игорь Д.',
      role: 'Основатель, ТехноПоток',
    },
  ],
  },

  aboutHero: {
  image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAHyk9BxjlJApO2UvKVIw56v6z9hO_7xNvwp9FLdpyR3PaXCU8I8rjCVHBDG8KTGcEFb2XBA-5l_uVDpATc84Gl2hSAz8Dc_7uHejG28FORjJuE219X4V-zIOFrP9etA3yZnP0SDOFhErjxYtaBq38JUjzqGHN9IXi8mPNPZQBMJPj6YlnGw9X14j9yWbS2u4faOmd-GSMvkaCpeLUP6dyLmaYoBaQ-XOvvMx6Bdv7ChEaOl6u0tp6qCtaJZ8Q9CMNFwf-OoyCcz9Hp',
  eyebrow: 'Фундаментальность и Инновации',
  title: 'Архитектура будущего',
  lead: 'Создаем технологический фундамент для глобальных лидеров. Мы превращаем инженерную точность в цифровую реальность.',
  metrics: [
    { value: '15+', label: 'Лет опыта' },
    { value: '400+', label: 'Проектов' },
  ],
  },

  aboutTimeline: {
  title: 'История становления',
  items: [
    { year: '2009', title: 'Основание', text: 'Запуск первого инженерного бюро в области системной интеграции.' },
    { year: '2014', title: 'Масштабирование', text: 'Выход на международный рынок и сертификация по стандартам ISO.' },
    { year: '2019', title: 'R&D Центр', text: 'Открытие собственной лаборатории для разработки инновационных ИТ-решений.' },
    { year: '2024', title: 'Экосистема', text: 'Формирование полноценной технологической экосистемы Синтегратор.' },
  ],
  },

  aboutValues: {
  title: 'Ценности, отлитые в стали',
  lead: 'Наши принципы — это не просто слова, а жесткие инженерные стандарты, которым мы следуем в каждом узле системы.',
  cards: [
    {
      variant: 'light',
      icon: 'shield',
      title: 'Надежность',
      body: 'Системы с отказоустойчивостью 99.99%. Мы проектируем решения, которые выдерживают любые нагрузки.',
      filled: true,
    },
    {
      variant: 'high',
      icon: 'precision_manufacturing',
      title: 'Точность',
      body: 'Выверенность каждого алгоритма. Мы исключаем человеческий фактор через глубокую автоматизацию.',
      filled: true,
    },
    {
      variant: 'high',
      icon: 'hub',
      title: 'Системность',
      body: 'Комплексный взгляд на архитектуру предприятия. Единство всех компонентов в общей структуре.',
      filled: false,
    },
    {
      variant: 'accent',
      icon: 'bolt',
      title: 'Скорость',
      body: 'Мгновенная реакция на изменения рынка и оперативное внедрение сложнейших технологических стеков.',
      filled: true,
    },
  ],
  },

  /** `page/stitch_sintegrator_О компании` — команда */
  aboutTeam: {
  eyebrow: 'Интеллектуальный капитал',
  title: 'Наши Архитекторы',
  members: [
    {
      name: 'Александр Волков',
      role: 'Главный инженер проектов',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCibQnUczyV5ZqGZ2tpLQmAuHR9EcC0nTuQz6-dPjCSlsKuszx6-1YDI6IE2ayy5Ef8_pS2TfR5j-Ifm1c8fZlt1T5N1Jk-tEIJCJd2P1sk1mL_QSNI4XWGP1ZfMGhaOmlPXTx1tGeq1vRJ0sLErOTA42x2tjuiU89WQPEiT4C40-MuBiCBfTVVT2TZ1HOd4YEE7TLT7ifwxSXkFPpblX3jaTxlP1DV_HUXDwkyZXbU9mWMgE4bQMJakAaiVi2hPOu-Xq5-iD0qqKfo',
    },
    {
      name: 'Елена Соколова',
      role: 'Ведущий ИТ-архитектор',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD1dhnF_SsqBjV3Qjzb61_BsIRBs03Bj3v9wQ7ValmCEnJjphqShoT7wOY7m4GOrjluWu3_ARcHgRYr0WLsR2xn8gpiyQ7EdJfRLrXJs9mKG20D63ZXPHm-VvBZAjMKkKtpBFyMQzYSVFGD1NFni3j6OZTb7m1lXFfiZFTHG8V6VOSFGprim6OwUq19K46qeziAwsYvKFlUgaKVNgnrNJc_LOBHm1Z7_kw_IJPZgRDyxs9KdqcHGEJZrGYQ1_Ch-W8M7lBlu3PQ6k5M',
    },
    {
      name: 'Дмитрий Морозов',
      role: 'Технический директор',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCOjWSrFZ8p0XUfXjSOleC9GmuVKnMaIRyT8mvU1dx6ljxme4I4NZX6nVtJUc5FiDl8d1HTzaGIoejlDgnj4Xoj6CgoV0dSY9KPYSDtosiTyVrML3E45fkJqBfuNijRvUU0jfB076fLMT_hwsTZNjcvAfW14Vw6s3vg4zjJtI77nMN0RLNJRwbISalKqOlN5r6_aWn61HVmJ0A1tRQOZBAfBFum5Z0hFEWfMymH2WyryG-ddzWOWeKVSHKn0Nvb-L4nDc8isomnG_th',
    },
  ],
  },

  /** `page/stitch_sintegrator_О компании` — лицензии */
  aboutLicenses: {
  title: 'Лицензии и стандарты',
  lead: 'Мы обладаем всеми необходимыми государственными и международными допусками для реализации проектов любой категории сложности, включая критическую инфраструктуру.',
  items: [
    {
      icon: 'verified',
      title: 'ISO 9001:2015',
      text: 'Международный стандарт менеджмента качества',
    },
    {
      icon: 'gpp_good',
      title: 'Лицензия ФСТЭК',
      text: 'На деятельность по технической защите информации',
    },
  ],
  docImages: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA3jEeNlhz0N1Z8K85kLiWitWa4EdXd8exQqieW77bpnZidharFs9eBAxFV3rGr4m_Job4cOMc5ZI5GLsHKZaXCifa0CrJDEnkKCo1GOSxgbdzJ7hKobCU_It9kMFbpdg_ubQdLEQFz1SAPkCDAaLtFtqSsHn_XA_nXw-lRynu26-X-xX6Kwp0xHCP4BrXgeYBoFhRKX6FbxjNCqQxUqYRzqY7d_O1y_2Q3w6Xb7UJ1xCgCcb155Eh22MZgk3ZDmhqBYbGERXtsU9xk',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDA4WD_kE8f3N6MoZufl_dwfarfwlv741MzzpS7Vf2wedaSe_yna2p9MxtvP2b5VGnxduTw_saUjgmDR4chx1ODAbVRGs3z-H500FcFnfKMig-zKVSP7D6u9D2v3FNN7Rm1vwukMbqSkoTDOhyD0hh0OrvMXhuIvKTIM3X3Otlx2xxd9YOrfdWEF_IVpQ8xI4U3mSAt8kgGaZWE0Bxub8M5WcI0fGPkNsUAqi2EL-MqyzBLheGd--dHUBBK_eurK22O1N0U6Fq4T-FC',
  ],
  },

  ctaBeforeContact: {
  line1: 'Готовы закалить',
  accent: 'свой бизнес в цифре?',
  body: 'Получите индивидуальную архитектурную карту решения для вашей отрасли в течение 48 часов.',
  primaryLabel: 'Запросить консультацию',
  secondaryLabel: 'Скачать презентацию',
  image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBexToGP45-78oW8ITLg4C60k62TOunqsxnhX2GEDHBDFxPOed7XVxo7RHmuZHrj4z5XzZr7k2uBJpmf9OVytFX-l-wvS-vzh0VPZ-Yf3iqbNlKWNu8rz80yC8VdLWTU1h6KruCY3pGadSh85QUkDafnve6VuT4_Huk_87avYTZkGan1JhoRnFu0aKWPtS5nIpd9gd0_AZ1OuFNp0lllBAjGkyAEfma24j7hRQ4UCWORdxUfP2KgX-GXNzRopYCj5WruOOC1HieKmDc',
  },

  ctaAfterServices: {
  line1: 'Готовы к цифровой',
  accent: 'трансформации?',
  body:
    'Обсудите вашу задачу с экспертами. Мы подготовим первичный технический аудит и предложим архитектуру решения в течение 3-х рабочих дней.',
  primaryLabel: 'Запросить консультацию',
  secondaryLabel: 'Портфолио проектов',
  image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAfgFLdfRGesawZQayI0xMnWGTEm4b9G91Rp4-7ssJQjgHojNq6886S3VMchlZ-VWYJGkaUVaIc7i7tUWRLGpI5MNFQe5sqssTG4n_qKmZHXHQi_fB8fCHPufrzAtRJao8947wUlo3gRRKNi9ra1nXbIuebAZ4ZdTH8nzeoqQknVdPb-FOyOOmW9g5mg8eU0niUFHnt_VddMlwmo6OtKfbg_p3_B1QpWZWh__MJOdtjGMOZsKDDtokflsXfFwna-td8vS4fSfou0leV',
  },

  contactPage: {
  title: 'Свяжитесь\nс нами',
  lead: 'Мы создаем технологическую основу для вашего бизнеса. Давайте обсудим, как наши решения могут масштабировать ваш успех.',
  phone: '+7 (495) 000-00-00',
  email: 'hello@sintegrator.pro',
  address: 'Москва, ул. Технологий, 42',
  locations: [
    { city: 'Санкт-Петербург', line: 'Наб. Цифровизации, д. 15, офис 302' },
    { city: 'Екатеринбург', line: 'БЦ «Инновация», ул. Кода, 88' },
    { city: 'Астана', line: 'Пр. Будущего, 12, Технопарк' },
  ],
  formTitle: 'Новый проект?',
  mapImage:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBg8khFdiEVpJMPdwfj10xhHxs2ClgPFpxsYB03MXQ7oPyAtv0EL7meByZ1viznbvimcKq3dfxmT-at2JqtKsOkeYuQRvXcKASezRhhniBju7yrSyRFOwCDHFxcIZrp-dFOkIKXuBZ8y0Jalvizwbh_PvGjbHBEInP5ZqoZWj01QMDjtPMoC065NN8BmHOg27b3bVgiX6Uq88DVIOqtBd9VfzdyjRFtmB6WJDyoD4e6pITDVHymDSxWhUXMurzz4PSaa0l6jw6rhjvL',
  },

  footer: {
    brandName: 'Синтегратор',
    headings: {
      services: 'Услуги',
      company: 'Компания',
      legal: 'Юридическая информация',
    },
    description: 'Профессиональные решения в области системной интеграции и разработки ПО для бизнеса.',
    services: ['Интеграция 1С', 'Внедрение CRM', 'B2B Разработка', 'Консалтинг'],
    company: [
      { label: 'О компании', path: '/about' },
      { label: 'Кейсы', path: '/cases' },
      { label: 'Контакты', path: '/contacts' },
      { label: 'Карьера', path: '/contacts' },
    ],
    legal: [
      { label: 'Политика конфиденциальности', path: '/contacts' },
      { label: 'Условия использования', path: '/contacts' },
    ],
    address: 'Москва, Пресненская набережная, 12',
    phone: '+7 (495) 000-00-00',
    bottom: {
      rights: 'Все права защищены.',
      socials: [
        { label: 'LinkedIn', path: '/contacts' },
        { label: 'Telegram', path: '/contacts' },
      ],
    },
  },
};

const DATA_EN = {
  ...DATA_RU,
  navRoutes: [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/industries', label: 'Industries' },
    { path: '/cases', label: 'Cases' },
    { path: '/about', label: 'About' },
    { path: '/contacts', label: 'Contact' },
  ],
  industriesIntro: {
    eyebrow: 'Industry Expertise',
    titleLine1: 'Industry expertise',
    titleAccent: 'for cold steel',
    lead: 'We design digital ecosystems with CNC-grade precision. Integration as industrial architecture.',
  },
  homePage: {
    ...DATA_RU.homePage,
    hero: {
      ...DATA_RU.homePage.hero,
      title: 'SINTEGRATOR',
      lead: 'Monolithic IT ecosystems for industrial leaders. We turn fragmented data into architectural advantage.',
      primaryCta: 'Discuss project',
      secondaryCta: 'Solution blueprint',
    },
    spheres: {
      ...DATA_RU.homePage.spheres,
      title: 'Domains of impact',
      lead: 'Scalable solutions for mission-critical industries where reliability is the only standard.',
    },
    chaos: {
      ...DATA_RU.homePage.chaos,
      title: 'Fighting chaos: an engineering approach',
      steps: [
        {
          num: '01',
          title: 'Resource fragmentation',
          text: 'Disconnected IT solutions create blind spots. We consolidate them into a single, controlled management structure.',
        },
        {
          num: '02',
          title: 'Human factor',
          text: 'Process automation removes critical errors at the data-architecture level, ensuring 24/7 accuracy.',
        },
      ],
    },
    serviceModules: {
      ...DATA_RU.homePage.serviceModules,
      title: 'Service modules',
      cards: [
        { ...DATA_RU.homePage.serviceModules.cards[0], body: 'Intelligent customer relationship management for B2B.' },
        { ...DATA_RU.homePage.serviceModules.cards[1], body: 'Enterprise resource planning with millisecond-level precision.' },
        { ...DATA_RU.homePage.serviceModules.cards[2], body: 'Paperless production and legally significant document workflows.' },
        { ...DATA_RU.homePage.serviceModules.cards[3], body: 'Seamless integration of external services into the corporate core.' },
      ],
    },
    keyOffer: {
      ...DATA_RU.homePage.keyOffer,
      titleLine1: 'Built to last.',
      titleAccent: 'No compromises.',
      lead: "Our systems don’t just solve today’s tasks — they create a foundation that won’t need replacement for decades. That’s an engineering pledge of quality.",
      cta: 'Start architecture',
    },
    portfolio: {
      ...DATA_RU.homePage.portfolio,
      title: 'Delivered systems',
      lead: 'A portfolio of national-scale projects and technological breakthroughs.',
      items: [
        { ...DATA_RU.homePage.portfolio.items[0], sector: 'Metallurgy', body: 'Unified 12 plants into a single analytics cockpit with AI-driven failure prediction.' },
        { ...DATA_RU.homePage.portfolio.items[1], sector: 'FinTech', body: 'Interbank settlement layer with throughput up to 1M transactions per second.' },
        { ...DATA_RU.homePage.portfolio.items[2], sector: 'Logistics', body: 'Warehouse automation using swarm intelligence and RFID tracking.' },
      ],
    },
    protocol: {
      ...DATA_RU.homePage.protocol,
      title: 'Integration protocol',
      steps: [
        { icon: 'search_insights', title: 'Audit', text: 'Deep scan of the current landscape and weak-point discovery.' },
        { icon: 'architecture', title: 'Design', text: 'A digital twin of the future system plus load calculations.' },
        { icon: 'precision_manufacturing', title: 'Synthesis', text: 'Implementation and interface stitching phase.' },
        { icon: 'rocket_launch', title: 'Launch', text: 'Scale across the enterprise and train the team.' },
      ],
    },
    closing: {
      ...DATA_RU.homePage.closing,
      titleLine1: 'Your project —',
      titleLine2: 'our responsibility.',
      lead: 'Ready to discuss the architecture of your next big step?',
      emailPlaceholder: 'Corporate email',
      cta: 'Request audit',
    },
  },
  industriesMeta: {
    ...DATA_RU.industriesMeta,
    title: 'INDUSTRY PROTOCOL',
  },
  methodologySteps: [
    ['01', 'Infrastructure audit'],
    ['02', 'Core design'],
    ['03', 'Seamless migration'],
  ],
  methodologyIntro: {
    ...DATA_RU.methodologyIntro,
    title: 'Implementation methodology',
    text: 'Our approach is based on “architectural rigidity” — every module passes 4 levels of load testing.',
  },
  servicesHero: {
    ...DATA_RU.servicesHero,
    title: 'Business value',
    titleAccent: 'of technology',
    lead: 'We design and deliver fault-tolerant digital ecosystems for enterprise. We turn technical complexity into operational efficiency.',
  },
  servicesBento: DATA_RU.servicesBento.map((c) => {
    if (c.title === 'Интеграция Bitrix24 и 1С ERP') {
      return {
        ...c,
        title: 'Bitrix24 ↔ 1C ERP integration',
        body: 'We build seamless data exchange between front-office and production. End-to-end automation from lead to shipment.',
        meta: [
          { label: 'Stack', value: 'SOAP/REST, RabbitMQ, Enterprise Service Bus' },
          { label: 'Outcome', value: '40% reduction in manual data entry' },
        ],
      };
    }
    if (c.title === 'CRM для сложных продаж') {
      return { ...c, title: 'CRM for complex sales', body: 'Custom B2B pipelines with 6+ month cycles. Predictive analytics and scoring.', link: 'Explore solution' };
    }
    if (c.title === 'API-интеграции') {
      return { ...c, title: 'API integrations', body: 'High-load API gateways to unite fragmented services into a single contour.' };
    }
    if (c.title === 'B2B Порталы') {
      return { ...c, title: 'B2B portals', body: 'Partner self-service: online orders, real-time stock, and document workflow.', stats: c.stats };
    }
    return c;
  }),
  architectureBlueprint: {
    ...DATA_RU.architectureBlueprint,
    title: 'Solution architecture',
    columns: [
      { icon: 'dns', title: 'Core systems', text: 'ERP, Warehouse, Legacy Databases', highlight: false },
      { icon: 'sync_alt', title: 'Sintegrator layer', text: 'Logic, Data Mapping, Security Gateways', highlight: true },
      { icon: 'devices', title: 'Client access', text: 'CRM, Mobile App, Partner Portal', highlight: false },
    ],
  },
  casesHero: {
    ...DATA_RU.casesHero,
    title: 'Projects',
    accent: 'high',
    titleLine2: 'impact',
    lead: 'We build digital monoliths — systems that redefine efficiency across production and logistics. Each case is precision engineering.',
    stats: [
      { value: '124+', label: 'Successful integrations' },
      { value: '40%', label: 'Average KPI growth' },
    ],
  },
  caseIndustrial: {
    ...DATA_RU.caseIndustrial,
    title: 'Manufacturing: a digital vertical',
    body: 'ERP-to-shopfloor (MES) synchronization in 24/7 mode. A data bus built on a custom message broker.',
    metrics: [
      { value: '+28%', label: 'Speed' },
      { value: '-15%', label: 'Defects' },
      { value: '9 mo', label: 'ROI' },
    ],
  },
  caseLogistics: {
    ...DATA_RU.caseLogistics,
    title: 'Logistics: a scalable ecosystem',
    body: 'From fragmented warehouse terminals to a single managed contour. Real-time orchestration for hundreds of autonomous nodes.',
    legacyItems: ['Local databases', '4-hour data delay'],
    synthItems: ['Cloud-native cluster', 'Real-time analytics'],
  },
  casesFinalCta: {
    ...DATA_RU.casesFinalCta,
    line1: 'Your project —',
    accent: 'next',
    line2: 'on the list',
    body: 'We take on challenges others consider impossible. Leave a request for a deep audit of your current architecture.',
    primaryLabel: 'Start collaboration',
    secondaryLabel: 'Get presentation',
  },
  testimonials: {
    ...DATA_RU.testimonials,
    eyebrow: 'Industry voices',
    title: 'Reputation proven by code',
    items: [
      {
        quote:
          'Sintegrator didn’t just set up data exchange — they built a foundation we now use to drive our production strategy for the next 5 years.',
        name: 'Alexander V.',
        role: 'CTO, PromSplav',
      },
      {
        quote:
          'The integration went live with zero downtime. The team showed exceptional planning and expertise in complex system nodes.',
        name: 'Maria S.',
        role: 'COO, GlobalLogistic',
      },
      {
        quote:
          'The only partners who speak the language of business and architecture at the same time. The results exceeded our financial expectations.',
        name: 'Igor D.',
        role: 'Founder, TechnoPotok',
      },
    ],
  },
  aboutHero: {
    ...DATA_RU.aboutHero,
    eyebrow: 'Fundamentals & Innovation',
    title: 'Architecture of the future',
    lead: 'We build the technological foundation for global leaders — turning engineering precision into digital reality.',
    metrics: [
      { value: '15+', label: 'Years of experience' },
      { value: '400+', label: 'Projects delivered' },
    ],
  },
  aboutTimeline: {
    ...DATA_RU.aboutTimeline,
    title: 'How it started',
    items: [
      { year: '2009', title: 'Founded', text: 'Launched the first engineering bureau in systems integration.' },
      { year: '2014', title: 'Scaling', text: 'Entered international markets and obtained ISO certifications.' },
      { year: '2019', title: 'R&D Center', text: 'Opened an in-house lab for innovative IT solutions.' },
      { year: '2024', title: 'Ecosystem', text: 'Formed a full-fledged Sintegrator technology ecosystem.' },
    ],
  },
  aboutValues: {
    ...DATA_RU.aboutValues,
    title: 'Values forged in steel',
    lead: 'Our principles are not just words — they are strict engineering standards we follow in every system node.',
    cards: [
      { ...DATA_RU.aboutValues.cards[0], title: 'Reliability', body: '99.99% fault tolerance. We design systems that withstand any load.' },
      { ...DATA_RU.aboutValues.cards[1], title: 'Precision', body: 'Algorithmic exactness. We reduce human error through deep automation.' },
      { ...DATA_RU.aboutValues.cards[2], title: 'System thinking', body: 'A holistic view of enterprise architecture. One structure for all components.' },
      { ...DATA_RU.aboutValues.cards[3], title: 'Speed', body: 'Fast reaction to change and rapid delivery of complex stacks.' },
    ],
  },
  aboutTeam: {
    ...DATA_RU.aboutTeam,
    eyebrow: 'Intellectual capital',
    title: 'Our architects',
    members: [
      { ...DATA_RU.aboutTeam.members[0], role: 'Principal project engineer' },
      { ...DATA_RU.aboutTeam.members[1], role: 'Lead IT architect' },
      { ...DATA_RU.aboutTeam.members[2], role: 'CTO' },
    ],
  },
  aboutLicenses: {
    ...DATA_RU.aboutLicenses,
    title: 'Licenses & standards',
    lead: 'We hold all necessary state and international approvals for projects of any complexity, including critical infrastructure.',
    items: [
      { ...DATA_RU.aboutLicenses.items[0], text: 'International quality management standard' },
      { ...DATA_RU.aboutLicenses.items[1], text: 'For technical information security activities' },
    ],
  },
  ctaBeforeContact: {
    ...DATA_RU.ctaBeforeContact,
    line1: 'Ready to temper',
    accent: 'your business in digital?',
    body: 'Get a tailored solution architecture map for your industry within 48 hours.',
    primaryLabel: 'Request consultation',
    secondaryLabel: 'Download deck',
  },
  ctaAfterServices: {
    ...DATA_RU.ctaAfterServices,
    line1: 'Ready for digital',
    accent: 'transformation?',
    body: 'Discuss your challenge with our experts. We’ll prepare an initial technical audit and architecture within 3 business days.',
    primaryLabel: 'Request consultation',
    secondaryLabel: 'Project portfolio',
  },
  contactPage: {
    ...DATA_RU.contactPage,
    title: 'Contact\nus',
    lead: 'We build the technological backbone for your business. Let’s discuss how our solutions can scale your success.',
    address: 'Moscow, Technologies St., 42',
    locations: [
      { city: 'Saint Petersburg', line: 'Digitalization Emb., 15, office 302' },
      { city: 'Yekaterinburg', line: 'Innovation BC, Code St., 88' },
      { city: 'Astana', line: 'Future Ave., 12, Tech Park' },
    ],
    formTitle: 'New project?',
  },
  footer: {
    ...DATA_RU.footer,
    brandName: 'Sintegrator',
    headings: { services: 'Services', company: 'Company', legal: 'Legal' },
    description: 'Professional systems integration and software development for business.',
    services: ['1C integration', 'CRM implementation', 'B2B development', 'Consulting'],
    company: [
      { label: 'About', path: '/about' },
      { label: 'Cases', path: '/cases' },
      { label: 'Contact', path: '/contacts' },
      { label: 'Careers', path: '/contacts' },
    ],
    legal: [
      { label: 'Privacy policy', path: '/contacts' },
      { label: 'Terms of use', path: '/contacts' },
    ],
    bottom: {
      rights: 'All rights reserved.',
      socials: [
        { label: 'LinkedIn', path: '/contacts' },
        { label: 'Telegram', path: '/contacts' },
      ],
    },
  },
};

export function getSiteData(lang) {
  return lang === 'en' ? DATA_EN : DATA_RU;
}

export function useSiteData() {
  const { lang } = usePreferences();
  return useMemo(() => getSiteData(lang), [lang]);
}
