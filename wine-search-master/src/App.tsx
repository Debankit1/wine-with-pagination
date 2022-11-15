import "./App.css";
import { useEffect, useState } from "react";
import { getWines } from "./services/wine";
import { Heading } from '@chakra-ui/react';
import { wineType } from "./utils/typeDefs";
import { useDispatch } from "react-redux";
import { storeWines } from "./redux/slices/wineSlice";



function App() {
  const [wines, setWines] = useState<wineType[]>([]);
  const [input, setInput] = useState<string>("");
  const [searchedWines, setSearchedWines] = useState<wineType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostperPage] = useState(10);
  const dispatch = useDispatch();



  useEffect(() => {
    (async () => {
      const winesRes = await getWines();
      if (winesRes.status === 200) {
        const { data } = winesRes;
        dispatch(storeWines(data));
        setWines(data);
        setSearchedWines(data);
      }
    })();
  }, []);

  const handleSearch = (value: string) => {
    setInput(value);
    const filteredList = wines?.filter(
      (e: wineType) =>
        e.wine.toLowerCase().includes(value.toLowerCase()) ||
        e.winery.toLowerCase().includes(value.toLowerCase())
    );
    setSearchedWines(filteredList);
  };
  const lastpostindex = currentPage * postPerPage;
  const firstpostindex = lastpostindex - postPerPage;
  const displayPage = wines.
    slice(firstpostindex, lastpostindex)
    .map((wines) => {
      return (
        <div>
          <h1>{wines.wine}</h1>
          <h1>{wines.winery}</h1>
          <h1>{wines.image}</h1>
        </div>
      );
    }

    );





  return (

    <div className="App">
      <Heading><h2>🍷 WineShop 🍷</h2></Heading>
      <Heading>Enter The Wine name to begin the search...</Heading>
      <div>
        <input
          type="text"
          onChange={(e) => handleSearch(e.target.value)}
          value={input}
          className="search"
          placeholder="Search"
        />
      </div>


      <ul className="wineList">
        {searchedWines.map((e: wineType, i) => (
          <li className="flex gap-2 item" key={i}>
            <div>
              <img
                src={
                  e.image}
                alt="wine"
                className="wineImg"
              />
            </div>
            <div className="details">
              <div>
                <h2 className="heading">{e.wine}</h2>
                <p className="desc text-gray">Winery: {e.winery}</p>
              </div>
              <div>
                <div className="text-gray">Reviews: {e.rating.reviews}</div>



              </div>

            </div>
          </li>
        ))}
      </ul>
      <div>{displayPage}</div>
    </div>

  );
}

export default App;

