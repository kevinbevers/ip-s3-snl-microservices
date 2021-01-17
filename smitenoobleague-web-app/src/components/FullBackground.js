import React from "react";
import Img from 'react-optimized-image';
import fallBackSrc from "public/images/dark_bg.jpg"
// Full page responsive background image
const bgStyle = {
    minHeight: "100%",
    minWidth: "1920px",
    width: "100%",
    height: "auto",
    position: "fixed",
    top: "0",
    left: "0",
    zIndex: "-1",
  };

export default function FullBackground({src}) {

  return (
    <>
    {src == "dark_bg" ? <Img webp height={100} width={100} sizes={[1920, 480,425]} src={require("public/images/dark_bg.jpg")} style={bgStyle} draggable={false} alt="BG"/> 
    : src == "news_bg" ? <Img webp height={100} width={100} sizes={[1920, 480,425]} src={require("public/images/news_bg.jpg")} style={bgStyle} draggable={false} alt="BG"/> 
    : src == "rules_bg" ? <Img webp height={100} width={100} sizes={[1920, 480,425]} src={require("public/images/rules_bg.jpg")} style={bgStyle} draggable={false} alt="BG"/>
    : <Img webp height={100} width={100} sizes={[1920, 480,425]} src={require("public/images/dark_bg.jpg")} style={bgStyle} draggable={false} alt="BG"/>}
    </>
    
  );
}