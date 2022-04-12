// styled.d.ts
import 'styled-components';

interface IFont {
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: number;
  marginBottom: number;
}

interface Palette {
  /**
   * used for background and area coloring
   */
  background: string;

  /**
   * used for elevated, more prominent or focused UI elements like
   *
   * - status bars and text editor gutters
   * - panels, modals and floating popups like notifications or auto completion
   * - user interaction/form components like buttons, text/select fields or checkboxes
   */
  backgroundProminent: string;

  /**
   * used to colorize the currently active text editor line as well as selection - and text highlighting color
   */
  backgroundBright: string;

  /**
   * used for UI elements like indent- and wrap guide marker.
   * In the context of code syntax highlighting it is used for comments and invisible/non-printable characters
   */
  backgroundBrightest: string;

  /**
   * used for text
   */
  white: string;

  /**
   * used for subtle UI elements or state animations such as hover/focus
   */
  whiteBright: string;

  /**
   * used for elavated text
   */
  whiteBrightest: string;

  // TODO: ??
  accent: string;

  /**
   * Used for UI elements that should, next to the primary accent color, stand out and get more visual attention.
   */
  bright: string;

  /** Used for primary UI elements with main usage purposes that require the most visual attention
   */
  primary: string;

  /** Used for secondary UI elements that also require more visual attention than other elements. */
  secondary: string;

  /** Used for tertiary UI elements that require more visual attention than default elements */
  tertiary: string;

  red: string;
  orange: string;
  yellow: string;
  green: string;
  magenta: string;
}

declare module 'styled-components' {
  export interface DefaultTheme {
    theme: 'dark' | 'light';
    palette: Palette;
    shadows: string[];
    special: {
      borderRadius: number;
    };
    spacing: {
      xSmall: number;
      small: number;
      normal: number;
      large: number;
      Xlarge: number;
    };
    typography: {
      body: IFont;
      caption: IFont;
      h1: IFont;
      h2: IFont;
      h3: IFont;
      h4: IFont;
      h5: IFont;
    };
    zIndex: {
      background: number;
      header: number;
    };
  }
}
