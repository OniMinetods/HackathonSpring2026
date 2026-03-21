import { GreenStackButton } from '@components/GreenStackButton';

export type CalculatorEntryButtonProps = {
  title: string;
};

export const CalculatorEntryButton = ({ title }: CalculatorEntryButtonProps) => {
  return <GreenStackButton title={title} href="/calculator" />;
};
