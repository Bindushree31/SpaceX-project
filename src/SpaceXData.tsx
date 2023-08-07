import React, { useState, useRef, useEffect } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import client from './graphql';
import './SpaceXData.css';

const GET_LAUNCHES = gql`
  query GetLaunches($searchText: String) {
    launches(find: { mission_name: $searchText }) {
      mission_name
      rocket {
        rocket_name
        rocket_type
      }
    }
  }
`;

interface Launch {
  mission_name: string;
  rocket: {
    rocket_name: string;
    rocket_type: string;
  };
}

const SpaceXData: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const [launchData, setLaunchData] = useState<Launch[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [getLaunches, { loading, error, data }] = useLazyQuery(GET_LAUNCHES, {
    client: client,
    variables: { searchText },
  });

  useEffect(() => {
    if (data && data.launches) {
      const filteredData = data.launches.filter((launch: Launch) =>
        launch.rocket.rocket_name.toLowerCase().includes(searchText.toLowerCase())
      );

      setDataLoaded(true);
      if (searchText.trim() === '') {
        setLaunchData(filteredData);
      } else {
        const sortedData = filteredData.sort((a: Launch, b: Launch) =>
          a.mission_name.localeCompare(b.mission_name)
        );
        setLaunchData(sortedData);
      }
    }
  }, [data, searchText]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getLaunches();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  if (!dataLoaded && loading) return <div>Loading...</div>;
  if (error) return <div>Error! {error.message}</div>;

  return (
    <div>
      <div className="banner">
        {/* Your banner image or content goes here */}
      </div>
      <form className="form-container" onSubmit={handleSearchSubmit}>
        <input className="input-form"
          type="text"
          placeholder="Enter the rocket name here"
          value={searchText}
          ref={searchInputRef}
          onChange={handleInputChange}
        />
        <button className="form-button" type="submit">Search</button>
      </form>
      {launchData.length > 0 || dataLoaded ? (
        <div className="data-table-container">
          <table>
            <thead>
              <tr>
                <th>Rocket Name</th>
                <th>Mission Name</th>
                <th>Rocket Type</th>
              </tr>
            </thead>
            <tbody>
              {launchData.map((launch) => (
                <tr key={launch.mission_name}>
                  <td>{launch.rocket.rocket_name}</td>
                  <td>{launch.mission_name}</td>
                  <td>{launch.rocket.rocket_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default SpaceXData;
