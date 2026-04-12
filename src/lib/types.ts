export type BaseWidget = {
  colSpan?: number;
};

export type StatCardWidget = BaseWidget & {
  type: 'StatCard';
  title: string;
  value: string;
};

export type ChartWidgetData = BaseWidget & {
  type: 'Chart';
  title: string;
  dataRef: string;
};

export type IntegrationListWidget = BaseWidget & {
  type: 'IntegrationList';
  title: string;
};

export type DashboardWidget = StatCardWidget | ChartWidgetData | IntegrationListWidget;

export interface AdminLayoutConfig {
  projectId: string;
  layout: DashboardWidget[];
}
