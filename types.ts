export interface MenuItem {
  id: string;
  icon: string;
  label: string;
  count?: number;
}

export interface MetricItem {
  name: string;
  symbol: string;
  definition: string;
  definitionRowSpan?: number;
}

export interface MetricCategory {
  category: string;
  items: MetricItem[];
}

export interface StatCardProps {
  category: string;
  title: string;
  subtitle: string;
}

export interface ConceptCardProps {
  icon: string;
  iconColorClass: string;
  title: string;
  description: string;
  noteLabel: string;
  note: string;
}