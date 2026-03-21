import * as React from 'react';
import Svg from 'react-native-svg';
import { Colors } from '../../../shared/constants/colors';

interface ProfileIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export const ProfileIcon = ({
  width = 30,
  height = 40,
  color = Colors.primaryGrey,
}: ProfileIconProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 30 40" fill="none">
      <path
        d="M0 40C0 31.5842 6.71572 24.7619 15 24.7619C23.2843 24.7619 30 31.5842 30 40H0ZM15 22.8571C8.78438 22.8571 3.75 17.7429 3.75 11.4286C3.75 5.11429 8.78438 0 15 0C21.2156 0 26.25 5.11429 26.25 11.4286C26.25 17.7429 21.2156 22.8571 15 22.8571Z"
        fill={color}
      />
    </Svg>
  );
};
