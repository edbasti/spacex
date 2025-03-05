import React, { useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchLaunches } from "./redux/launchesSlice";
import "./LaunchList.scss";
import Spinner from './components/Spinner/Spinner'

const LaunchList = () => {
  const dispatch = useDispatch();
  const { launches, loading, hasMore, search } = useSelector((state) => state.launches);
  const pageRef = useRef(1);

  useEffect(() => {
    dispatch(fetchLaunches(pageRef.current));
  }, [dispatch]);

  const observer = useRef();
  const lastLaunchRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            pageRef.current += 1;
            dispatch(fetchLaunches(pageRef.current));
          }
        },
        { threshold: 1.0 }
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, dispatch]
  );

  const filteredLaunches = launches.filter((launch) =>
    launch.mission_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="spacex-launches">
      <input
        type="text"
        className="search-input"
        placeholder="Search by mission name"
        value={search}
        onChange={(e) => dispatch({ type: "launches/setSearch", payload: e.target.value })}
      />
      <div className="launch-list">
        {filteredLaunches.map((launch, index) => {
          if (index === filteredLaunches.length - 1) {
            return (
              <div ref={lastLaunchRef} key={launch.flight_number} className="launch-item">
                {launch.mission_name} ({launch.launch_year})
              </div>
            );
          }
          return (
            <div key={launch.flight_number} className="launch-item">
              {launch.mission_name} ({launch.launch_year})
            </div>
          );
        })}
      </div>
      {loading && <Spinner color='red' />}
      {!hasMore && <p className="no-more">No more launches to load.</p>}
    </div>
  );
};

export default LaunchList;
