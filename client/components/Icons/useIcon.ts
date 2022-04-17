import { Palette } from '@client/styles/styled';
import { useTheme } from 'styled-components';
import { CssSize } from '@shared/types';

export type SvgSize =
  | { color: keyof Palette; size: CssSize }
  | { color: keyof Palette; width: CssSize; height: CssSize };

interface IconProps {
  color: string;
  width: CssSize;
  height: CssSize;
}

export function useIcon(props: SvgSize): IconProps {
  const themeContext = useTheme();
  const { width, height } = 'width' in props ? props : { width: props.size, height: props.size };
  return {
    width,
    height,
    color: themeContext.palette[props.color],
  };
}
