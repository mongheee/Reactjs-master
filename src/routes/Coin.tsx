import { useEffect, useState } from "react";
import {
  useLocation,
  useParams,
  Routes,
  Route,
  Link,
  useMatch,
} from "react-router-dom";
import styled from "styled-components";
import Chart from "./Chart";
import Price from "./Price";

const Overview = styled.div`
  background-color: #192a56;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
`;
const OverviewItem = styled.div`
  padding: 20px;
  color: ${(porps) => porps.theme.textColor};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  span {
    padding: 5px;
    font-size: 15px;
  }
  span:first-child {
    font-weight: 600;
    text-transform: uppercase;
  }
`;
const Description = styled.p`
  color: ${(props) => props.theme.textColor};
  margin: 20px 10px;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0;
  gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
  color: ${(props) => props.theme.bgColor};
  text-align: center;
  text-transform: uppercase;
  font-size: 15px;
  font-weight: 600;
  background-color: ${(props) => props.theme.textColor};
  padding: 7px 0;
  border-radius: 10px;
  background-color: ${(props) =>
    props.isActive ? props.theme.bgColor : props.theme.textColor};
  color: ${(props) =>
    props.isActive ? props.theme.textColor : props.theme.bgColor};
  a {
    display: block;
  }
`;

const Loader = styled.h1`
  color: "#dff9fb";
  font-weight: 600;
  font-size: 20px;
  display: flex;
  justify-content: center;
`;

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 50px;
  font-weight: 700;
  color: ${(props) => props.theme.accentColor};
`;

interface RouteState {
  state: {
    name: string;
  };
}

interface IInfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  contract: string;
  platform: string;
  description: string;
  open_source: boolean;
  hardware_wallet: boolean;
  proof_type: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

interface IPriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

function Coin() {
  const [loading, setLoading] = useState(true);
  const { coinId } = useParams();
  /*   const location = useLocation();
  const name = location.state as RouteState; */
  const { state } = useLocation() as RouteState;
  const [info, setInfo] = useState<IInfoData>();
  const [priceInfo, setPriceInfo] = useState<IPriceData>();
  const priceMatch = useMatch(`/${coinId}/price`);
  const chartMatch = useMatch(`/${coinId}/chart`);
  useEffect(() => {
    (async () => {
      const infoData = await (
        await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
      ).json();
      const priceData = await await (
        await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
      ).json();
      setInfo(infoData);
      setPriceInfo(priceData);
      setLoading(false);
    })();
  }, [coinId]);
  return (
    <Container>
      <Header>
        <Title>
          {state?.name ? state.name : loading ? "Loading..." : info?.name}
        </Title>
      </Header>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>Rank</span>
              <span>{info?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>symbol</span>
              <span>{info?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>open source</span>
              <span>{info?.open_source ? "YES" : "NO"}</span>
            </OverviewItem>
          </Overview>
          <Description>{info?.description}</Description>
          <Overview>
            <OverviewItem>
              <span>total suply</span>
              <span>{priceInfo?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>max suply</span>
              <span>{priceInfo?.max_supply}</span>
            </OverviewItem>
          </Overview>
          <Tabs>
            <Tab isActive={priceMatch !== null}>
              <Link to={`/${coinId}/price`}>Price</Link>
            </Tab>
            <Tab isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`}>Chart</Link>
            </Tab>
          </Tabs>
          <Routes>
            <Route path="price" element={<Price />} />
            <Route path="chart" element={<Chart />} />
          </Routes>
        </>
      )}
    </Container>
  );
}

export default Coin;
