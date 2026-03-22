export type DealerCenterTopRow = {
  rank: number;
  user_id: number;
  name: string;
  total_points: number;
};

export type DealerTotalsTopRow = {
  rank: number;
  dealer_code: string;
  total_points_sum: number;
};

export type DealerCenterRatingResponse = {
  dealer_code: string;
  my_rank: number | null;
  my_points: number;
  top_10: DealerCenterTopRow[];
  dealer_totals_top: DealerTotalsTopRow[];
};
