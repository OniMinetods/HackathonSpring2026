import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../../../shared/constants/colors';

interface ArrowIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export const ArrowIcon = ({
  width = 40,
  height = 15,
  color = Colors.primaryGreenFourth,
}: ArrowIconProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 40 15" fill="none">
      <Path
        d="M52.3671 58.6357H170.313C172.901 58.6357 175 56.5369 175 53.9482V32.0732C175 29.4845 172.901 27.3857 170.313 27.3857H52.3671V9.39392C52.3671 1.04157 42.269 -3.14124 36.3628 2.76462L2.746 36.3814C-0.915332 40.0428 -0.915332 45.9787 2.746 49.6396L36.3628 83.2564C42.2687 89.1623 52.3671 84.9795 52.3671 76.6271V58.6357Z"
        fill={color}
      />
    </Svg>
  );
};
