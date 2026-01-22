import { MenuItem, MetricCategory, StatCardProps, ConceptCardProps } from './types';

export const MENU_ITEMS: MenuItem[] = [
  { id: 'home', icon: 'home', label: '홈' },
  { id: 'definitions', icon: 'menu_book', label: '용어 정의', count: 12 },
  { id: 'analysis', icon: 'analytics', label: '분석' },
  { id: 'team', icon: 'groups', label: '팀', count: 3 },
  { id: 'settings', icon: 'settings', label: '설정' },
];

export const METRIC_DEFINITIONS: MetricCategory[] = [
  {
    category: '슈팅 (Shot)',
    items: [
      { name: '유효 슈팅', definition: '득점이 되었거나, 골문으로 향하는 볼을 골키퍼가 직접 저지한 경우.' },
      { name: '블락 슈팅', definition: '슈팅 시도 후 골키퍼에게 도달하기 전, 수비수의 신체나 스틱에 맞고 굴절/차단된 경우.' },
      { name: '빗나간 슈팅', definition: '수비나 GK의 방해 없이 골대 범위 밖(옆/위)으로 나간 슈팅.' }
    ]
  },
  {
    category: '패스 (Passing)',
    items: [
      { name: '어시스트', definition: '득점으로 연결된 마지막 패스. (단, 리바운드 상황은 제외 등 기준 설정 필요)' },
      { name: '스쿱 패스', definition: '공중으로 띄워 보내는 패스. 성공: 상대 수비 라인을 넘어 아군에게 연결됨 / 실패: 차단되거나 아군에게 연결되지 않음.' },
      { name: '25y 진입', definition: '상대방 25야드 라인 안으로 패스 횟수 / 실패: 차단되거나 아군에게 연결되지 않음.' },
      { name: '서클 진입 (Circle Entry)', definition: '상대방 서클 안으로 패스 / 실패: 차단되거나 아군에게 연결되지 않음.' }
    ]
  },
  {
    category: 'PC (Penalty Corner)',
    items: [
      { name: '다이렉트 푸쉬/플릭', definition: 'Push-out 된 볼을 멈춘 후, 타격 없이 밀거나 튕겨서(Flick) 직접 슈팅하는 방식.' },
      { name: '다이렉트 히트', definition: 'Push-out 된 멈춘 후, 스틱을 휘둘러 강하게 때려서 직접 슈팅하는 방식.' },
      { name: '전술/터치', definition: '직접 슈팅 대신 패스나 변칙 작전을 통해 동료의 터치나 굴절로 득점을 노리는 방식.' }
    ]
  },
  {
    category: '드리블 (Dribble)',
    items: [
      { name: '1:1 돌파', definition: '볼을 소유한 상태에서 상대 수비수 1명을 기술적으로 제치고 소유권을 유지하며 전진한 경우.' },
      { name: '전진 드리블', definition: '상대의 방해 여부와 상관없이 혼자서 볼을 가지고 25야드(약 23m) 이상 상대 진영으로 전진한 경우.' }
    ]
  },
  {
    category: '턴오버 (Turnover)',
    items: [
      { name: '턴오버 (Turnover)', definition: '패스 미스나 터치 실수로 공격권을 허무하게 넘겨준 경우. (강제/비강제 구분 권장)' }
    ]
  },
  {
    category: '수비',
    items: [
      { name: '태클 (Tackle)', definition: '1:1 상황에서 볼 소유권을 뺏거나 상대 공격을 저지(터치아웃 포함). 성공: 탈취 / 실패: 파울 혹은 돌파 허용.' },
      { name: '스틸 (Steal)', definition: '상대의 패스 경로를 미리 예측하여 중간에 차단(인터셉트)한 경우.' },
      { name: '슈팅 블락 (Block)', definition: '수비수가 몸이나 스틱을 던져 상대의 슈팅 궤적을 물리적으로 차단한 행위.' }
    ]
  },
  {
    category: '골키퍼 (GK)',
    items: [
      { name: '선방 (Save)', definition: '실점으로 연결될 수 있는 유효 슈팅을 골키퍼가 직접 막아낸 횟수.' }
    ]
  }
];

export const SUMMARY_CARDS: StatCardProps[] = [
  {
    category: '전체 슈팅',
    title: '정의',
    subtitle: '득점을 위한 모든 시도'
  },
  {
    category: '결과 (Outcome)',
    title: '득점 (Goal)',
    subtitle: '공이 골라인을 완전히 넘어감'
  },
  {
    category: '과정 (Process)',
    title: 'xG (기대 득점)',
    subtitle: '기대 득점 값 (Expected Goals)'
  }
];

export const CONCEPT_CARDS: ConceptCardProps[] = [
  {
    icon: 'login',
    iconColorClass: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
    title: '서클 침투 (Circle Penetration)',
    description: '공격 팀이 상대방의 슈팅 서클(D) 내에서 공을 통제하는 순간.',
    noteLabel: '제약 조건',
    note: '결과를 노리지 않고 즉시 밖으로 드리블하여 나가는 경우는 집계되지 않습니다.'
  },
  {
    icon: 'swap_horiz',
    iconColorClass: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20',
    title: '전환/역습 (Transition)',
    description: '수비 진영에서 공을 탈취한 후 10초 이내에 서클에 진입하는 상황.',
    noteLabel: '가치',
    note: '경기 속도를 나타내는 높은 위협도의 공격 지표입니다.'
  }
];