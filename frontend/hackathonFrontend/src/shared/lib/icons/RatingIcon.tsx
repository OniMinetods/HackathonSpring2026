import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../../../shared/constants/colors';

interface RatingIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export const RatingIcon = ({
  width = 40,
  height = 40,
  color = Colors.primaryGrey,
}: RatingIconProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 40 40" fill="none">
      <Path
        d="M23.7455 17.1676L20 15.1351L23.7455 13.1027L25.4545 8.64865L27.1636 13.1027L30.9091 15.1351L27.1636 17.1676L25.4545 21.6216L23.7455 17.1676ZM5.45455 25.9459L7.16364 21.4919L10.9091 19.4595L7.16364 17.427L5.45455 12.973L3.74545 17.427L0 19.4595L3.74545 21.4919L5.45455 25.9459ZM13.6364 15.1351L15.6182 9.92432L20 7.56757L15.6182 5.21081L13.6364 0L11.6545 5.21081L7.27273 7.56757L11.6545 9.92432L13.6364 15.1351ZM6.36364 40L17.2727 27.0054L24.5455 35.6541L40 14.9838L37.4364 11.9351L24.5455 29.1676L17.2727 20.5189L3.63636 36.7568L6.36364 40Z"
        fill={color}
      />
    </Svg>
  );
};
