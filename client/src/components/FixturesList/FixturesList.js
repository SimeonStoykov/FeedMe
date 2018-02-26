import React from 'react';
import './FixturesList.css';

const FixturesList = ({ events, eventsAreLoading, fetchingEventsError, selectedSubcategory, showFixture }) => (
    <div className="fixtures-list-container">
        <h1 className="fixtures-list-title">Fixtures for {selectedSubcategory}</h1>
        {
            events && events.length > 0 &&
            events.map(e => {
                let dateTime = new Date(e.startTime).toLocaleString();
                return (
                    <div
                        key={e.eventId}
                        className={e.suspended ? "fixtures-list-suspended" : "fixtures-list"}
                        onClick={() => {
                            if (e.suspended) {
                                return false;
                            }
                            return showFixture(e);
                        }}
                    >
                        <div className="fixtures-list-date">{dateTime}</div>
                        <div className="fixtures-list-name">{e.name}{e.suspended && ' - Suspended'}</div>
                    </div>
                );
            })
        }
        {
            events && events.length === 0 && !eventsAreLoading && !fetchingEventsError &&
            <div>There are no fixtures</div>
        }
        {
            eventsAreLoading &&
            <div>Loading...</div>
        }
        {
            fetchingEventsError &&
            <div className="error-loading-fixtures">Error loading fixtures!</div>
        }
    </div>
);

export default FixturesList;
