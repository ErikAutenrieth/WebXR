import React from "react";
// @ts-ignore
import styled from "styled-components";

import mountain1 from "./pictures/mountain1.svg";

import mountain2 from "./pictures/mountain2.svg";
import mountain3 from "./pictures/mountain3.svg";
import mountain4 from "./pictures/mountain4.svg";
import mountain5 from "./pictures/mountain5.svg";
import heroWave from "./pictures/hero-wave.svg";
import blurLayer from "./pictures/blur-layer.webp";

export default function HeroBackground() {
	return (
		<Wrapper>
			<Wave1 />
			<Wave2 />
			<BlurLayer />
			<Wave3 />
			<Wave4 />
			<Wave5 />
			<Wave6 />
		</Wrapper>
	);
}

const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 1300px;
  background: linear-gradient(180deg, #322d6d 6.33%, #663182 39.13%);
  text-align: center;
  overflow: hidden;
`;

const Wave = styled.div`
  position: absolute;
  width: 100%;
  background-position: top center;
  background-repeat: no-repeat;
  background-size: 100%;

  @media (max-width: 1440px) {
    background-size: 1440px;
  }
`;

const Wave1 = styled(Wave)`
  top: 190px;
  height: 446px;
  background-image: url(${mountain1});
`;

const Wave2 = styled(Wave)`
  top: 160px;
  height: 464px;
  background-image: url(${mountain2});
`;

const Wave3 = styled(Wave)`
  top: 347px;
  height: 408px;
  background-image: url(${mountain3});
`;

const Wave4 = styled(Wave)`
  top: 466px;
  height: 457px;
  background-image: url(${mountain4});
`;

const Wave5 = styled(Wave)`
  top: 450px;
  height: 867px;
  background-image: url(${mountain5});
`;

const Wave6 = styled(Wave)`
  top: 700px;
  height: 630px;
  background-image: url(${heroWave});
`;

const BlurLayer = styled(Wave)`
  top: 100px;
  height: 1503px;
  background-image: url(${blurLayer});
`;
