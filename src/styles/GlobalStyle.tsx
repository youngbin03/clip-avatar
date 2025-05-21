import { createGlobalStyle } from 'styled-components';
import { colors } from './theme';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Pretendard';
    font-weight: 100;
    font-display: swap;
    src: url('/src/assets/fonts/Pretendard-Thin.woff2') format('woff2');
  }
  
  @font-face {
    font-family: 'Pretendard';
    font-weight: 200;
    font-display: swap;
    src: url('/src/assets/fonts/Pretendard-ExtraLight.woff2') format('woff2');
  }
  
  @font-face {
    font-family: 'Pretendard';
    font-weight: 300;
    font-display: swap;
    src: url('/src/assets/fonts/Pretendard-Light.woff2') format('woff2');
  }
  
  @font-face {
    font-family: 'Pretendard';
    font-weight: 400;
    font-display: swap;
    src: url('/src/assets/fonts/Pretendard-Regular.woff2') format('woff2');
  }
  
  @font-face {
    font-family: 'Pretendard';
    font-weight: 500;
    font-display: swap;
    src: url('/src/assets/fonts/Pretendard-Medium.woff2') format('woff2');
  }
  
  @font-face {
    font-family: 'Pretendard';
    font-weight: 600;
    font-display: swap;
    src: url('/src/assets/fonts/Pretendard-SemiBold.woff2') format('woff2');
  }
  
  @font-face {
    font-family: 'Pretendard';
    font-weight: 700;
    font-display: swap;
    src: url('/src/assets/fonts/Pretendard-Bold.woff2') format('woff2');
  }
  
  @font-face {
    font-family: 'Pretendard';
    font-weight: 800;
    font-display: swap;
    src: url('/src/assets/fonts/Pretendard-ExtraBold.woff2') format('woff2');
  }
  
  @font-face {
    font-family: 'Pretendard';
    font-weight: 900;
    font-display: swap;
    src: url('/src/assets/fonts/Pretendard-Black.woff2') format('woff2');
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  body {
    background: linear-gradient(to bottom, ${colors.white}, ${colors.gray10});
    color: ${colors.black};
    min-height: 100vh;
    overflow-x: hidden;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button, input, textarea {
    font-family: inherit;
    outline: none;
    border: none;
  }

  button {
    cursor: pointer;
    background: none;
  }

  ul, ol, li {
    list-style: none;
  }

  img {
    display: block;
    max-width: 100%;
  }

  h1, h2, h3, h4, h5, h6 {
    line-height: 1.2;
    font-weight: 700;
  }

  h1 {
    font-size: 2.5rem;
  }

  h2 {
    font-size: 2rem;
  }

  h3 {
    font-size: 1.5rem;
  }

  p {
    line-height: 1.6;
  }

  ::selection {
    background: ${colors.bandiBlue35};
    color: ${colors.white};
  }

  /* 스크롤바 스타일링 */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${colors.gray20};
  }

  ::-webkit-scrollbar-thumb {
    background: ${colors.bandiBlue35};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${colors.bandiBlue55};
  }

  /* 페이지 전환 애니메이션 */
  .page-transition-enter {
    opacity: 0;
    transform: translateY(20px);
  }

  .page-transition-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.3s, transform 0.3s;
  }

  .page-transition-exit {
    opacity: 1;
  }

  .page-transition-exit-active {
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  /* 입력 필드 포커스 효과 */
  input:focus, textarea:focus {
    box-shadow: 0 0 0 2px ${colors.bandiBlue35};
  }
`;

export default GlobalStyle; 