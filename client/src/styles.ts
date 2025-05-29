import { css } from "@linaria/core";

export interface Theme {
  colors: {
    background: string;
    surface1: string;
    surface2: string;

    bgHover: string;
    bgActive: string;
    bgDisabled: string;
    
    text: string;
    textDisabled: string;
    title: string;
    subtitle: string;

    iconDark: string;
    iconLight: string;
    iconGray: string;

    green: string;
    greenHover: string;
    blue: string;
    blueHover: string;
    red: string;
    redHover: string;
    gray: string;
  };
}


export const LightTheme: Theme = {
  colors: {
    background: "#eee",
    surface1: "#fff",
    surface2: "#eee",

    bgHover: "rgba(0, 0, 0, 0.04)",
    bgActive: "rgba(0, 0, 0, 0.1)",
    bgDisabled: "rgba(0, 0, 0, 0.05)",
    
    text: "#333",
    textDisabled: "#eee",
    title: "#777",
    subtitle: "#999",
    iconLight: "#fff",
    iconDark: "#aaa",
    iconGray: "#ccc",

    green: "#5fdd5a",
    greenHover: "#38bf2a",
    blue: "#03a9f4",
    blueHover: "#28769c",
    red: "#f44336",
    redHover: "#d32f2f",
    gray: "#888",
  },
}

export const font = {
  size: {
    s: 12,
    m: 16,
    l: 20,
    xl: 24,
    xxl: 28,
    x3l: 32,
    x4l: 36,
    x5l: 40,
  },
}

export const size = {
  phone: { h: 580, w: 300, },
  navbar: { h: 60, },
  tabs: { h: 50, },
  contacts: { top: { h: 50, }, },
  contact: { top: { h: 50, }, },
  history: { top: { h: 50, }, },
  setting: { top: { h: 50, }, },
}

const pulsatingShaking = css`
  animation: shaking 0.6s ease-in-out 0.1s infinite;

  @keyframes shaking {
    20% {
      transform: rotate(-10deg) scale(1.01);
    }
    25% {
      transform: rotate(-12deg) scale(1.05);
    }
    30% {
      transform: rotate(-10deg) scale(1.09);
    }
    50% {
      transform: rotate(0deg) scale(1.1);
    }
    70% {
      transform: rotate(10deg) scale(1.09);
    }
    75% {
      transform: rotate(12deg) scale(1.05);
    }
    80% {
      transform: rotate(10deg) scale(1.01);
    }
  }
`;

export const styles = {
  pulsatingShaking,
}
