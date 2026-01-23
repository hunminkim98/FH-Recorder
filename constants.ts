import { MenuItem, MetricCategory, ConceptCardProps } from './types';

export const MENU_ITEMS: MenuItem[] = [
  { id: 'home', icon: 'home', label: '홈' },
  { id: 'definitions', icon: 'menu_book', label: '용어 정의', count: 30 },
  { id: 'analysis', icon: 'analytics', label: '분석' },
  { id: 'team', icon: 'groups', label: '팀', count: 3 },
  { id: 'settings', icon: 'settings', label: '설정' },
];

export const METRIC_DEFINITIONS: MetricCategory[] = [
  {
    category: '슈팅 (Shot)',
    items: [
      {
        name: '유효 슈팅',
        symbol: 'Shot on Target, SoT',
        definition: '득점이 되었거나, 골문으로 향하는 볼을 골키퍼가 직접 저지한 경우.'
      },
      {
        name: '블락 슈팅',
        symbol: 'Block, BLK',
        definition: '슈팅 시도 후 골키퍼에게 도달하기 전, 수비수의 신체나 스틱에 맞고 굴절/차단된 경우.'
      },
      {
        name: '빗나간 슈팅',
        symbol: 'Off the Target, OFF',
        definition: '수비나 GK의 방해 없이 골대 범위 밖(옆/위)으로 나간 슈팅.'
      }
    ]
  },
  {
    category: '패스 (Passing)',
    items: [
      {
        name: '어시스트',
        symbol: 'Assist, AST, → 로 표기',
        definition: '득점으로 연결된 마지막 패스. (단, 리바운드 상황은 제외 등 기준 설정 필요)'
      },
      {
        name: '스쿱 패스',
        symbol: 'Scoop, SCP, ∩ 로 표기',
        definition: '공중으로 띄워 보내는 패스. 성공: 상대 수비 라인을 넘어 아군에게 연결됨 / 실패: 차단되거나 아군에게 연결되지 않음.'
      },
      {
        name: '25y 진입',
        symbol: '25Y Entry (좌25L, 중25M, 우25R)',
        definition: '상대방 25야드 라인 안으로 패스 횟수 / 실패: 차단되거나 아군에게 연결되지 않음. (25 - 25야드에 진입했을 때 표기)'
      },
      {
        name: '서클 진입',
        symbol: 'Circle Entry (좌CL, 중CM, 우CR)',
        definition: '상대방 서클 안으로 패스 / 실패: 차단되거나 아군에게 연결되지 않음. (C - 서클에 진입했을 때 표기)'
      }
    ]
  },
  {
    category: '슈팅 기술 (Tech)',
    items: [
      {
        name: '다이렉트 푸쉬/플릭',
        symbol: 'Direct Push/Flick, P',
        definition: 'Push-out 된 볼을 멈춘 후, 타격 없이 밀거나 튕겨서(Flick) 직접 슈팅하는 방식.'
      },
      {
        name: '다이렉트 히트',
        symbol: 'Direct Heat, H',
        definition: 'Push-out 된 볼을 멈춘 후, 스틱을 휘둘러 강하게 때려서 직접 슈팅하는 방식.'
      },
      {
        name: '전술/터치',
        symbol: 'Touch',
        definition: '직접 슈팅 대신 패스나 변칙 작전을 통해 동료의 터치나 굴절로 득점을 노리는 방식.'
      }
    ]
  },
  {
    category: 'PC (Penalty Corner)',
    items: [
      {
        name: '페널티코너 허용',
        symbol: 'Penalty Corners Allow, PCA',
        definition: '(1) 수비수가 서클 안에서 실수로 발에 공이 닿거나, 공격수에게 스틱을 거는 \'비의도적\'인 행위를 했을 때\n(2) 수비수가 공을 소유하지 않은 상태에서 \'의도적\'으로 공격수를 방해하거나 신체 접촉을 했을 때 선언\n(3) 반드시 서클 안 지역이 아니더라도 25Y 지역에서 발생하는 \'의도적\' 반칙 행위에는 페널티코너(PC)가 선언\n(4) 의도적으로 자기 팀 백라인 밖으로 공을 내보낼 경우\n(5) 서클 안에서 위험하게 스틱을 휘두르거나, 공을 높게 띄우는 경우(Dangerous Play)',
        definitionRowSpan: 2
      },
      {
        name: '페널티코너 획득',
        symbol: 'Penalty Corners Made, PCM',
        definition: '(동일)',
        definitionRowSpan: 0
      }
    ]
  },
  {
    category: 'PS (Penalty Stroke)',
    items: [
      {
        name: '페널티스트로크',
        symbol: 'Penalty Stroke, PS',
        definition: '공격수와 골키퍼가 골대 정중앙으로부터 7야드(6.4m) 지점에서 대치하는 상황으로 축구의 페널티킥과 유사.'
      },
      {
        name: '페널티스트로크 놓침',
        symbol: 'Penalty Stroke Miss, PSM',
        definition: '페널티스트로크 상황에서 득점에 성공하지 못한 경우.'
      }
    ]
  },
  {
    category: '드리블 (Dribble)',
    items: [
      {
        name: '1:1 돌파',
        symbol: '1 on 1, 1:1',
        definition: '볼을 소유한 상태에서 상대 수비수 1명을 기술적으로 제치고 소유권을 유지하며 전진한 경우.'
      },
      {
        name: '드리블',
        symbol: 'Drible, ~ 로 표기',
        definition: '볼을 소유한 상태에서 소유권을 유지하며 전진한 경우.'
      },
      {
        name: '전진 드리블',
        symbol: 'Forward drible, 전진',
        definition: '상대의 방해 여부와 상관없이 혼자서 볼을 가지고 25야드(약 23m) 이상 상대 진영으로 전진한 경우.'
      }
    ]
  },
  {
    category: '턴오버 (Turnover)',
    items: [
      {
        name: '턴오버',
        symbol: 'Turn over, TO',
        definition: '패스 미스나 터치 실수로 공격권을 허무하게 넘겨준 경우. (강제/비강제 구분 권장)'
      }
    ]
  },
  {
    category: '수비',
    items: [
      {
        name: '태클',
        symbol: 'Tackle, TKL',
        definition: '1:1 상황에서 볼 소유권을 뺏거나 상대 공격을 저지(터치아웃 포함). 성공: 탈취 / 실패: 파울 혹은 돌파 허용.'
      },
      {
        name: '스틸',
        symbol: 'Steal, STL',
        definition: '상대의 패스 경로를 미리 예측하여 중간에 차단(인터셉트)한 경우.'
      },
      {
        name: '슈팅 블락',
        symbol: 'Shot Block, BLK',
        definition: '수비수가 몸이나 스틱을 던져 상대의 슈팅 궤적을 물리적으로 차단한 행위.'
      }
    ]
  },
  {
    category: '골키퍼 (GK)',
    items: [
      {
        name: '선방',
        symbol: 'Save, SV',
        definition: '실점으로 연결될 수 있는 유효 슈팅을 골키퍼가 직접 막아낸 횟수.'
      }
    ]
  },
  {
    category: '반칙 (Foul)',
    items: [
      {
        name: '그린 카드',
        symbol: 'Green Card, GRC',
        definition: '규정에 반대되는 행동으로 인해 심판에게 2분간 경기에서 임시로 제외'
      },
      {
        name: '옐로우 카드',
        symbol: 'Yellow Card, YLC',
        definition: '규정에 반대되는 행동으로 인해 심판에게 5분간 경기에서 임시로 제외'
      },
      {
        name: '레드 카드',
        symbol: 'Red Card, RDC',
        definition: '규정에 반대되는 행동으로 인해 심판에게 영구적으로 경기에서 제외'
      }
    ]
  },
  {
    category: '득점 (Scored)',
    items: [
      {
        name: '필드골',
        symbol: 'Field Goals Scored, FGS',
        definition: 'Open Play 상황에서 서클 안에서 슛을 하여 득점한 상황'
      },
      {
        name: '페널티코너 득점',
        symbol: 'Penalty Corners Scored, PCS',
        definition: 'Dead ball 상황에서 약속된 세트피스 전술을 통해 득점에 성공한 상황'
      },
      {
        name: '페널티스트로크 득점',
        symbol: 'Penalty Strokes Scored, PSS',
        definition: 'Dead ball 상황에서 선수 개인의 슈팅 능력을 통해 득점에 성공한 상황으로 축구의 페널티 킥과 유사'
      }
    ]
  }
];

export const CONCEPT_CARDS: ConceptCardProps[] = [
  {
    icon: 'login',
    iconColorClass: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
    title: '서클 침투 (Circle Penetration)',
    description: '공격 팀이 상대방의 슈팅 서클(D) 내에서 공을 통제하는 순간.',
    noteLabel: '참고 사항',
    note: '예시입니다.'
  },
  {
    icon: 'swap_horiz',
    iconColorClass: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20',
    title: '전환/역습 (Transition)',
    description: '수비 진영에서 공을 탈취한 후 10초 이내에 서클에 진입하는 상황.',
    noteLabel: '참고 사항',
    note: '예시입니다.'
  }
];